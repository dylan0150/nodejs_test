var config      = require('./config')
var auth        = require('./../api/auth')

exports.get = function(request, response) {
  var path = ""
  var url_paths = request.url.split('/')
  for (var i = 2; i < url_paths.length; i++) {
    if (path != '') {
      path += '/'
    }
    path += url_paths[i]
  }
  var url_params = []
  if (path.split('?').length > 1) {
    var params = path.split('?')[1].split('&')
    for (var i = 0; i < params.length; i++) {
      var param = {
        key:params[i].split('=')[0],
        value:params[i].split('=')[1]
      }
      url_params.push(param)
    }
  }
  if (Auth(request,path,url_params)) {
    try {
      var res = require(config.api.path+path.split('?')[0])
      var data = res.get(url_params,request.headers.cookie)
      response.send(data)
      response.end('200')
    } catch (e) {
      console.log(e)
      response.writeHead(404, {
        'Content-Type': 'text/plain'
      })
      response.end('404: Path not found on server')
    }
  } else {
    response.writeHead(401, {
      'Content-Type': 'text/plain'
    })
    response.end('401: Authentication Error')
  }
}

exports.post = function(request, response) {
  var path = ""
  var url_paths = request.url.split('/')
  for (var i = 2; i < url_paths.length; i++) {
    if (path != '') {
      path += '/'
    }
    path += url_paths[i]
  }
  var url_params = []
  if (path.split('?').length > 1) {
    var params = path.split('?')[1].split('&')
    for (var i = 0; i < params.length; i++) {
      var param = {
        key:params[i].split('=')[0],
        value:params[i].split('=')[1]
      }
      url_params.push(param)
    }
  }
  if (Auth(request,path,url_params)) {
    try {
      var res = require(config.api.path+path.split('?')[0])
      var data = res.post(request.body,url_params)
      response.send(data)
      response.end('200')
    } catch (e) {
      console.log(e)
      response.writeHead(404, {
        'Content-Type': 'text/plain'
      })
      response.end('404: Path not found on server')
    }
  } else {
    response.writeHead(401, {
      'Content-Type': 'text/plain'
    })
    response.end('401: Authentication Error')
  }
}

var Auth = function(request,path,url_params) {
  console.log(request.method+' Request, Path: /api/'+path.split('?')[0])
  if (path.split('?')[0] == 'auth') {
    console.log('Authentication Request')
    for (var i = 0; i < url_params.length; i++) {
      var param = url_params[i]
      if (param.key == 'method') {
        var method = param.value
      }
    }
    if (typeof method != 'undefined') {
      console.log('Authentication Type: '+method)
      if (method == 'create') {
        return true
      }
    } else {
      return true
    }
  }
  if (typeof request.headers.cookie != 'undefined') {
    if (auth.try(request.headers.cookie)){
      console.log('Authentication Successful')
      return true
    } else {
      console.log('Authentication Failed: 401')
      return false
    }
  }
  console.log('No Authentication Cookie Present')
  return false
}
