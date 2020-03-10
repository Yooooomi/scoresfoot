const routes = require('express').Router();
const { isLogged, validate, validMatch, isAdmin } = require('../tools/tools');
const Joi = require('joi');
const dbTeam = require('../db/team');
const dbRanking = require('../db/ranking');
const dbCompet = require('../db/competition');
const dbMatch = require('../db/match');

module.exports = function () {

  const newTeamSchema = Joi.object().keys({
    name: Joi.string().min(1).max(128).required(),
    logo: Joi.string().default('yaya.com'),
  });

  routes.post('/teams/new', validate(newTeamSchema), isLogged, isAdmin, async (req, res) => {
    const { name, logo } = req.body;

    try {
      const team = await dbTeam.addTeam(name, logo);
      res.status(200).send(team);
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  });

  routes.get('/teams', async (req, res) => {
    try {
      const teams = await dbTeam.getTeams();
      return res.status(200).send(teams);
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  })

  routes.get('/teams/team/:id', async (req, res) => {
    const { id } = req.params;
    let { compId } = req.query;

    try {
      const team = await dbTeam.getTeam(id);
      
      if (compId) {
        if (compId === 'last') {
          compId = (await dbCompet.getLastCompetition()).id;
        }
        const stats = await dbRanking.getTeamStats(compId, team.id);
        team.stats = stats;
      }

      return res.status(200).send(team);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  const confrontationSchema = Joi.object().keys({
    team1: Joi.number().required(),
    team2: Joi.number().required(),
  });

  routes.get('/teams/confrontations', validate(confrontationSchema, 'query'), async (req, res) => {
    const { team1, team2 } = req.value;

    try {
      const confrontations = await dbMatch.getConfrontations(team1, team2);
      return res.status(200).send(confrontations);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  routes.get('/teams/ranking', async (req, res) => {
    let compId = req.query.compId;
    let comp = null;

    try {
      if (!compId)
        comp = (await dbCompet.getLastCompetition());
      else comp = await dbCompet.getCompetitionSimple(compId);
      const teams = await dbRanking.getTeamsRanking(comp.id);
      console.log(comp.id, teams);
      return res.status(200).send({ teams, competition: comp });
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  return routes;
}