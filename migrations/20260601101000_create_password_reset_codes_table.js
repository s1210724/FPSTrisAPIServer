exports.up = async function(knex) {
    await knex.schema.createTable('password_reset_codes', (table) => {
        table.increments('id');
        table.integer('user_id').unsigned().notNullable();
        table.string('code', 6).notNullable();
        table.timestamp('expires_at').notNullable();
        table.boolean('used').notNullable().defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());

        table.foreign('user_id').references('users.id').onDelete('CASCADE');
        table.index(['user_id', 'code']);
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('password_reset_codes');
};
