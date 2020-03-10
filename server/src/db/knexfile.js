// Update with your config settings.

const config = {
  user: process.env.DB_USER,
  pwd: process.env.DB_PASS,
  endpoint: process.env.DB_ENDPOINT,
}

module.exports = {
  client: 'pg',
  connection: `postgresql://${config.user}:${config.pwd}@${config.endpoint}/scoresfoot`,
};
