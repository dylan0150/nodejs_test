//VARIABLES
var DEBUGGING = false;

var   config      = require('./config'),
      fs          = require('fs'),
      http        = require('http'),
      url         = require('url'),
      HTTPrequest = require('./request'),

      port    = config.host.port;

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
    if (request.method == 'GET') {
      response = HTTPrequest.get(request,response)
    } else if (request.method == 'POST') {
      response = HTTPrequest.post(request,response)
    }
    console.log(request.method+' Response: '+response.statusCode+': '+response.statusMessage)
  } catch (err) {
    console.log(err)
  }
}

var server = http.createServer(handleRequest).listen(port, function(){
  console.log("Server listening on port:"+port
)})

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
