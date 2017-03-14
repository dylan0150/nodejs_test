var config =  require('./config')
var auth =    require('./auth')

exports.get = function(request, response) {
  try {
    auth.accept(request,response)
  } catch (e) {
    console.log(e)
    response.status(403).end()
  }
}

exports.post = function(request, response) {
  try {
    auth.accept(request,response)
  } catch (e) {
    console.log(e)
    response.status(403).end()
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
    response.status(403).end()
  }
}
