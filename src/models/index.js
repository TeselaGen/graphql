module.exports = function(app) {

	app.models = {
		User: require('./User')(app.sequelize),
		Material: require('./Material')(app.sequelize),
		Sequence: require('./Sequence')(app.sequelize),
		AccessLog: require('./AccessLog')(app.sequelize),
	};

}