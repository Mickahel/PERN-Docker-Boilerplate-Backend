const { config } = require("./config")

let app = {
  name: `API - ${config.longTitle}`,
  script: './index.js',
  watch: true,
  ignore_watch: ["node_modules", 'public/uploads'],
  restart_delay: 5000,
  autorestart: true,
  output: '/dev/null',
  error: '/dev/null',
  log: '/dev/null',
  env: {

  },
}

module.exports = app
