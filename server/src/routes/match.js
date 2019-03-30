const routes = require('express').Router();
const { isLogged, validate, validMatch, isAdmin } = require('../tools/tools');
const Joi = require('joi');
const db = require('../db/match');

module.exports = function () {

  const newCompetitionSchema = Joi.object().keys({
    name: Joi.string().min(1).required(),
    start: Joi.any().required(),
  });

  routes.post('/competition/new', validate(newCompetitionSchema), isLogged, isAdmin, async (req, res) => {
    const { name, start } = req.body;

    try {
      const newcomp = await db.newCompetition(name, start);
      return res.status(200).send(newcomp);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  routes.get('/competition/getall', isLogged, async (req, res) => {
    try {
      const comps = await db.getCompetitions();
      return res.status(200).send(comps);
    } catch (e) {
      return res.status(500).end();
    }
  });

  routes.get('/competition/step/:id', isLogged, async (req, res) => {
    try {
      const step = await db.getStep(req.params.id);
      return res.status(200).send(step);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  const modifyMatchSchema = Joi.object().keys({
    matchId: Joi.string().required(),
    date: Joi.any().required(),
  });

  routes.post('/match/update', validate(modifyMatchSchema), isLogged, isAdmin, async (req, res) => {
    const { matchId, date } = req.body;

    try {
      await db.updateMatch(matchId, new Date(date));
      return res.status(200).end();
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  const removeMatchSchema = Joi.object().keys({
    matchId: Joi.string().required(),
  });

  routes.post('/match/delete', validate(removeMatchSchema), isLogged, isAdmin, async (req, res) => {
    const { matchId } = req.body;

    try {
      await db.removeMatch(matchId);
      return res.status(200).end();
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  routes.get('/competition/:id', isLogged, async (req, res) => {
    const { id } = req.params;

    try {
      const comp = await db.getCompetition(id);
      return res.status(200).send(comp);
    } catch (e) {
      return res.status(500).end();
    }
  });

  const newStepSchema = Joi.object().keys({
    competitionId: Joi.string().required(),
    name: Joi.string().required(),
  });

  routes.post('/competition/newstep', validate(newStepSchema), isLogged, isAdmin, async (req, res) => {
    const { competitionId, name } = req.body;

    try {
      const step = await db.newStep(competitionId, name);
      return res.status(200).send(step);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  const newMatchSchema = Joi.object().keys({
    stepId: Joi.string().required(),
    local: Joi.string().required(),
    guest: Joi.string().required(),
    date: Joi.any().required(),
  });

  routes.post('/match/new', validate(newMatchSchema), isLogged, isAdmin, async (req, res) => {
    const { local, guest, date, stepId } = req.body;

    try {
      await db.addMatch(stepId, local, guest, date);
      return res.status(200).end();
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  const newMatchNameSchema = Joi.object().keys({
    stepName: Joi.string().required(),
    local: Joi.string().required(),
    guest: Joi.string().required(),
    localScore: Joi.number().required(),
    guestScore: Joi.number().required(),
    date: Joi.any().required(),
  });

  routes.post('/match/new_by_names', validate(newMatchNameSchema), isLogged, isAdmin, async (req, res) => {
    const { local, guest, date, stepName, localScore, guestScore } = req.body;

    try {
      await db.addMatchNames(date, stepName, local, guest, localScore, guestScore);
      return res.status(200).end();
    } catch (e) {
      console.error(e);
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