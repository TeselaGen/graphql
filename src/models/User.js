var Sequelize = require('sequelize');
var Chance = require('chance');
var faker = require('faker');

module.exports = function(sequelize){
  var chance = new Chance()

  return sequelize.define(
    "User", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
      },
      dbId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        get: function() {
          return this.getDataValue('id') 
        },
      },
      email: {
        type: Sequelize.STRING,
        faker: faker.internet.email,
        allowNull: true,
        unique: false,
      },
      password: {
        type: Sequelize.STRING,
        faker: faker.internet.password,
        allowNull: true,
      },
      firstName: {
        type: Sequelize.STRING,
        faker: faker.name.firstName,
        allowNull: true
      },
      lastName: {
        type: Sequelize.STRING,
        faker: faker.name.lastName,
        allowNull: true
      }
    }, {
      timestamps: false
    }
  );
}