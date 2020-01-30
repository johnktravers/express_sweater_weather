
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('locations', function(table) {
      table.increments('id').primary();
      table.string('address');
      table.string('lat');
      table.string('long');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('locations')
  ])
};
