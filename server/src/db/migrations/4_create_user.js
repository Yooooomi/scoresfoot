
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.boolean('admin').default(true);
      table.string('username');
      table.string('password');
    }),
    knex.schema.createTable('pronos', table => {
      table.integer('user_id').references('users.id');
      table.integer('match_id').references('matches.id');

      table.integer('local_score');
      table.integer('guest_score');

      table.integer('coeff');
      table.primary(['user_id', 'match_id']);
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('pronos'),
  ]);
};
