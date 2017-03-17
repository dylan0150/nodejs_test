var config = require('./config')
var auth   = require('./auth')

exports.get = function(request, response) {
  try {
    var ok = auth.accept(request,response).ok
  } catch (e) {
    console.log(e)
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
      response.status(404).end()
    }
  }
}

exports.post = function(request, response) {
  try {
    var ok = auth.accept(request,response).ok
  } catch (e) {
    console.log(e)
    response.status(403).end()
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
      response.status(404).end()
    }
  }
}

exports.login = function(request, response) {
  try {
    var data = auth.login(request, response)
    response.status(200).send(data).end()
  } catch (e) {
    console.log(e)
    response.status(403).end()
  }
}

exports.register = function(request, response) {
  try {
    var data = auth.register(request.body)
    response.status(200).send(data).end()
  } catch (e) {
    console.log(e)
    response.status(200).send({ok:false}).end()
  }
}

exports.auth = function(request, response) {
  try {
    var ok = auth.accept(request,response).ok

  } catch (e) {
    console.log(e)
    response.status(200).send({ok:false}).end()
  }
  if (!ok) {
    response.status(200).send({ok:false}).end()
  } else {
    response.status(200).send({ok:true}).end()
  }
}
