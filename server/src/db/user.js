const bcrypt = require('bcryptjs');
const { User, Match, Prono } = require('./models/schema');

const getFullUser = async (field, value) => {
  const user = await User.query().findOne({
    [field]: value
  });

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
