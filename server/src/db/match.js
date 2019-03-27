const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { pointsEarned } = require('../tools/rawTools');

mongoose.connect(`mongodb://mongo:27017/scoresfoot?authSource=admin`, {
  useNewUrlParser: true,
  user: process.env.MONGODB_USERNAME,
  pass: process.env.MONGODB_PASSWORD
});

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
  }).sort('date').populate('local').populate('guest');
  userFound.todos = todoMatches;
  userFound.points = points;
  return userFound;
}

function getMatch(field, value) {
  return Match.findOne({
    [field]: value,
  });
}

function registerUser(name, password) {
  const hashedPassword = bcrypt.hashSync(password);

  const user = new User({
    username: name,
    password: hashedPassword,
  });
  return user.save();
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

async function addMatch(localId, guestId, date) {
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

  await l;
  await g;
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

module.exports = {
  getUser,
  getFullUser,
  registerUser,
  getMatch,
  writeProno,
  modifyProno,
  addMatch,
  setMatchScore,
  getMatchesEndedWithoutScores,
  addTeam,
  getTeams,
};