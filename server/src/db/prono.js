const { Prono, Match } = require('./models/schema');

const writeProno = (userId, matchId, local, guest, coeff) => {
  return Prono.query().insert({
    user_id: userId,
    match_id: matchId,
    local_score: local,
    guest_score: guest,
    coeff,
  }).returning('*');
};

const modifyProno = (userid, pronoid, local, guest, coeff) => {
  return Prono.query().where('id', pronoid).andWhere('user_id', userid).update({
    local_score: local,
    guest_score: guest,
    coeff,
  });
};

const getTodos = async (id, nb, offset) => {
  const todos = await Match.query()
    .where('date', '>', (new Date()).toISOString())
    .whereNotIn('id', Prono.query().select('match_id').where('user_id', '=', id))
    .where('local_score', '=', -1)
    .orderBy('date')
    .offset(offset)
    .limit(nb)
    .eager('[local, guest]');
  return todos;
};

const getPronos = (id, nb, offset) => {
  return Prono.query()
    .where('user_id', '=', id)
    .limit(nb)
    .offset(offset)
    .withGraphFetched('match(order).[local, guest]')
    .modifiers({
      order(builder) {
        builder.orderBy('date', 'asc')
      },
    })
};

module.exports = {
  writeProno,
  modifyProno,
  getTodos,
  getPronos,
};