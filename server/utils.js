var fs = require('fs')
var config = require('./config')

exports.readJSON = function(name){
  var data = fs.readFileSync(config.path.db+name+'.json')
  return JSON.parse(data)
}

exports.writeJSON = function(name,json){
  fs.writeFileSync(config.path.db+name+'.json',JSON.stringify(json))
}
