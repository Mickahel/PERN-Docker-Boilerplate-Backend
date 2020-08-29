const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { isProduction } = require("../../auxiliaries/server");
const { config } = require("../../../config")


const swaggerOptions = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    openapi: "3.0.1",
    host: process.env.BACKEND_URL,
    info: {
      title: config.longTitle,
      version: "0.0.0",
      description: config.description,
      contact: config.contact,
      license: {
        name: "PROPRIETARY LICENSE",
      },

    },
    components: {
      securitySchemes: {
        cookieAuthBasic: {
          type: "apiKey",
          in: "cookie",
          name: 'accessToken',
          //scheme: "bearer",
          //bearerFormat: "JWT",
          description: "Cookie accessToken required, Basic Role Required",
        },
        cookieAuthAdmin: {
          type: "apiKey",
          in: "cookie",
          name: 'accessToken',
          //scheme: "bearer",
          //bearerFormat: "JWT",
          description: "Cookie accessToken required, Admin Role Required",
        },
        cookieAuthSuperAdmin: {
          type: "apiKey",
          in: "cookie",
          name: 'accessToken',
          //scheme: "bearer",
          //bearerFormat: "JWT",
          description: "Cookie accessToken required, SuperAdmin Role Required",
        },
        //basicAuth: {
        //  type: 'apiKey',
        //  scheme: 'basic'
        //}
      },
    },
    servers: [
      {
        url: process.env.BACKEND_URL,
        description: "Main API Server",
      },
    ],

  },
  apis: ["./src/routes/*.js","./src/routes/*/*.js"],
};

const initializeSwagger = (app, router) => {
  if (isProduction) return;

  const specs = swaggerJsdoc(swaggerOptions);
  router.use(config.apiDocsLink, swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = initializeSwagger;
