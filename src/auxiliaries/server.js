const path = require("path");
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT ? process.env.PORT : 8000;
const host = `localhost:${port}/`;
const publicFolder =
  process.env.STATIC_DIRECTORY || path.join(__dirname, "../../public/");
module.exports = {
  isProduction,
  port,
  host,
  publicFolder,
};
