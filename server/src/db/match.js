const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  date: { type: mongoose.Schema.Types.Date },
  cote: { type: mongoose.Schema.Types.Number, default: 1 },
});

const TeamSchema = new mongoose.Schema({
  name: String,
  logo: String,
});

const User = mongoose.model('user', UserSchema);
const Prono = mongoose.model('prono', PronoSchema);
const Match = mongoose.model('match', MatchSchema);
const Team = mongoose.model('team', TeamSchema);

function getUser(field, value) {
  return User.findOne({
    [field]: value,
  });
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

  if (existing.pronos.some(e => e.match === matchId)) {
    throw new Error({
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

function addMatch(localId, guestId, date) {
  const match = new Match({
    local: localId,
    guest: guestId,
    date,
  });

  return match.save();
}

function addTeam(name, logo) {
  const team = new Team({
    name,
    logo,
  });

  return team.save();
}

function getTeams() {
  return Team.find({});
}

module.exports = {
  getUser,
  registerUser,
  getMatch,
  writeProno,
  modifyProno,
  addMatch,
  addTeam,
  getTeams,
};