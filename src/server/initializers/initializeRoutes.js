const {isProduction} = require('../../auxiliaries/ServerAuxiliaries')


const initializeRoutes = (router) => {
  //router.get('/', (req, res, next) => { // Echo route
  //res.redirect(301, process.env.FRONTEND_URL)
  //})



 

  // ? Import Routes & Add Middlewares
  router.use("/v1/auth", require("../../routes/AuthRoutes"));
  router.use("/v1/server", require("../../routes/ServerRoutes"));
  /*router.use('/api/v1/user', require('../../routes/UserRoutes'))
      router.use('/api/v1/dashboard', require('../../routes/DashboardRoutes'))*/
  
      // ? Development routes
  if (!isProduction) {
    //router.use('/api/v1/test', require('../../routes/TestRoutes'))
  }

  router.use("*", (req, res, next) => {
    next({ message: "Cannot find Endpoint", status: 404 });
  });
};

module.exports = initializeRoutes;
