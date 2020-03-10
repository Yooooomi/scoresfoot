const { User, Team } = require('./models/schema');
const knex = require('knex');

const getUserInfos = async (id, stepId) => {
  const user = await User.query().findById(id).eager('pronos.match.[local, guest]').modifyEager('pronos', builder => {
    builder.whereIn('match_id', knex.raw(`
      SELECT
        m.id
      FROM steps s
      JOIN matches m ON m.step_id = s.id
      WHERE s.id = ${stepId}
    `))
  });
  return user;
};

const getUserStats = async (id, compId = -1) => {
  const stats = await User.knex().raw(`
    SELECT
      u.id, u.username,
      SUM (
        CASE
          WHEN p.local_score = m.local_score AND p.guest_score = m.guest_score THEN 3 * p.coeff
          WHEN p.local_score - p.guest_score > 0 AND m.local_score - m.guest_score > 0 THEN 1 * p.coeff
          WHEN p.local_score - p.guest_score < 0 AND m.local_score - m.guest_score < 0 THEN 1 * p.coeff
          WHEN p.local_score - p.guest_score = 0 AND m.local_score - m.guest_score = 0 THEN 1 * p.coeff
          ELSE -1 * p.coeff
        END
      ) AS points,
      SUM (
        CASE
          WHEN p.local_score = m.local_score AND p.guest_score = m.guest_score THEN 1 ELSE 0 END
      ) AS sj,
      SUM (
        CASE
          WHEN p.local_score - p.guest_score > 0 AND m.local_score - m.guest_score > 0 OR
              p.local_score - p.guest_score < 0 AND m.local_score - m.guest_score < 0 OR
              p.local_score - p.guest_score = 0 AND m.local_score - m.guest_score = 0 THEN 1
          ELSE 0
        END
      ) AS bt,
      SUM (
        CASE
          WHEN (p.local_score - p.guest_score > 0 AND m.local_score - m.guest_score < 0) OR
              (p.local_score - p.guest_score < 0 AND m.local_score - m.guest_score > 0) OR
              (p.local_score - p.guest_score = 0 AND m.local_score - m.guest_score != 0) THEN 1
          ELSE 0
        END
      ) AS failed,
      SUM (p.coeff) AS bet,
      SUM (p.local_score + p.guest_score) AS goals,
      SUM (1) as pronos
    FROM users u
    JOIN pronos p ON p.user_id = u.id
    JOIN competitions c ON c.id = ${compId === -1 ? 'c.id' : compId}
    JOIN steps s ON s.competition_id = c.id
    JOIN matches m ON m.local_score != -1 AND m.step_id = s.id AND m.id = p.match_id
    WHERE u.id = ${id}
    GROUP BY u.id
  `);
  return stats.rows[0];
}

const getUserRanking = async (compId) => {
  const users = await User.knex().raw(`
    SELECT
      u.id, u.username,
      SUM (
        CASE
          WHEN p.local_score = m.local_score AND p.guest_score = m.guest_score THEN 3 * p.coeff
          WHEN p.local_score - p.guest_score > 0 AND m.local_score - m.guest_score > 0 THEN 1 * p.coeff
          WHEN p.local_score - p.guest_score < 0 AND m.local_score - m.guest_score < 0 THEN 1 * p.coeff
          WHEN p.local_score - p.guest_score = 0 AND m.local_score - m.guest_score = 0 THEN 1 * p.coeff
          ELSE -1 * p.coeff
        END
      ) AS points,
      SUM (
        CASE
          WHEN p.local_score = m.local_score AND p.guest_score = m.guest_score THEN 1 ELSE 0 END
      ) AS sj,
      SUM (
        CASE
          WHEN p.local_score - p.guest_score > 0 AND m.local_score - m.guest_score > 0 OR
               p.local_score - p.guest_score < 0 AND m.local_score - m.guest_score < 0 OR
               p.local_score - p.guest_score = 0 AND m.local_score - m.guest_score = 0 THEN 1
          ELSE 0
        END
      ) AS bt,
      SUM (
        CASE
          WHEN (p.local_score - p.guest_score > 0 AND m.local_score - m.guest_score < 0) OR
               (p.local_score - p.guest_score < 0 AND m.local_score - m.guest_score > 0) OR
               (p.local_score - p.guest_score = 0 AND m.local_score - m.guest_score != 0) THEN 1
          ELSE 0
        END
      ) AS failed,
      SUM (p.coeff) AS bet,
      SUM (p.local_score + p.guest_score) AS goals,
      SUM (1) as pronos
    FROM users u
    JOIN pronos p ON p.user_id = u.id
    JOIN competitions c ON c.id = ${compId}
    JOIN steps s ON s.competition_id = c.id
    JOIN matches m ON m.local_score != -1 AND m.step_id = s.id AND m.id = p.match_id
    GROUP BY u.id
  `);
  return users.rows;
};

