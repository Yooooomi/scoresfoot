const routes = require('express').Router();
const { isLogged, validate, validMatch } = require('../tools/tools');
const Joi = require('joi');
const dbProno = require('../db/prono');

module.exports = function () {
  const todoSchema = Joi.object().keys({
    nb: Joi.number().min(1).max(20).required(),
    offset: Joi.number().min(0).required(),
  });

  routes.get('/prono/todo', validate(todoSchema, 'query'), isLogged, async (req, res) => {
    const { user } = req;
    const { nb, offset } = req.query;
    
    try {
      const todos = await dbProno.getTodos(user.id, nb, offset);
      return res.status(200).send(todos);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  const getPronosSchema = Joi.object().keys({
    nb: Joi.number().min(1).max(20).required(),
    offset: Joi.number().min(0).required(),
  });

  routes.get('/pronos', validate(getPronosSchema, 'query'), isLogged, async (req, res) => {
    const { user } = req;
    const { nb, offset } = req.query;

    try {
      const pronos = await dbProno.getPronos(user.id, nb, offset);
      return res.status(200).send(pronos);
    } catch (e) {
      console.error(e);
      return res.status(500).end();
    }
  });

  const pronoSchema = Joi.object().keys({
    matchId: Joi.number().required(),
    local: Joi.number().min(0).max(10).required(),
    guest: Joi.number().min(0).max(10).required(),
    coeff: Joi.number().min(0).max(10).required(),
  });

  routes.post('/prono/pronostic', isLogged, validate(pronoSchema), validMatch('body'), async (req, res) => {
    const { matchId, local, guest, coeff } = req.body;

    try {
      await dbProno.writeProno(req.user.id, matchId, local, guest, coeff);
      return res.status(200).end();
    } catch (e) {
      console.error(e);
      if (e.code === 'ALREADY_PRONOD') {
        return res.status(400).end();
      }
      return res.status(500).end();
    }
  });

  routes.post('/prono/modify', isLogged, validate(pronoSchema), async (req, res) => {
    const { matchId, local, guest, coeff } = req.body;

    try {
      dbProno.modifyProno(req.user.id, matchId, local, guest, coeff);
      return res.status(200).end();
    } catch (e) {
      if (e.code === 'NOT_FOUND') return res.status(400).end();
      return res.status(500).end();
    }
  });

  return routes;
}