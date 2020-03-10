const routes = require('express').Router();
const { isLogged, validate, validMatch, isAdmin } = require('../tools/tools');
const Joi = require('joi');
const dbMatch = require('../db/match');
const dbCompet = require('../db/competition');

module.exports = function () {

  const newCompetitionSchema = Joi.object().keys({
    name: Joi.string().min(1).required(),
    start: Joi.any().required(),
  });

  routes.post('/competition/new', validate(newCompetitionSchema), isLogged, isAdmin, async (req, res) => {
    const { name, start } = req.body;

    try {
      const newcomp = await dbCompet.newCompetition(name);
      return res.status(200).send(newcomp);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  routes.get('/competition/getall', isLogged, async (req, res) => {
    try {
      const comps = await dbCompet.getCompetitions();
      return res.status(200).send(comps);
    } catch (e) {
      return res.status(500).end();
    }
  });

  routes.get('/competition/step/:id', isLogged, async (req, res) => {
    try {
      const step = await dbCompet.getStep(req.params.id);
      return res.status(200).send(step);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  const getLastSchema = Joi.object().keys({
    number: Joi.number().min(0).max(50).default(10),
    offset: Joi.number().min(0).default(0),
  });

  routes.get('/match/getlast', validate(getLastSchema, 'query'), isLogged, async (req, res) => {
    const { number, offset } = req.value;

    try {
      const matches = await dbMatch.getMatches(offset, number);
      return res.status(200).send(matches);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  routes.get('/match/get/:id', isLogged, async (req, res) => {
    const { id } = req.params;

    try {
      const match = await dbMatch.getMatch('id', id, true);
      return res.status(200).send(match);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  const modifyMatchSchema = Joi.object().keys({
    matchId: Joi.number().required(),
    date: Joi.any().required(),
  });

  routes.post('/match/update', validate(modifyMatchSchema), isLogged, isAdmin, async (req, res) => {
    const { matchId, date } = req.body;

    try {
      await dbMatch.updateMatch(matchId, new Date(date));
      return res.status(200).end();
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  const removeMatchSchema = Joi.object().keys({
    matchId: Joi.number().required(),
  });

  routes.post('/match/delete', validate(removeMatchSchema), isLogged, isAdmin, async (req, res) => {
    const { matchId } = req.body;

    try {
      await dbMatch.removeMatch(matchId);
      return res.status(200).end();
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  routes.get('/competition/:id', isLogged, async (req, res) => {
    const { id } = req.params;

    try {
      const comp = await dbCompet.getCompetition(id);
      return res.status(200).send(comp);
    } catch (e) {
      return res.status(500).end();
    }
  });

  const newStepSchema = Joi.object().keys({
    competitionId: Joi.number().required(),
    name: Joi.string().required(),
  });

  routes.post('/competition/newstep', validate(newStepSchema), isLogged, isAdmin, async (req, res) => {
    const { competitionId, name } = req.body;

    try {
      const step = await dbCompet.newStep(competitionId, name);
      return res.status(200).send(step);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  const newMatchSchema = Joi.object().keys({
    stepId: Joi.number().required(),
    local: Joi.number().required(),
    guest: Joi.number().required(),
    date: Joi.any().required(),
  });

  routes.post('/match/new', validate(newMatchSchema), isLogged, isAdmin, async (req, res) => {
    const { local, guest, date, stepId } = req.body;

    try {
      await dbMatch.addMatch(stepId, local, guest, date);
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
    local_score: Joi.number().required(),
    guest_score: Joi.number().required(),
    date: Joi.any().required(),
  });

  routes.post('/match/new_by_names', validate(newMatchNameSchema), isLogged, isAdmin, async (req, res) => {
    const { local, guest, date, stepName, local_score, guest_score } = req.body;

    try {
      console.log('here');
      await dbMatch.addMatchNames(date, stepName, local, guest, local_score, guest_score);
      console.log('here');
      return res.status(200).end();
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  routes.get('/match/needupdate', async (req, res) => {
    try {
      const matches = await dbMatch.getMatchesEndedWithoutScore();
      return res.status(200).send(matches);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  const setScoreSchema = Joi.object().keys({
    matchId: Joi.number().required(),
    local_score: Joi.number().required().min(0),
    guest_score: Joi.number().required().min(0),
  });

  routes.post('/match/setscore', validate(setScoreSchema), isLogged, isAdmin, async (req, res) => {
    const { matchId, local_score, guest_score } = req.body;

    try {
      await dbMatch.setMatchScore(matchId, local_score, guest_score);
      return res.status(200).end();
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  return routes;
}