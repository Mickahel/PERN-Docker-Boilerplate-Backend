const { isProduction } = require("../../auxiliaries/ServerAuxiliaries");

const initializeRoutes = (router) => {
  //router.get('/', (req, res, next) => { // Echo route
  //res.redirect(301, process.env.FRONTEND_URL)
  //})

  router.get("/", (req, res, next) => {
    // Echo route
    res.send("<h1>PERN Boilerplate</h1>"); //TODO change name
  });

  // ? Import Routes & Add Middlewares
  router.use("/v1/auth", require("../../routes/AuthRoutes"));
  router.use("/v1/server", require("../../routes/ServerRoutes"));

  // ? Development routes
  if (!isProduction) {
    router.use("/v1/debug", require("../../routes/DebugRoutes"));
  }

  router.use("*", (req, res, next) => {
    next({ message: "Cannot find Endpoint", status: 404 });
  });
};

module.exports = initializeRoutes;
