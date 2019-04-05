
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('matches', table => {
      table.increments('id').primary();

      table.date('date');

      table.integer('local_score').default(-1);
      table.integer('guest_score').default(-1);

      table.integer('step_id').references('steps.id');
      table.integer('local_team_id').references('teams.id');
      table.integer('guest_team_id').references('teams.id');
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('matches'),
  ]);
};
