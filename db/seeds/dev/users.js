exports.seed = function(knex) {
  return knex('users').del()
    .then(() => {
      return Promise.all([
        knex('users').insert({
          name: 'Lynda Ferguson', api_key: 'fabe2323acc1b559dee43d4a1e16cbeb'
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
