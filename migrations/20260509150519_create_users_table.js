exports.up = async function(knex) {

    await knex.schema.createTable(
        'users',
        (table) => {

            table.increments('id');

            table.string('email', 255)
                .notNullable()
                .unique();

            table.string('username', 50)
                .notNullable()
                .unique();

            table.string('password', 255)
                .notNullable();

            table.string('color_palette', 50)
                .defaultTo('default');

            table.integer('played_games')
                .defaultTo(0);

            table.integer('wins')
                .defaultTo(0);

            table.timestamps(true, true);
        }
    );
};

exports.down = async function(knex) {

    await knex.schema.dropTableIfExists(
        'users'
    );
};