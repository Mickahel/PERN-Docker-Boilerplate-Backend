const express = require("express");
const compression = require('compression')
const path = require("path");
const errorHandler = require("errorhandler");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const _ = require("lodash");
const cookieParser = require("cookie-parser")
const passport = require('passport');
const {publicFolder, isProduction} = require("../auxiliaries/server")
const initializeAuthentication = require('./initializers/initializeAuthentication')
const initializeSwagger = require('./initializers/initializeSwagger')
const initializeCors = require('./initializers/initializeCors')
const initializeRoutes = require('./initializers/initializeRoutes')
const initializeHttp = require('./initializers/initializeHttp');
//const initializeWebSocket = require('./initializers/initializeWebSocket')

// ? https://itnext.io/make-security-on-your-nodejs-api-the-priority-50da8dc71d68

module.exports = function createServer() {

  // ? Create express app and router
  const app = express();
  const router = express.Router();

  // ? Add Session for authentication
  //* Sessions are not used
  /*app.use(
    expressSession({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new pgSessionConnection(),
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }  //? 30 days
    })
  );*/

  // ? Initialize Passport for authentication
  app.use(passport.initialize());
  //app.use(passport.session()); //* Sessions are not used
  // ? Cookie Parser middleware
  app.use(cookieParser()) 
  // ? Add logger middleware
  app.use(morgan('dev'));

  // ? Add error handler middleware
  app.use(errorHandler());

  // ? Add gzip compression
  app.use(compression())

  // ? add parser middleware
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json(/*{ limit: '20kb' }*/ ));

  // ? Initialize CORS
  initializeCors(app, router);

  // ? Add public folders
  app.use('/public', express.static(publicFolder)) 
  app.use("/resources", express.static(path.join(__dirname, "../../resources")));
  
  
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
    // ? Add https middleware

  app.use(router);


  //? Error middleware
  app.use((err, req, res, next) => {
    let status = err.status ? err.status : 500;
    let errorMessage = {
      response: "error",
      message: err.message,
      errors: err.errors,
      status
    }
    if(!isProduction) errorMessage.stack = _.get(err, "stack")
    //logger.error(err)
    res.status(status).send(errorMessage);
  }); 
  initializeHttp(app)
};
