const router = require('express').Router();
const multer  = require('multer')
const {publicFolder} = require('../auxiliaries/server')

const storage = multer.diskStorage({ 
  destination: function (req, file, cb) {
    cb(null, publicFolder+"\\uploads")
  },
  filename: (req, file, cb) =>{
    const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    cb(null, Date.now() +extension)
  } 
})
const upload = multer({storage})

/**
 * @swagger
 * /api/v1/upload/image:
 *    post:
 *      description: Uploads an image
 *      tags: [Upload]
 */
router.post('/image', upload.single('data'), (req, res, next) => { //TODO ALL - Check if it's an image
    console.log(req.file)
    /*req.file.staticPath=""
    req.file.staticPath=req.file.destination+"/"+req.file.filename
    req.file.staticPath=req.file.staticPath.replace('public/',"")*/
    res.send(req.file)    
})

/**
 * @swagger
 * /api/v1/upload/file:
 *    post:
 *      description: Uploads a file
 *      tags: [Upload]
 */
router.post('/file', upload.single('data'),  (req, res, next) => {//TODO ALL -  Check if it's a video
    /*req.file.staticPath=""
    req.file.staticPath=req.file.destination+"/"+req.file.filename
    req.file.staticPath=req.file.staticPath.replace('public/',"")*/
    res.send(req.file)
})

/**
 * @swagger
 * /api/v1/upload/video:
 *    post:
 *      description: Uploads a video
 *      tags: [Upload]
 */
router.post('/video', upload.single('data'), (req, res, next) => { //TODO ALL -  Check if it's a video
    /*req.file.staticPath=""
    req.file.staticPath=req.file.destination+"/"+req.file.filename
    req.file.staticPath=req.file.staticPath.replace('public/',"")*/
    res.send(req.file)
})

module.exports = router