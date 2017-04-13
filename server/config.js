exports.host = {
  port:8080,
  name:"localhost"
}

exports.api = {
  path:'./../api/'
}

exports.setPath = function(url_path) {
  var path = ""
  var arr = url_path.split('/')
  for (var i = 0; i < arr.length-1; i++) {
    path += arr[i]
    path += '/'
  }
  exports.path.website = path+'website/'
  exports.path.index = path
  exports.path.api = path+'server/api/'
  exports.path.db = path+'server/db/'
}

exports.path = {
  api:'api',
  db:'db'
}

exports.error = function(code, error, request, response) {
  console.log('Error:'+code)
  console.error(new Error(error).stack)
  switch (code) {
    default: response.status(code).send({ok:false}).end()
  }
}
