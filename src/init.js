const Sequelize = require("sequelize");
var models = require('./models');
var initFixtures = require('./initFixtures');
var fs = require('fs');
var path = require('path');
module.exports = function() {
  const sequelize = new Sequelize(
    "postgres://graphql_sequelize_test:graphql_sequelize_test@localhost:5432/graphql_sequelize_test", {
      dialectOptions: {
          multipleStatements: true
      },
      schema: 'public'
    }
  );
  var instantiatedModels = models(sequelize)
  return sequelize
    .drop({cascade: true})
    .then(function() {
      return sequelize.sync({
        force: true
      })
    })
    .then(function() {
      return initFixtures(sequelize, instantiatedModels)

    }).then(function () {
      var testInitSql = fs.readFileSync(path.join(__dirname, './testInit.sql'), 'utf8');
      return sequelize.query(testInitSql, {
          raw: true
      })
    })

}