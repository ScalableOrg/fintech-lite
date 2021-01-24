const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.accounts);
    }
  }
  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      txn_type: {
        type: DataTypes.ENUM('debit', 'credit'),
        allowNull: false,
      },
      purpose: {
        type: DataTypes.ENUM('deposit', 'transfer', 'reversal'),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(20, 4).UNSIGNED,
        allowNull: false,
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reference: {
        type: DataTypes.UUID,
        unique: true,
      },
      balance_before: {
        type: DataTypes.DECIMAL(20, 4).UNSIGNED,
        allowNull: false,
      },
      balance_after: {
        type: DataTypes.DECIMAL(20, 4).UNSIGNED,
        allowNull: false,
      },
      metadata: DataTypes.JSON,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.NOW,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'transactions',
      underscored: true,
    },
  );
  return Transaction;
};
