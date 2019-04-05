const bcrypt = require('bcryptjs');
const { makeQuery, makeHierarchy, makeHierarchyArray } = require('./tools');

const registerUser = async (username, password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await client.query('INSERT INTO users (username, password) VALUES($1, $2) RETURNING *', [username, hashedPassword]);
  return user.rows[0];
};

const fulfillUser = user => {
  let pronos = makeQuery('SELECT * FROM pronos WHERE user_id=$1', [user._id]);

  pronos = await pronos;
  return user;
};

const getFullUser = async name => {
  const user = await makeQuery('SELECT * FROM users u WHERE username=$1', [name], false, true);
  let pronos = await makeQuery(`
    SELECT
      p._id, p.localBet, p.guestBet, m.local, m.guest, m.localScore, m.guestScore
    FROM pronos p
    JOIN matches m ON p.match_id = m._id
    WHERE p.user_id = $1
  `, [user._id]);
  user.pronos = makeHierarchyArray(pronos, ['local', 'guest', 'localScore', 'guestScore'], 'match', '_id');
}

const getUser = async id => {
  const userQuery = await client.query('SELECT * FROM users WHERE _id=$1', [id]);

  const user = userQuery.rows[0];

  const pronos = await client.query('SELECT * FROM pronos WHERE user_id=$1', [id]);

  user.pronos = pronos.rows;
  return user;
};

const userRanking = async compId => {
  const query = `
    SELECT
      u._id,
      SUM (
      CASE
        WHEN m.localScore = p.localScore AND m.guestScore = p.guest THEN 30 * p.coeff
        WHEN m.localScore > p.localScore AND m.guestScore > p.guest THEN 10 * p.coeff
        WHEN m.localScore = p.localScore AND m.guestScore = p.guest THEN 30 * p.coeff
        ELSE 0
      END
      )
    AS points
    FROM users u
    JOIN pronos p ON u._id = p.user_id
    JOIN matches m ON m._id = p.match_id
    JOIN steps s ON s._id = m.step_id
    JOIN competitions c ON c._id = s.competition_id
    WHERE c._id = $1
    GROUP BY u._id
  `;
  return await client.query(query, [compId]);
};

module.exports = {
  registerUser,
  getUser,
};