exports.get = function(headers,urlParams) {
  var data = {}

  for (var key in urlParams) {
    data[key] = urlParams[key]
  }

  return data
}

exports.post = function(headers,urlParams,bodyParams) {
  var data = {}

  for (var key in bodyParams) {
    data[key] = bodyParams[key]
  }
  for (var key in urlParams) {
    data[key] = urlParams[key]
  }

  return data
}
