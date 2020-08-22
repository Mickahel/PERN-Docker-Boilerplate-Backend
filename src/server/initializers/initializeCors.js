require('dotenv').config();
const cors = require('cors')
const {isProduction,host} = require('../../auxiliaries/server')

const initializeCors = (app, router) =>{
    if(isProduction){
        const whitelist = [process.env.FRONTEND_URL, `http//${host}`]
        
        const corsOptions = {
            credentials: true,
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
        //router.all('*', cors(corsOptions));
    }else{
        app.use(cors({
            credentials: true,
            origin:'http://localhost:3000'
        }))
        //router.all('*', cors());
    }
}

module.exports = initializeCors