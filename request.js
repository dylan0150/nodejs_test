exports.get = function(request, response) {
  try {
    var urlParams = request.url.split('?')[1].split('&')
    for (var i = 0; i < urlParams.length; i++) {
      urlParams[i] = {
        key   :urlParams[i].split('=')[0],
        value :urlParams[i].split('=')[1]
      }
    }
    var res = require('./api'+request.url.split('?')[0])
    var json = res.get(request.headers,urlParams)
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.end(json)
  } catch (e) {
    response.writeHead(404,{
      'Content-Type': 'text/plain'
    })
    response.end('404')
  }
  return response
}

exports.post = function(request, response) {
  try {
    var urlParams = request.url.split('?')[1].split('&')
    for (var i = 0; i < urlParams.length; i++) {
      urlParams[i] = {
        key   :urlParams[i].split('=')[0],
        value :urlParams[i].split('=')[1]
      }
    }
    var res = require('./api'+request.url.split('?')[0])
    var json = res.post(request.headers,urlParams)
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.end(json)
  } catch (e) {
    response.writeHead(404,{
      'Content-Type': 'text/plain'
    })
    response.end('404')
  }
  return response
}
