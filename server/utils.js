var fs = require('fs')

exports.readJSON = function(name){
  var data = fs.readFileSync(exports.path.db+name+'.json')
  return JSON.parse(data)
}

exports.writeJSON = function(name,json){
  fs.writeFileSync(exports.path.db+name+'.json',JSON.stringify(json))
}
