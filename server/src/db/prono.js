const { Prono } = require('./models/schema');

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

module.exports = {
  writeProno,
  modifyProno,
};