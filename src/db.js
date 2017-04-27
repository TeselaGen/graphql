var fs = require('fs');
var path = require('path');
var continuationLocalStorage = require('continuation-local-storage');
const Sequelize = require("sequelize");
var initFixtures = require('./initFixtures');

export default (app, jsonConfig, callback) => {
	app.jsonConfig = jsonConfig;
	var namespace = continuationLocalStorage.createNamespace('lims-namespace')
	Sequelize.cls = namespace

	app.sequelize = new Sequelize(jsonConfig.database, jsonConfig.username, jsonConfig.password, {
		host: jsonConfig.host,
		dialect: jsonConfig.dialect,
		pool: jsonConfig.pool,
		dialectOptions: {
			multipleStatements: true
		},
		schema: 'public'
	});

	require('./models')(app);

	function initDev() {
		if (process.env.noreset) return Promise.resolve();
		return app.sequelize
			.drop({
				cascade: true
			})
			.then(function() {
				return app.sequelize.sync({
					force: true
				})
			})
			.then(function() {
				return initFixtures(app.sequelize, app.models)

			}).then(function() {
				var testInitSql = fs.readFileSync(path.join(__dirname, '../testInit.sql'), 'utf8');
				return app.sequelize.query(testInitSql, {
					raw: true
				})
			})
	}

	initDev().then(callback);
}