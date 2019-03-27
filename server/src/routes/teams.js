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

    try {
      await db.addTeam(name, logo);
      res.status(200).end();
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

  return routes;
}