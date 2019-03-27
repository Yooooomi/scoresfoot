const routes = require('express').Router();
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db/match');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { validate, isLogged } = require('../tools/tools');

require('numbermap')();

module.exports = function (passport) {

  //Strategy to check if password given equals hashed password
  //Required to login
  passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' },
    async (username, password, done) => {
      let user = null;
      try {
        user = await db.getFullUser('username', username);
      }
      catch (e) {
        console.error(e);
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (bcrypt.compareSync(password, user.password)) {
        done(null, user);
      } else {
        done(e, false, { message: 'Incorrect password.', error: e });
      }
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    db.getFullUser('_id', id)
      .then(u => done(null, u))
      .catch(e => done(null, null));
  });

  const registerSchema = Joi.object().keys({
    username: Joi.string().min(4).max(64).required(),
    password: Joi.string().min(4).max(64).required(),
  });

  routes.post('/register', validate(registerSchema), async (req, res) => {
    const { username, password } = req.body;

    try {
      await db.registerUser(username, password);
      res.status(200).end();
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  });

  //Login using passport middleware
  routes.post('/login',
    passport.authenticate('local'),
    (req, res) => {
      res.status(200).send(req.user);
    }
  );

  //Simply logs out using passport middleware
  routes.get('/logout', async (req, res) => {
    await req.logout();
    req.session.save();
    req.session.user = '';
    return res.status(200).send('successfuly logout');
  });

  //It only exists to check if it's protected from a not logged user
  routes.get('/protected', isLogged, (req, res) => {
    return res.status(200).send({ status: 'Authorized' });
  });

  routes.get('/me', (req, res) => {
    return res.status(200).send(req.user);
  });

  return routes;
};
