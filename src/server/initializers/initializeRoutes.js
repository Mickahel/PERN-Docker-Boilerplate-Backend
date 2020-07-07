const initializeRoutes = (router) => {
  //router.get('/', (req, res, next) => { // Echo route
  //res.redirect(301, process.env.FRONTEND_URL)
  //})

  router.get("/upAndRunning", (req, res, next) => {
    const diceRoll = Math.floor(Math.random() * Math.floor(10));
    res.send(`Up And Running, rolling a dice: ${diceRoll}`);
  });

  router.get("/", (req, res, next) => {
    res.send({
      app: "PERN Boilerplate",
    });
  });

  if (process.env.NODE_ENV === "development") {
  }

  // ? Import Routes & Add Middlewares
  router.use("/v1/auth", require("../../routes/AuthRoutes"));
  router.use("/v1/server", require("../../routes/ServerRoutes"));
  /*router.use('/api/v1/user', require('../../routes/UserRoutes'))
      router.use('/api/v1/dashboard', require('../../routes/DashboardRoutes'))*/

  if (process.env.NODE_ENV === "development") {
    //router.use('/api/v1/test', require('../../routes/TestRoutes'))
  }

  router.use("*", (req, res, next) => {
    next({ message: "Cannot find Endpoint", status: 404 });
    console.log("hello")
  });
};

module.exports = initializeRoutes;
