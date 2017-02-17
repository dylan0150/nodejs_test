var fs = require('fs')
var config = require('./config')

exports.New = function(json_name) {
  fs.writeFile(
    config.path+"json/"+json_name+".json",
    '{"'+json_name+'":{}}'
  )
}

exports.Create = function(json_name, obj_name, params) {
  var json = fs.readFileSync(config.path+"json/"+json_name+".json")
  var file = JSON.parse(json.toString())
  file[json_name][obj_name] = params
  fs.writeFile(
    config.path+"json/"+json_name+".json",
    JSON.stringify(file)
  )
}

exports.Write = function(json_name, obj_name, param) {
  //switch param.action
  //if push json_name.obj_name[param.key].push(param.data)
  //if apply json_name.obj_name[param.key][data.key] = data.data
  //if set json_name.obj_name[param.key] = param.data
}

exports.Read = function(json_name, obj_name, key) {
  //return json_name.obj_name[key]
}

exports.Delete = function(json_name, obj_name, params) {
  //json_name.obj_name = undefined
}
