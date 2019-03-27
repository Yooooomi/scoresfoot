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

  routes.get('/match/needupdate', async (req, res) => {
    try {
      const matches = await db.getMatchesEndedWithoutScores();
      return res.status(200).send(matches);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  const setScoreSchema = Joi.object().keys({
    matchId: Joi.string().required(),
    localScore: Joi.number().required().min(0),
    guestScore: Joi.number().required().min(0),
  });

  routes.post('/match/setscore', validate(setScoreSchema), isLogged, isAdmin, async (req, res) => {
    const { matchId, localScore, guestScore } = req.body;

    try {
      await db.setMatchScore(matchId, localScore, guestScore);
      return res.status(200).end();
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  return routes;
}