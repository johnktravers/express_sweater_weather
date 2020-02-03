
exports.up = function(knex) {
  return Promise.all([
    knex.schema.table('locations', function(table) {
      table.unique(['lat', 'long']);
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.table('locations', function(table) {
      table.dropUnique(['lat', 'long']);
    })
  ])
};
