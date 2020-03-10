const routes = require('express').Router();
const { isLogged, validate, validMatch, isAdmin } = require('../tools/tools');
const Joi = require('joi');
const dbRanking = require('../db/ranking');
const dbCompet = require('../db/competition');

module.exports = function () {

  routes.get('/users/stats/:id', async (req, res) => {
    const { id } = req.params;
    const { compId } = req.query;

    try {
      const stats = await dbRanking.getUserStats(id, compId ? compId : -1);
      return res.status(200).send(stats);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  routes.get('/users/infos/:stepId/:id', async (req, res) => {
    const { id, stepId } = req.params;

    try {
      const stats = await dbRanking.getUserStats(id, stepId);
      return res.status(200).send({ stats, step });
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  routes.get('/users/ranking', async (req, res) => {
    try {
      const lastCompet = await dbCompet.getLastCompetition();
      const users = await dbRanking.getUserRanking(lastCompet.id);
      return res.status(200).send({ users, competition: lastCompet });
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  })

  return routes;
}