require('dotenv').config();
const cors = require('cors')
const { isProduction, host } = require('../../auxiliaries/server')

const initializeCors = (app) => {
    let whitelist
    if (isProduction) whitelist = [process.env.FRONTEND_URL, `http//${host}`]
    else whitelist = [`http://localhost:3000`, `http//${host}`, `http://localhost:9000`]
    const corsOptions = {
        credentials: true,
        origin: function (origin, callback) {
            if (!origin) { //origin is undefined
                callback(null, true)
                return
            }
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error(`${origin} is not allowed by CORS`))
            }
        }
    }

    app.use(cors(corsOptions))
}

module.exports = initializeCors