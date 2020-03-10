const { User, Team } = require('./models/schema');

const getUserStats = (id) => {

};

const getUserRanking = async (compId) => {
  const users = await User.raw(`
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
  const ranks = await Team.raw(`
    SELECT
        t.id,
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
    JOIN matches m ON m.step_id = s.id AND (m.local_team_id = t.id OR m.guest_team_id = t.id)
    GROUP BY t.id
  `)
  return ranks.rows;
};

module.exports = {
  getUserStats,
  getUserRanking,
  getTeamsRanking,
};