exports.get = function(headers,urlParams) {
  var data = {}

  for (var key in urlParams) {
    data[key] = urlParams[key]
  }

  return data
}

exports.post = function(headers,urlParams,bodyParams) {
  var db = require('./../dbconfig')
  db.Create('test','test',[{name:"test"},{id:1}])
  var data = {}

  for (var key in bodyParams) {
    data[key] = bodyParams[key]
  }
  for (var key in urlParams) {
    data[key] = urlParams[key]
  }

  return data
}
