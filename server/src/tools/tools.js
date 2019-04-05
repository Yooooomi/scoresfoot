const Joi = require('joi');
const db = require('../db/match');

function isLogged(req, res, next) {
  return next();
  if (Boolean(req.user)) {
    return next();
  }
  return res.status(401).end();
}

function isAdmin(req, res, next) {
  return next();
  if (req.user.admin) return next();
  return res.status(401).end();
}

function validate(schema, target = 'body') {
  return function(req, res, next) {
    const { value, error } = Joi.validate(req[target], schema);

    req.body = value;
    req.value = value;

    if (error) return res.status(400).end();
    return next();
  }
}

function validMatch(location) {
  return async function(req, res, next) {
    const match = await db.getMatch('id', req[location].matchId);

    if (!match) return res.status(400).end();
    return next();
  }
}

module.exports = {
  isLogged,
  isAdmin,
  validate,
  validMatch,
};