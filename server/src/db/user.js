const bcrypt = require('bcryptjs');
const { User, Match } = require('./models/schema');

const getFullUser = async (field, value) => {
  const user = await User.query().findOne({
    [field]: value
  }).eager('pronos.match.[local, guest]');
  const todos = await Match.query().whereNotIn('id', user.pronos.map(e => e.match_id)).eager('[local, guest]');
  user.todos = todos;
  return user;
};

const registerUser = (username, password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);

  return User.query().insert({
    username,
    password: hashedPassword,
  });
};

module.exports = {
  getFullUser,
  registerUser,
};
