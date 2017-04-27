var Sequelize = require('sequelize');
var Chance = require('chance');
var faker = require('faker');
module.exports = function(sequelize){
  var chance = new Chance()
  
  return sequelize.define(
    "Material", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
        faker: function () {
          return chance.pickone(['DNA', 'microbialStrain'])
        },
        validate: {
          isIn: [
            ["DNA", "microbialStrain"]
          ]
        }
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        faker: function () {
          return chance.pickone(['registered', 'target'])
        },
        validate: {
          isIn: [
            ["registered", "target"]
          ]
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
        faker: faker.name.lastName,

      },
      sourceSystem: {
        type: Sequelize.STRING,
        faker: function () {
          return chance.pickone(['RCC', 'NCBI', 'JBEI'])
        },
        allowNull: true
      },
      sourceSystemId: {
        type: Sequelize.STRING,
        faker: function () {
          return chance.string()
        },
        allowNull: true
      }
    }, {
      timestamps: false
    }
  );
}