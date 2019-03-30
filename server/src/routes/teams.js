const routes = require('express').Router();
const { isLogged, validate, validMatch, isAdmin } = require('../tools/tools');
const Joi = require('joi');
const db = require('../db/match');

module.exports = function () {

  const newTeamSchema = Joi.object().keys({
    name: Joi.string().min(1).max(128).required(),
    logo: Joi.string().default('yaya.com'),
  });

  routes.post('/teams/new', validate(newTeamSchema), isLogged, isAdmin, async (req, res) => {
    const { name, logo } = req.body;

    console.log('Creating', name);

    try {
      const team = await db.addTeam(name, logo);
      res.status(200).send(team);
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  });

  routes.get('/teams', async (req, res) => {
    try {
      const teams = await db.getTeams();
      return res.status(200).send(teams);
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  })

  routes.get('/teams/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const team = await db.getTeam(id);
      return res.status(200).send(team);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  const confrontationSchema = Joi.object().keys({
    team1: Joi.string().required(),
    team2: Joi.string().required(),
  });

  routes.get('/teams/confrontation', validate(confrontationSchema, 'query'), async (req, res) => {
    const { team1, team2 } = req.value;

    try {
      const confrontations = await db.getConfrontations(team1, team2);
      return res.status(200).send(confrontations);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  return routes;
}