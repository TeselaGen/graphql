var init = require('./init');
var continuationLocalStorage = require('continuation-local-storage');
var namespace = continuationLocalStorage.createNamespace('lims-namespace')


var models = require('./models');
// const {getSchema } = require("graphql-sequelize-crud"); 
const {getSchema} = require('./graphql-sequelize-crud');
const Sequelize = require("sequelize");
Sequelize.cls = namespace

const express = require("express");
const graphqlHTTP = require("express-graphql");
const cors = require("cors");

const app = express();
// app.use(cors)


const sequelize = new Sequelize(
  "postgres://graphql_sequelize_test:graphql_sequelize_test@localhost:5432/graphql_sequelize_test"
);



var userIdCounter = 1;

init()
  .then(function() {

    app.use(cors())


    // require('./models')(sequelize)
    // var schema = getSchema(sequelize)
    // app.use(
    //   "/graphql",
    //   graphqlHTTP({
    //     schema: schema,
    //     graphiql: true
    //   })
    // );



    //maybe this can go outside?
    require('./models')(sequelize);
    var schema = getSchema(sequelize);



    // app.use('/graphql', graphqlHTTP(request => {

    //   sequelize.transaction(function (t) {
    //     debugger
    //     sequelize.query("SELECT set_config('tg.lims_user', '" + userIdCounter++ + "',true);", {raw: true})
    //     //maybe this can go outside?

    //   })

    //   return Promise.resolve().then(function () {
    //       return {
    //         schema: schema,
    //         graphiql: true,
    //         // extensions({ document, variables, operationName, result }) {
    //         //   return { runTime: Date.now() - startTime };
    //         // }
    //       };  
    //   })

    // }));

    // app.use(
    //   "/graphql",
    //   function (req,res) {
    //     return sequelize.transaction({
    //       isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
    //     },function (t) {
    //       sequelize.query("SELECT set_config('tg.lims_user', '" + userIdCounter++ + "',true);", {raw: true});


    //       var graphqlFunc = graphqlHTTP({
    //         schema: schema,
    //         graphiql: true,
    //         // extensions({ document, variables, operationName, result }) {
    //         //   debugger
    //         //   return { runTime: Date.now()};
    //         // }
    //       })

    //       return graphqlFunc(req,res)

    //     })
    //     // .then(function () {
    //     //   // debugger
    //     //   // console.log('res:', res)
    //     // })
    //   }
    // );

    app.use(
      "/graphql",
      function(req, res) {
        return sequelize.transaction().then(function(t) {
          sequelize.query("SELECT set_config('tg.lims_user', '" + userIdCounter++ + "',true);", {
            raw: true
          })
          .then(function(){
              var graphqlFunc = graphqlHTTP({
                schema: schema,
                graphiql: true,
                // extensions({ document, variables, operationName, result }) {
                //   debugger
                //   return { runTime: Date.now()};
                // }
              })

              return graphqlFunc(req, res)

              .then(function() {
                return t.commit();
              }).catch(function(e) {
                console.log('e:', e)
                return t.rollback();
              })            
          })

        })

      }
    );

    const port = 3001;
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  })



// -- SELECT set_config('tg.lims_user', '12',true);
// -- INSERT INTO "Users" ("email","password","firstName","lastName") VALUES ('test', 'test','test','test');
// -- SELECT set_config('tg.lims_user', '2',true);