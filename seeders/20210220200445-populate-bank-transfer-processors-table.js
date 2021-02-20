module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert('bank_transfer_processors', [
    {
      name: 'monnify',
      position: 1,
      enabled: true,
      created_at: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updated_at: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
    },
    {
      name: 'paystack',
      position: 2,
      enabled: true,
      created_at: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updated_at: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
    },
    {
      name: 'flutterwave',
      position: 3,
      enabled: true,
      created_at: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
      updated_at: Sequelize.literal('CURRENT_TIMESTAMP(3)'),
    },
  ],
  {
    updateOnDuplicate: ['name'],
  }),

  down: async (queryInterface, _Sequelize) => queryInterface.bulkDelete('bank_transfer_processors', null),
};
