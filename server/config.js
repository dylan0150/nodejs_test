exports.host = {
  port:8080,
  name:"localhost"
}

exports.api = {
  path:'./../api/'
}

exports.error = function(code, error, request, response) {
  console.log('Error:'+code)
  console.log(new Error(error).stack)
  response.status(code).send({ok:false}).end()
}
