
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('teams', table => {
      table.increments('id').primary();
      table.string('name');
      table.string('logo');
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('competitions'),
  ]);
};
