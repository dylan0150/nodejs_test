var fs = require('fs')
var config = require('./../server/config')
var path = config.path
var db_path = config.db_path

exports.get = function(urlparams) {
  for (var i = 0; i < urlparams.length; i++) {
    var param = urlparams[i]
    if (param.key == 'id') {
      var data = param.value
    }
  }
  if (typeof data != 'undefined') {
    var json = JSON.parse(fs.readFileSync(db_path+'universe.json','utf8'))
    if (typeof json.universe[data] != 'undefined') {
      var obj = json.universe[data]
    }
    if (typeof obj != 'undefined') {
      return {ok:true,universe:obj}
    }
    else {
      return {ok:false}
    }
  }
}

exports.post = function(_data,urlparams) {
  for (var i = 0; i < urlparams.length; i++) {
    var param = urlparams[i]
    if (param.key == 'id') {
      var data = param.value
    }
  }
  var json = JSON.parse(fs.readFileSync(db_path+'universe.json','utf8'))
  console.log(_data)
  if (typeof data != 'undefined') {
    json.universe[data] = _data
    var id = data
    json = JSON.stringify(json)
  } else {
    json.universe.push(_data)
    var id = json.universe.length
    json = JSON.stringify(json)
  }
  console.log(json)
  fs.writeFile(db_path+'universe.json',json,'utf8')
  return {id: id,ok:true}
}
