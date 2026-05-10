exports.up = async function(knex) {

    await knex.schema.createTable(
        'user_claims',
        (table) => {

            table.integer('user_id')
                .unsigned()
                .notNullable();

            table.integer('claim_id')
                .unsigned()
                .notNullable();

            table.primary([
                'user_id',
                'claim_id',
            ]);

            table.foreign('user_id')
                .references('users.id')
                .onDelete('CASCADE');

            table.foreign('claim_id')
                .references('claims.id')
                .onDelete('CASCADE');
        }
    );
};

exports.down = async function(knex) {

    await knex.schema.dropTableIfExists(
        'user_claims'
    );
};