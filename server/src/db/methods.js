
const getFullUser = (field, value);
const registerUser = (username, password);

const newCompetition = (name, start);
const getCompetitions;

const getCompetition = (id);
const newStep = (competitionId, name);
const getStep = (id);
const getLastCompetition;

const addMatch = (stepId, local, guest, date);
const addMatchNames = (date, stepName, local, guest, local_score, guest_score);
const getMatches = (offset, number);
const getMatch = (id);
const setMatchScore = (id, local, guest);
const updateMatch = (id, date);
const removeMatch = (id);
const getMatchesEndedWithoutScore;

const writeProno = (userId, matchId, local, guest, coeff);
const modifyProno = (userId, local, guest, coeff);

const addTeam = (name, logo);
const getTeams;
const getTeam = (id);
const getConfrontations = (id1, id2);
const getTeamsRanking = (compId);

const getUserStats = (id);
const getUserRanking = (compId);