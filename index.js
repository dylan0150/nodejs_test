//REQUIRES
var express   = require('express')
var config    = require('./config')

//VARIABLES
var exapp     = express()

//SERVER
exapp.use(express.static('website'))

exapp.listen(config.host.port, function () {
  console.log('HOSTNAME:'+config.host.name+', listening on PORT:'+config.host.port)
})
