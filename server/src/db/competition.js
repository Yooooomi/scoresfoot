const { Competition, Step } = require('./models/schema');

const newCompetition = (name) => {
  return Competition.query().insert({
    name,
  }).returning('*');
};

const getCompetitions = () => {
  return Competition.query();
};

const getCompetition = (id) => {
  return Competition.query().findById(id).eager('[steps.[matches]]');
};

const newStep = (competitionId, name) => {
  return Step.query().insert({
    competition_id: competitionId,
    name,
  }).returning('*');
};

const getStep = (id) => {
  return Step.query().findById(id).eager('matches.[local, guest]');
};

const getLastCompetition = async () => {
  const compets = await Competition.query()./*orderBy('date').*/orderBy('id', 'desc').limit(1);
  if (compets.length) return compets[0];
  return null;
}

module.exports = {
  newCompetition,
  getCompetitions,
  getCompetition,
  newStep,
  getStep,
  getLastCompetition,
};