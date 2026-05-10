exports.up = async function(knex) {

    await knex.schema.createTable(
        'claims',
        (table) => {

            table.increments('id');

            table.string('name', 100)
                .notNullable()
                .unique();
        }
    );
};

exports.down = async function(knex) {

    await knex.schema.dropTableIfExists(
        'claims'
    );
};