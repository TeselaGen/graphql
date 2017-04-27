const graphqlHTTP = require("express-graphql");
const sequelizeCrud = require("graphql-sequelize-crud");

export default (config, sequelize) => {
  var userIdCounter = 0;

	const {
		getSchema
	} = sequelizeCrud;;

     return function(req, res) {
        return sequelize.transaction().then(function(t) {
          sequelize.query("SELECT set_config('tg.lims_user', '" + userIdCounter++ + "',true);", {
            raw: true
          })
          .then(function(){
              var graphqlFunc = graphqlHTTP({
                schema: getSchema(sequelize),
                graphiql: true
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

}
