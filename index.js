//SETUP
var fs              = require('fs')
var express         = require('express')
var bodyParser      = require('body-parser')
var config          = require('./server/config')
var secure          = require('./secure')

var arr = process.argv[1].split('/')
var path = ""
for (var i = 0; i < arr.length-1; i++) {
  path += arr[i]
  path += '/'
}
config.path = {
  website : path+'website/',
  index   : path,
  api     : path+'server/api/',
  db      : path+'server/db/',
  mail    : path+'server/mailtemplates/'
}
secure.path = path

if (!secure.setUp()) {
  console.log('secure setup failed')
  return false;
} else { console.log('secure setup successful') }

var auth            = require('./server/auth')
var request_handler = require('./server/handler')
var mailer          = require('./server/mailer')
var exapp           = express()

//WEBSITE
exapp.use(express.static('website'))
exapp.use(bodyParser.json())
exapp.use(function(req,res,next){
  //called for all requests
  next()
})

//API
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
