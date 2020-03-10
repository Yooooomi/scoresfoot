const { Team } = require('./models/schema');

const addTeam = (name, logo) => {
  return Team.query().insert({
    name,
    logo,
  });
};

const getTeams = () => {
  return Team.query();
};

const getTeam = (id) => {
  return Team.query().findById(id).eager('matches.[local, guest]');
};

module.exports = {
  addTeam,
  getTeams,
  getTeam,
};