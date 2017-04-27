import config from './config/config';
import jsonConfig from './config.json';
import express from 'express';
import expressConfig from './config/express';
import initializeDb from './db';
import middleware from './middleware';
const app = express();
// connect to db
initializeDb(app, jsonConfig, () => {

	expressConfig(app);
	
	if (!module.parent) {
	  // listen on port jsonConfig.port
	  app.listen(config.port, () => {
	    console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
	  });
	}

});

export default app;