const getTeamsRanking = async (compId) => {
  const ranks = await Team.knex().raw(`
    SELECT
        t.id, t.name,
      SUM (
        CASE
          WHEN (t.id = m.local_team_id OR t.id = m.guest_team_id) AND m.local_score = m.guest_score THEN 1
          WHEN t.id = m.local_team_id AND m.local_score > m.guest_score THEN 3
          WHEN t.id = m.local_team_id AND m.local_score < m.guest_score THEN 0
          WHEN t.id = m.guest_team_id AND m.local_score < m.guest_score THEN 3
          WHEN t.id = m.guest_team_id AND m.local_score > m.guest_score THEN 0
          ELSE 0
        END
      ) AS points,
      SUM (
        CASE
          WHEN t.id = m.local_team_id AND m.local_score > m.guest_score THEN 1
          WHEN t.id = m.guest_team_id AND m.local_score < m.guest_score THEN 1
          ELSE 0
        END
      ) AS wins,
      SUM (
        CASE
          WHEN (t.id = m.local_team_id OR t.id = m.guest_team_id) AND m.local_score = m.guest_score THEN 1
          ELSE 0
        END
      ) AS draws,
      SUM (
        CASE
          WHEN t.id = m.local_team_id AND m.local_score < m.guest_score THEN 1
          WHEN t.id = m.guest_team_id AND m.local_score > m.guest_score THEN 1
          ELSE 0
        END
      ) AS losses,
      SUM (1) AS played,
      SUM (
        CASE
          WHEN t.id = m.local_team_id THEN m.local_score
          ELSE m.guest_score
        END
      ) AS goals,
      SUM (
        CASE
          WHEN t.id = m.local_team_id THEN m.guest_score
          ELSE m.local_score
        END
      ) AS t_goals
    FROM teams t
    JOIN competitions c ON c.id = ${compId}
    JOIN steps s ON s.competition_id = c.id
    JOIN matches m ON m.step_id = s.id AND (m.local_team_id = t.id OR m.guest_team_id = t.id) AND m.local_score != -1
    GROUP BY t.id
  `);
  return ranks.rows;
};

const getTeamStats = async (compId, teamId) => {
  const stats = await Team.knex().raw(`
    SELECT
        t.id, t.name,
      SUM (
        CASE
          WHEN (t.id = m.local_team_id OR t.id = m.guest_team_id) AND m.local_score = m.guest_score THEN 1
          WHEN t.id = m.local_team_id AND m.local_score > m.guest_score THEN 3
          WHEN t.id = m.local_team_id AND m.local_score < m.guest_score THEN 0
          WHEN t.id = m.guest_team_id AND m.local_score < m.guest_score THEN 3
          WHEN t.id = m.guest_team_id AND m.local_score > m.guest_score THEN 0
          ELSE 0
        END
      ) AS points,
      SUM (
        CASE
          WHEN t.id = m.local_team_id AND m.local_score > m.guest_score THEN 1
          WHEN t.id = m.guest_team_id AND m.local_score < m.guest_score THEN 1
          ELSE 0
        END
      ) AS wins,
      SUM (
        CASE
          WHEN (t.id = m.local_team_id OR t.id = m.guest_team_id) AND m.local_score = m.guest_score THEN 1
          ELSE 0
        END
      ) AS draws,
      SUM (
        CASE
          WHEN t.id = m.local_team_id AND m.local_score < m.guest_score THEN 1
          WHEN t.id = m.guest_team_id AND m.local_score > m.guest_score THEN 1
          ELSE 0
        END
      ) AS losses,
      SUM (1) AS played,
      SUM (
        CASE
          WHEN t.id = m.local_team_id THEN m.local_score
          ELSE m.guest_score
        END
      ) AS goals,
      SUM (
        CASE
          WHEN t.id = m.local_team_id THEN m.guest_score
          ELSE m.local_score
        END
      ) AS t_goals
    FROM teams t
    JOIN competitions c ON c.id = ${compId}
    JOIN steps s ON s.competition_id = c.id
    JOIN matches m ON m.step_id = s.id AND (m.local_team_id = t.id OR m.guest_team_id = t.id) AND m.local_score != -1
    WHERE t.id = ${teamId}
    GROUP BY t.id
  `);
  return stats.rows[0];
};

module.exports = {
  getUserInfos,
  getUserRanking,
  getTeamsRanking,
  getUserStats,
  getTeamStats,
};