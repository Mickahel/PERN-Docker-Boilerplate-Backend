const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { isProduction } = require("../../auxiliaries/ServerAuxiliaries");
const { config } = require("../../../config")


const swaggerOptions = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    openapi: "3.0.1",
    host: process.env.BACKEND_URL,
    info: {
      title: config.title,
      version: "0.0.0",
      description: config.description,
      contact: {
        name: "Michelangelo De Francesco",
        url: "https://www.linkedin.com/in/michelangelodefrancesco",
        email: "df.michelangelo@gmail.com",
      },
      license: {
        name: "PROPRIETARY LICENSE",
      },

    },
    components: {
      securitySchemes: {
        bearerAuthBasic: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT required, Basic Role Required",
        },
        bearerAuthAdmin: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT required, Admin Role Required",
        },
        bearerAuthSuperAdmin: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT required, SuperAdmin Role Required",
        },
        basicAuth: {
          type: 'http',
          scheme: 'basic'
        }
      },
    },
    servers: [
      {
        url: process.env.BACKEND_URL,
        description: "Main API Server",
      },
    ],

  },
  apis: ["./src/routes/*.js"],
};

const initializeSwagger = (app, router) => {
  if (isProduction) return;

  const specs = swaggerJsdoc(swaggerOptions);
  router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = initializeSwagger;
