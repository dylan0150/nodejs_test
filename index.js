//REQUIRES
var express         = require('express')
var config          = require('./server/config')
var auth            = require('./server/auth')
var request_handler = require('./server/handler')
var bodyParser      = require('body-parser')

//VARIABLES
var exapp           = express()

//SETUP
config.setPath(process.argv[1])

//WEBSITE
exapp.use(express.static('website'))
exapp.use(bodyParser.json())
exapp.use(function(req,res,next){
  
  next()
})

//API
config.setPath(process.argv[1])
exapp.get('/auth', function(request,response){
  request_handler.auth(request,response)
})
exapp.get('/cache', function(request,response){
  response.status(200).send(require('./server/cache').get()).end()
})
exapp.get('/login*', function(request,response){
  request_handler.login(request,response)
})
exapp.post('/register*', function(request,response){
  request_handler.register(request,response)
})

exapp.get('/api*', function(request,response){
  request_handler.get(request,response)
})
exapp.post('/api*', function(request,response){
  request_handler.post(request,response)
})

//SERVER
exapp.listen(config.host.port, function () {
  console.log('HOSTNAME:'+config.host.name+', listening on PORT:'+config.host.port)
})
