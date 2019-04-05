
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('competitions', table => {
      table.increments('id').primary();
      table.string('name');
    }),
    knex.schema.createTable('steps', table => {
      table.increments('id').primary();
      table.integer('competition_id').references('competitions.id');
      table.string('name');
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('steps'),
    knex.schema.dropTable('competitions'),
  ]);
};
