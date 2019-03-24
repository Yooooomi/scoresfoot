const routes = require('express').Router();
const { isLogged, validate, validMatch, isAdmin } = require('../tools/tools');
const Joi = require('joi');
const db = require('../db/match');

module.exports = function () {
  const newMatchSchema = Joi.object().keys({
    local: Joi.string().required(),
    guest: Joi.string().required(),
    date: Joi.any().required(),
  });

  routes.post('/match/new', validate(newMatchSchema), isLogged, isAdmin, async (req, res) => {
    const { local, guest, date } = req.body;

    try {
      await db.addMatch(local, guest, date);
      return res.status(200).end();
    } catch (e) {
      return res.status(500).end();
    }
  });

  return routes;
}