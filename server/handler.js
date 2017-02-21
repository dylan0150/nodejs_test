var config = require('./config')

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
  try {
    var res = require(config.api.path+path.split('?')[0])
    res.get(url_params)
    response.end('200')
  } catch (e) {
    console.log(e)
    response.writeHead(404, {
      'Content-Type': 'text/plain'
    })
    response.end('404: Path not found on server')
  }
}

exports.post = function(request, response) {

}
