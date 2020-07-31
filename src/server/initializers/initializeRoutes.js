const { isProduction } = require("../../auxiliaries/ServerAuxiliaries");
const {config} = require("../../../config")
const initializeRoutes = (router) => {
  //router.get('/', (req, res, next) => { // Echo route
  //res.redirect(301, process.env.FRONTEND_URL)
  //})

  router.get("/", (req, res, next) => {
    // Echo route
    res.send(`<h1>${config.title}</h1>`);
  });

  // ? Import Routes & Add Middlewares
  router.use("/v1/auth", require("../../routes/auth"));
  router.use("/v1/server", require("../../routes/server"));

  // ? Development routes
  if (!isProduction) {router.use("/v1/debug", require("../../routes/debug"));}

  router.use("*", (req, res, next) => {
    next({ message: "Cannot find Endpoint", status: 404 });
  });
};

module.exports = initializeRoutes;
