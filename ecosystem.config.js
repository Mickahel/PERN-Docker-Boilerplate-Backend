let app = {
  name: `API - PERN BOILERPLATE`,
  script: 'ts-node ./build/index.js',
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
