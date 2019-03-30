const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { pointsEarned } = require('../tools/rawTools');

mongoose.connect(`mongodb://localhost:27017/scoresfoot?authSource=admin`, {
  useNewUrlParser: true,
  user: process.env.MONGODB_USERNAME,
  pass: process.env.MONGODB_PASSWORD
});
// mongoose.connect(`mongodb://mongo:27017/scoresfoot?authSource=admin`, {
//   useNewUrlParser: true,
//   user: process.env.MONGODB_USERNAME,
//   pass: process.env.MONGODB_PASSWORD
// });

const UserSchema = new mongoose.Schema({
  admin: { type: Boolean, default: true },
  username: String,
  password: String,
  pronos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prono', default: [] }],
});

const PronoSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  local: Number,
  guest: Number,
  coeff: Number,
});

const StepSchema = new mongoose.Schema({
  matchs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match', default: [] }],
  name: String,
});

const CompetitionSchema = new mongoose.Schema({
  steps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Step', default: [] }],
  start: { type: mongoose.Schema.Types.Date },
  name: String,
});

const MatchSchema = new mongoose.Schema({
  local: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  localScore: { type: Number, default: -1 },
  guestScore: { type: Number, default: -1 },
  date: { type: mongoose.Schema.Types.Date },
  cote: { type: mongoose.Schema.Types.Number, default: 1 },
});

const TeamSchema = new mongoose.Schema({
  name: String,
  logo: String,
  history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match', default: [] }],
});

const User = mongoose.model('User', UserSchema);
const Prono = mongoose.model('Prono', PronoSchema);
const Match = mongoose.model('Match', MatchSchema);
const Team = mongoose.model('Team', TeamSchema);
const Competition = mongoose.model('Competition', CompetitionSchema);
const Step = mongoose.model('Step', StepSchema);

async function getUser(field, value) {
  const user = await User.findOne({
    [field]: value,
  });
  return user;
}

async function getFullUser(field, value) {
  const userFound = await User.findOne({
    [field]: value,
  }).populate({
    path: 'pronos',
    model: 'Prono',
    populate: {
      path: 'match',
      model: 'Match',
      populate: {
        path: 'local guest',
        model: 'Team'
      }
    }
  }).lean();

  let points = userFound.pronos.filter(e => e.match.localScore !== -1).reduce((acc, curr) => {
    return acc + pointsEarned(curr);
  }, 0);

  const todoMatches = await Match.find({
    _id: { $nin: userFound.pronos.map(e => e.match) },
    date: { $gt: (new Date()).toISOString() },
  }).sort('date').populate('local guest');
  userFound.todos = todoMatches;
  userFound.points = points;
  console.log('THE USER', userFound);
  return userFound;
}

function getMatch(field, value) {
  return Match.findOne({
    [field]: value,
  });
}

async function addMatchNames(date, stepName, team1Name, team2Name, score1 = -1, score2 = -1) {
  const teams = await Team.find({
    name: { $in: [team1Name, team2Name] }
  });


  const team1 = teams.find(e => e.name === team1Name);
  const team2 = teams.find(e => e.name === team2Name);

  let match = new Match({
    local: team1._id,
    guest: team2._id,
    localScore: score1,
    guestScore: score2,
    date
  });

  const l = Team.findByIdAndUpdate(team1._id, { $push: { history: match._id } });
  const g = Team.findByIdAndUpdate(team2._id, { $push: { history: match._id } });

  await Step.findOneAndUpdate({ name: stepName }, {
    $push: { matchs: match._id },
  });
  await l;
  await g;
  match = await match.save();
  return match;
}

function registerUser(name, password) {
  const hashedPassword = bcrypt.hashSync(password);

  const user = new User({
    username: name,
    password: hashedPassword,
  });
  return user.save();
}

function newCompetition(name, start) {
  return (new Competition({
    name,
    start,
  }).save())
}

async function newStep(competition, name) {
  let step = new Step({
    name,
  }).save();
  step = await step;
  await Competition.findByIdAndUpdate(competition, {
    $push: {
      steps: step._id
    }
  });
  return step;
}

function getStep(stepId) {
  return Step.findById(stepId).populate({
    path: 'matchs',
    populate: {
      path: 'local guest',
      model: 'Team',
    }
  });
}

function updateMatch(matchId, date) {
  return Match.findByIdAndUpdate(matchId, {
    date: date.toISOString(),
  });
}

function removeMatch(matchId) {
  return Match.findByIdAndRemove(matchId);
}

async function writeProno(userId, matchId, local, guest, coeff) {

  // TODO: more efficient way
  const existing = await User.findOne({
    _id: userId,
  }).populate('pronos');

  if (existing.pronos.some(e => e.match.toString() === matchId)) {
    throw ({
      code: 'ALREADY_PRONOD',
      message: 'Already pronostic\'d'
    });
  }

  const prono = new Prono({
    match: matchId,
    local,
    guest,
    coeff,
  });

  const written = await prono.save();

  await User.findByIdAndUpdate(userId, {
    $push: {
      pronos: written._id,
    },
  });
  return written;
}

async function modifyProno(userId, matchId, local, guest, coeff) {
  const user = await User.findById(userId).populate('pronos');

  const prono = user.pronos.find(e => e.matchId === matchId);

  if (!prono) {
    throw new Error({
      code: 'NOT_FOUND',
      message: 'Prono not found',
    });
  }

  return Prono.findByIdAndUpdate(prono._id, {
    local,
    guest,
    coeff,
  });
}

function getCompetitions() {
  return Competition.find({});
}

function getCompetition(competition) {
  return Competition.findById(competition).populate({
    path: 'steps',
    model: 'Step',
    populate: {
      path: 'matchs',
      model: 'Match',
    }
  });
}

async function addMatch(step, localId, guestId, date) {
  const match = await new Match({
    local: localId,
    guest: guestId,
    date,
  }).save();

  const l = Team.findByIdAndUpdate(localId, {
    $push: { history: match._id },
  });
  const g = Team.findByIdAndUpdate(guestId, {
    $push: { history: match._id },
  });
  const s = Step.findByIdAndUpdate(step, {
    $push: {
      matchs: match._id,
    },
  });

  await l;
  await g;
  await s;
  return match;
}

function getMatchesEndedWithoutScores() {
  return Match.find({ localScore: -1, date: { $lt: new Date() } }).populate('local guest');
}

async function setMatchScore(matchId, local, guest) {
  await Match.findByIdAndUpdate(matchId, {
    localScore: local,
    guestScore: guest,
  });
}

function addTeam(name, logo) {
  const team = new Team({
    name,
    logo,
  });

  return team.save();
}

function getTeams() {
  return Team.find({}).populate('history');
}

function getTeam(id) {
  return Team.findById(id).populate({
    path: 'history', populate: {
      path: 'local guest',
      model: 'Team',
    }
  });
}

function getConfrontations(team1, team2) {
  return Match.find({
    local: { $in: [team1, team2] },
  }).sort('date');
}

module.exports = {
  getUser,
  getFullUser,
  registerUser,
  getMatch,
  writeProno,
  modifyProno,
  removeMatch,
  addMatch,
  setMatchScore,
  getMatchesEndedWithoutScores,
  addTeam,
  addMatchNames,
  getTeam,
  getTeams,
  updateMatch,
  newCompetition,
  newStep,
  getStep,
  getCompetitions,
  getCompetition,
  getConfrontations,
};