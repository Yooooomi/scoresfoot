const routes = require('express').Router();
const { isLogged, validate, validMatch } = require('../tools/tools');
const Joi = require('joi');
const dbProno = require('../db/prono');

module.exports = function () {

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