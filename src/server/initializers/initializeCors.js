require('dotenv').config();
const cors = require('cors')
const {isProduction,host} = require('../../auxiliaries/ServerAuxiliaries')

const initializeCors = (app, router) =>{
    if(isProduction){
        const whitelist = [process.env.FRONTEND_URL, `https://${host}`]
        
        const corsOptions = {
            origin: function (origin, callback) {
                if(!origin){ //origin is undefined
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
        router.all('*', cors(corsOptions));
    }else{
        app.use(cors())
        router.all('*', cors());
    }
}

module.exports = initializeCors