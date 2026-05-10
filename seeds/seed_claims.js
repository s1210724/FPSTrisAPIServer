exports.seed = async function(knex) {

    await knex('claims').del();

    await knex('claims').insert([

        {
            name: 'admin',
        },

        {
            name: 'moderator',
        },

        {
            name: 'developer',
        },

        {
            name: 'premium',
        },

        {
            name: 'beta_tester',
        },

        {
            name: 'player',
        },
    ]);
};