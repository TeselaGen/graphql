var Sequelize = require('sequelize');
var Chance = require('chance');
var faker = require('faker');
module.exports = function(sequelize){
  var chance = new Chance()

  return sequelize.define(
    "Sequence", {
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
          return chance.pickone(['DNA', 'RNA'])
        },
        validate: {
          isIn: [
            ["DNA", "RNA"]
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
      bps: {
        faker: function () {
          return chance.string({pool: 'atgc', length: 100})
        },
        type: Sequelize.TEXT,
        allowNull: true
      },
    }, {
      timestamps: false
    }
  );
}