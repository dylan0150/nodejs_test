//REQUIRES
var express         = require('express')
var config          = require('./server/config')
var request_handler = require('./server/handler')

//VARIABLES
var exapp           = express()

//WEBSITE
exapp.use(express.static('website'))

//API
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
