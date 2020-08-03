const { isProduction } = require("../../auxiliaries/ServerAuxiliaries");
const {config} = require("../../../config")
const paginatedResults  = require("../../middlewares/paginatedResults")
const { database } = require("../../models");

const initializeRoutes = (router) => {
  //router.get('/', (req, res, next) => { // Echo route
  //res.redirect(301, process.env.FRONTEND_URL)
  //})
  
  // Echo route
  router.get("/", (req, res, next) => res.send(`<h1>${config.title}</h1>`));

  router.get("/favicon.ico", (req, res, next) => res.status(204));
  

  router.get("/users", paginatedResults(database.models.user), (req,res,next) =>{
    res.send(req.paginatedResults)
  })

  // ? Import Routes & Add Middlewares
  router.use("/v1/auth",    require("../../routes/auth"));
  router.use("/v1/server",  require("../../routes/server"));
  router.use("/v1/general-setting",  require("../../routes/generalSetting"));

  // ? Development routes
  if (!isProduction) {router.use("/v1/debug", require("../../routes/debug"));}

  router.use("*", (req, res, next) => {
    next({ message: "Cannot find Endpoint", status: 404 });
  });
};

module.exports = initializeRoutes;
