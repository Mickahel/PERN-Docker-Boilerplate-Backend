const path = require("path");
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.SERVER_PORT ? process.env.SERVER_PORT : 8000;
const host = `localhost:${port}/`;
const publicFolder =
  process.env.STATIC_DIRECTORY || path.join(__dirname, "../../public/");
module.exports = {
  isProduction,
  port,
  host,
  publicFolder,
};
