module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('card_transactions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    account_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    external_reference: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    amount: {
      allowNull: false,
      type: Sequelize.DECIMAL(20, 4),
    },
    last_response: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  }),

  down: async (queryInterface, _Sequelize) => queryInterface.dropTable('card_transactions'),
};
