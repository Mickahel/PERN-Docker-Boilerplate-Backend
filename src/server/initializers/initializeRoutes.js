const { isProduction } = require("../../auxiliaries/ServerAuxiliaries");
const {config, roles} = require("../../../config")
const paginatedResults  = require("../../middlewares/paginatedResults")
const { database } = require("../../models");
const authRequired = require('../../middlewares/authRequired')

const initializeRoutes = (router) => {
  //router.get('/', (req, res, next) => { // Echo route
  //res.redirect(301, process.env.FRONTEND_URL)
  //})

  // Echo route
  router.get("/", (req, res, next) => res.send(
    `
    <h1>${config.title}</h1>
    <h2><a href=\"${config.apiDocsLink}\">API Documentation</h2>
    `
    ));

  router.get("/favicon.ico", (req, res, next) => res.status(204));
  
/*
  router.get("/users", paginatedResults(database.models.user), (req,res,next) =>{
    res.send(req.paginatedResults)
  })
*/


  // * https://stackoverflow.com/questions/46783270/expressjs-best-way-to-add-prefix-versioning-routes
  // ? Import Routes & Add Middlewares


  // ? Public Routes 
  router.use("/v1/auth",                    require("../../routes/auth"));


  // ? Admin Routes
  router.use("/v1/admin*",                  authRequired(roles.ADMIN))
  router.use("/v1/admin/server",            require("../../routes/server"));
  router.use("/v1/admin/general-settings",  require("../../routes/generalSetting"));
  router.use("/v1/admin/user",              require("../../routes/user/admin"))
  
  // ? App Routes
  router.use("/v1/app*",                    authRequired(roles.BASE))
  router.use("/v1/app/user",                require("../../routes/user/app"))




  // ? Development routes
  if (!isProduction) {router.use("/v1/debug", require("../../routes/debug"));}

  router.use("*", (req, res, next) => {
    next({ message: "Cannot find Endpoint", status: 404 });
  });
};

module.exports = initializeRoutes;
