//VARIABLES
var   DEBUGGING = false;

//REQUIRES
var   config        = require('./config'),
      fs            = require('fs'),
      http          = require('http'),
      url           = require('url'),
      dbconfig      = require('./dbconfig'),
      HTTPrequest   = require('./request');

//NETWORK CONFIG
      port           = config.host.port;

//SETUP

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
    if (request.method != 'GET' && request.method != 'POST') {
      request.method = request.headers['access-control-request-method']
    }
    console.log(request.method+' Request, URL:'+request.url)
    response = HTTPrequest[request.method](request,response)
    console.log(request.method+' Response, Status: '+response.statusCode+' '+response.statusMessage)
  } catch (err) {
    console.log(err)
  }
}

var server = http.createServer(handleRequest).listen(port, function(){
  console.log("Server listening on port:"+port)
})

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
