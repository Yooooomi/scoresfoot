const { Match, Step, Team } = require('./models/schema');

const addMatch = (stepId, local, guest, date) => {
  return Match.query().insert({
    step_id: stepId,
    local_team_id: local,
    guest_team_id: guest,
    date,
  });
};

const addMatchNames = (date, stepName, local, guest, local_score, guest_score) => {
  return Match.query().insert({
    date,
    step_id: Step.query().findOne('name', stepName).select('id').limit(1),
    local_team_id: Team.query().findOne('name', local).select('id').limit(1),
    guest_team_id: Team.query().findOne('name', guest).select('id').limit(1),
    local_score: local_score,
    guest_score: guest_score,
  });
};

const getMatches = (offset, number) => {
  return Match.query().orderBy('date').offset(offset).limit(number);
};

const getMatch = (location, value) => {
  return Match.query().findOne({ [location]: value }).eager('[local, guest]');
};

const setMatchScore = (id, local, guest) => {
  return Match.query().findById(id).update({
    local_score: local,
    guest_score: guest,
  });
};

const updateMatch = (id, date) => {
  return Match.query().findById(id).update({
    date
  });
};

const removeMatch = (id) => {
  return Match.query().deleteById(id);
};

const getMatchesEndedWithoutScore = () => {
  return Match.query().where('local_score', -1).orderBy('date').eager('[local, guest]');
};

const getConfrontations = (id1, id2) => {
  return Match.query()
    .where('local_team_id', id1)
    .andWhere('guest_team_id', id2)
    .orWhere('local_team_id', id2)
    .andWhere('guest_team_id', id1)
    .orderBy('date');
};

module.exports = {
  addMatch,
  addMatchNames,
  getMatches,
  getMatch,
  setMatchScore,
  updateMatch,
  removeMatch,
  getMatchesEndedWithoutScore,
  getConfrontations,
};