//VARIABLES
var   DEBUGGING = false;

//REQUIRES
var   config        = require('./config'),
      fs            = require('fs'),
      http          = require('http'),
      url           = require('url'),
      dbconfig      = require('./dbconfig'),
      HTTPrequest   = require('./request'),
      nodeMaria     = require('node-mariadb'),

//NETWORK CONFIG
      port           = config.host.port;

//SETUP
var setUp = function() {


}

var handleRequest = function(request, response) {

  if (DEBUGGING) {
    var debug_data = {
      url           :request.url,
      method        :request.method,
      statusCode    :request.statusCode,
      statusMessage :request.statusMessage,
      trailers      :request.statusMessage
    }
    console.log(debug_data)
  }

  try {
    console.log(request.method+' Request, URL:'+request.url)
    response = HTTPrequest[request.method](request,response)
    console.log(request.method+' Response, Status: '+response.statusCode+' '+response.statusMessage)
  } catch (err) {
    console.log(err)
  }
}

var server = http.createServer(handleRequest).listen(port, function(){
  console.log("Server listening on port:"+port
)})

setUp();

/*
  request.strings = {
    method: GET/POST
    url: "/"+...
  }

  request.objects = {
    headers -- params from request ()
    statusCode -- 200 etc...
    statusMessage -- error etc...
    trailers -- empty object
  }
*/
