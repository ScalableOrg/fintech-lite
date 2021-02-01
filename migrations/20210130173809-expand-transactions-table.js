module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.changeColumn('transactions', 'purpose', {
    type: Sequelize.STRING,
    allowNull: true,
  }),
  down: async () => {
    // nothing in down function
    // because it'll throw an error if you try to take it back to the old enum
    // if new values have been added
    // part of why you should be really careful with enum fields and making changes to them
  },
};
