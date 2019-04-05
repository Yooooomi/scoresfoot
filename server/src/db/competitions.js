const { makeQuery } = require('./tools');

const newCompetition = async (name, start) => {
  const c = await makeQuery('INSERT INTO competitions (name, date) VALUES($1, $2) RETURNING *', [name, date.toISOString()]);
  return c[0];
};

const getCompetitions = () => {
  return makeQuery('SELECT * FROM competitions');
}

const getStep = async id => {
  const step = await makeQuery(`
  SELECT
    *
  FROM steps s
  JOIN matches m ON m.step_id = s._id
  WHERE _id = $1`, [id], true);
  
};