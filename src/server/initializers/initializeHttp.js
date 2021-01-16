const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const Logger = require("../../services/logger");
const logger = new Logger("App", "#3FA34D");

const {
  port,
  isProduction,
  host,
} = require("../../auxiliaries/server");

const initializeHttp = (app) => {
  let server = null;

  if (isProduction) {
    server = http.createServer(app);
  } else {
    // ? https://web.archive.org/web/20120203022122/http://www.silassewell.com/blog/2010/06/03/node-js-https-ssl-server-example/
    // ? while using the comments, add '-config <folder_Of_openssl.cnf> '
    // ? openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

    // ? https://stackoverflow.com/questions/10175812/how-to-create-a-self-signed-certificate-with-openssl
    // ?
    server = https.createServer(
      {
        key: fs.readFileSync(path.join(__dirname, "../keys/privatekey.pem")),
        cert: fs.readFileSync(path.join(__dirname, "../keys/certificate.pem")),
      },
      app
    );
  }

  server.listen(port, () => {
    logger.info(`App listening on http${isProduction ? `` : `s`}://${host}`);
  });

  return server;
};

module.exports = initializeHttp;
