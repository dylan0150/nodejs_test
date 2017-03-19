var config = require('./config')
var auth   = require('./auth')

exports.get = function(request, response) {
  try {
    var ok = auth.accept(request,response).ok
  } catch (e) {
    config.error(e)
    response.status(200).send({ok:false}).end()
  }
  if (!ok) {
    response.status(200).send({ok:false}).end()
  } else {
    try {
      var params = auth.parseParams(request.url)
      var cookie = auth.parseCookie(request.headers.cookie)
      var res = require('.'+request.url.split('?')[0]).get(params,request.body,cookie)
      response.status(200).send(res).end()
    } catch (e) {
      config.error(404,e,request,response)
    }
  }
}

exports.post = function(request, response) {
  try {
    var ok = auth.accept(request,response).ok
  } catch (e) {
    config.error(new Error(e),request,response)
  }
  if (!ok) {
    response.status(403).send({ok:false}).end()
  } else {
    try {
      var params = auth.parseParams(request.url)
      var cookie = auth.parseCookie(request.headers.cookie)
      var res = require('.'+request.url.split('?')[0]).post(params,request.body,cookie)
      response.status(200).send(res).end()
    } catch (e) {
      config.error(404,e,request,response)
    }
  }
}

exports.login = function(request, response) {
  try {
    var data = auth.login(request, response)
    response.status(200).send(data).end()
  } catch (e) {
    config.error(403,e,request,response)
  }
}

exports.register = function(request, response) {
  try {
    var data = auth.register(request.body)
    response.status(200).send(data).end()
  } catch (e) {
    config.error(403,e,request,response)
  }
}

exports.auth = function(request, response) {
  try {
    var ok = auth.accept(request,response).ok
  } catch (e) {
    config.error(403,e,request,response)
  }
  if (!ok) {
    response.status(200).send({ok:false}).end()
  } else {
    response.status(200).send({ok:true}).end()
  }
}
