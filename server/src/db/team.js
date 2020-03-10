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

const getTeam = async (id) => {
  const team = await Team.query()
    .findById(id)
    .withGraphFetched('[locals(order).[local, guest], guests(order).[local, guest]]')
    .modifiers({
      order(builder) {
        builder.orderBy('date', 'desc');
      },
    });
  team.matches = [...team.locals, ...team.guests];
  team.matches = team.matches.sort((a, b) => b.date.getTime() - a.date.getTime());
  delete team.locals;
  delete team.guests;
  return team;
};

module.exports = {
  addTeam,
  getTeams,
  getTeam,
};