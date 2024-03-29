import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import helmet from 'helmet';
import winstonInstance from './winston';
import passportInit from './passport'

//import routes from '../server/routes/index.route';
import config from './config';
import APIError from './APIError';

import http from 'http';
import morgan from 'morgan';
import jsonConfig from '../config.json';
import graphql from '../graphql';
//import devConfig from './webpack.config.dev';

export default app => {
    app.passport = require('passport');
    if (config.env === 'development') {
      app.use(logger('dev'));
    }

    // parse body params and attache them to req.body
    app.use(bodyParser.json({
      limit: '50mb'
    }));
    app.use(bodyParser.urlencoded({
      limit: '50mb',
      extended: true
    }));

    app.use(cookieParser());
    app.use(cookieSession({
        key: 'telims',
        secret: 'random',
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 // Sessions expire after 24 hours.
        }
    }));

    app.use(app.passport.initialize());
    app.use(app.passport.session());

   
    app.use(compress());
    app.use(methodOverride());

    // secure apps by setting various HTTP headers
    app.use(helmet());

    // enable CORS - Cross Origin Resource Sharing
    app.use(cors());
    passportInit(app,express);

    // enable detailed API logging in dev env
    if (config.env === 'development') {
      expressWinston.requestWhitelist.push('body');
      expressWinston.responseWhitelist.push('body');
      app.use(expressWinston.logger({
        winstonInstance,
        meta: true, // optional: log meta data about request (defaults to true)
        msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
      }));
    }

    // mount all routes on /api path
    //app.use('/api', routes);
    //
    //
    //
    //require('./passport.js')(app,express);
    app.get('/logic', function (req,res) {
        return res.json(200,{success:true})
    });
    app.use('/graphql', graphql(
      jsonConfig,
      app.sequelize
    ));

    // if error is not an instanceOf APIError, convert it.
    app.use((err, req, res, next) => {
      if (err instanceof expressValidation.ValidationError) {
        // validation error contains errors which is an array of error each containing message[]
        const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
        const error = new APIError(unifiedErrorMessage, err.status, true);
        return next(error);
      } else if (!(err instanceof APIError)) {
        const apiError = new APIError(err.message, err.status, err.isPublic);
        return next(apiError);
      }
      return next(err);
    });

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      const err = new APIError('API not found', httpStatus.NOT_FOUND);
      return next(err);
    });

    // log error in winston transports except when executing test suite
    if (config.env !== 'test') {
      app.use(expressWinston.errorLogger({
        winstonInstance
      }));
    }

    // error handler, send stacktrace only during development
    app.use((err, req, res, next) => // eslint-disable-line no-unused-vars
      res.status(err.status).json({
        message: err.isPublic ? err.message : httpStatus[err.status],
        stack: config.env === 'development' ? err.stack : {}
      })
    );

}