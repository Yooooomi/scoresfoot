const routes = require('express').Router();
const { isLogged, validate, validMatch, isAdmin } = require('../tools/tools');
const Joi = require('joi');
const db = require('../db/match');

module.exports = function () {

  routes.get('/users/stats/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const stats = await db.getUserStats(id, 'TODO');
      return res.status(200).send(stats);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  routes.get('/users/ranking', async (req, res) => {
    try {
      const users = await db.getBestUsers();
      return res.status(200).send(users);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  })

  return routes;
}