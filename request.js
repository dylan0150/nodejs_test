var config = require('./config')

exports.GET = function(request, response) {
  try {
    if (request.url.split('?').length > 1) {
      var urlParams = request.url.split('?')[1].split('&')
      var params = {}
      for (var i = 0; i < urlParams.length; i++) {
        params[urlParams[i].split('=')[0]] = urlParams[i].split('=')[1]
      }
    } else {
      var params = {}
    }
    var res = require('./'+request.url.split('?')[0])
    var json = res.get(request.headers,params)
    response.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": config.accessCtrl.origins,
      "Access-Control-Allow-Methods": config.accessCtrl.methods,
      "Access-Control-Allow-Headers": config.accessCtrl.headers,
      "Access-Control-Allow-Credentials": true
    });
    response.end(JSON.stringify(json))
  } catch (e) {
    response.writeHead(404,{
      'Content-Type': 'text/plain'
    })
    response.end('404')
  }
  return response
}

exports.POST = function(request, response) {
  try {
    var body = {}
    request.on('data',function(data){
      body = JSON.parse(data.toString())
    })
    request.on('end',function(){
      if (request.url.split('?').length > 1) {
        var urlParams = request.url.split('?')[1].split('&')
        var params = {}
        for (var i = 0; i < urlParams.length; i++) {
          params[urlParams[i].split('=')[0]] = urlParams[i].split('=')[1]
        }
      } else {
        var params = {}
      }
      var res = require('./'+request.url.split('?')[0])
      var json = res.post(request.headers,params,body)
      response.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": config.accessCtrl.origins,
        "Access-Control-Allow-Methods": config.accessCtrl.methods,
        "Access-Control-Allow-Headers": config.accessCtrl.headers,
        "Access-Control-Allow-Credentials": true
      });
      response.end(JSON.stringify(json))
    })
  } catch (e) {
    response.writeHead(404,{
      'Content-Type': 'text/plain'
    })
    response.end('404')
  }
  return response
}
