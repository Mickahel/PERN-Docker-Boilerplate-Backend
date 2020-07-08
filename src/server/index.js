const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const errorHandler = require("errorhandler");
const morgan = require("morgan");
const methodOverride = require("method-override");
const expressSession = require("express-session");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const _ = require("lodash");
const ModularLogger = require('../services/Logger');
const passport = require('passport');
const  favicon = require('serve-favicon')
const logger = new ModularLogger("Server Starter", "blue")
const {publicFolder} = require("../auxiliaries/ServerAuxiliaries")
//loggerMod.silly({bar:"foo"});
//loggerMod.silly("Questo è un winston silly ");
//loggerMod.silly("Questo è un winston silly ",{bar:"foo"});
//loggerMod.verbose('and over your neighbors dog?');
//loggerMod.info('Whats great for a snack,');
//loggerMod.warn('And fits on your back?');
//loggerMod.error('Its log, log, log');
//loggerMod.debug('Its log, log, log');
const initializeAuthentication = require('./initializers/initializeAuthentication')
const initializeSwagger = require('./initializers/initializeSwagger')
const initializeCors = require('./initializers/initializeCors')
const initializeRoutes = require('./initializers/initializeRoutes')
const initializeHttp = require('./initializers/initializeHttp')
//const initializePassport = require('./initializers/initializePassport')
//const initializeWebSocket = require('./initializers/initializeWebSocket')

// ? https://itnext.io/make-security-on-your-nodejs-api-the-priority-50da8dc71d68

module.exports = function createServer() {

  // ? Create express app and router
  const app = express();
  const router = express.Router();

  // ? Add Session for authentication
  app.use(
    expressSession({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );

  // ? Initialize Passport for authentication
  app.use(passport.initialize());
  app.use(passport.session());

  // ? Add logger middleware
  app.use(morgan('dev'));

  // ? Add error handler middleware
  app.use(errorHandler());

  // ? Add middleware that allows override of REST methods
  app.use(methodOverride('_method'));

  // ? add parser middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json(/*{ limit: '20kb' }*/ ));

  // ? Initialize CORS
  initializeCors(app, router);

  // ? Add public folder
  app.use('/public', express.static(publicFolder)) 
  //app.use("/resources", express.static(path.join(__dirname, "../../resources")));
  
  // ? Serve Favicon 
  app.use(favicon(path.join(publicFolder, 'favicon.ico')))
  
  // ? Security middleware
  app.use(helmet())

  
  // ? Set limit to API requests
  const limit = rateLimit({
    max: 300, // max requests
    windowMs: 60000, //60 seconds
    message: 'Too many requests' // message to send
  });
  app.use('*', limit); // Setting limiter on specific route

  // ? Add auth
  initializeAuthentication();
  
  // ? Add Swagger
  initializeSwagger(app, router);
  
  // ? Add Routes
  initializeRoutes(router);
  app.use(router);


  //? Error middleware
  app.use((err, req, res, next) => {
    let status = err.status ? err.status : 500;
    let errorMessage = {
      res: "error",
      message: err.message,
      errors: err.errors,
      status,
      stack: _.get(err, "stack"),
    };
    logger.error(err)
    res.status(status).send(errorMessage);
  }); 
  const server = initializeHttp(app)
};
