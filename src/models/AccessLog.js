var Sequelize = require('sequelize');
module.exports = function(sequelize){

  return sequelize.define(
    "AccessLog", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    }, {
      timestamps: false
    }
  );
}