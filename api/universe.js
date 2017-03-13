var fs = require('fs')
var config = require('./../server/config')
var path = config.path
var db_path = config.db_path
var auth = require('./auth')

exports.get = function(urlparams,cookie) {
  var getAll = true
  for (var i = 0; i < urlparams.length; i++) {
    if (urlparams[i].key == 'id') {
      getAll = false
      var id = urlparams[i].value
    }
  }
  var user = auth.returnUser(cookie)
  var json = JSON.parse(fs.readFileSync(db_path+'universe.json','utf8'))
  if (getAll) {
    var universe_array = []
    for (var i = 0; i < json.universe.length; i++) {
      console.log(json.universe[i].user)
      console.log(user.id)
      if (json.universe[i].user == user.id) {
        universe_array.push(json.universe[i])
      }
    }
    return {ok:true,universes:universe_array}
  } else {
    if (typeof json.universe[id] != 'undefined') {
      if (json.universe[id].user == user.id) {
        return {ok:true,universe:json.universe[id]}
        console.log('Universe Found, id:'+id)
      } else {
        console.log('User does not own that universe')
        return {ok:false}
      }
    }
    console.log('Universe does not exist with id:'+id)
    return {ok:false}
  }
}

exports.post = function(_data,urlparams,cookie) {
  var json = JSON.parse(fs.readFileSync(db_path+'universe.json','utf8'))
  var update = false
  for (var i = 0; i < urlparams.length; i++) {
    if (urlparams[i].key == 'id') {
      update = true
      var id = urlparams[i].value
    }
  }
  if (update) {
    json.universe[id] = _data
    console.log('Universe id:'+id+' updated.')
  } else {
    var id = json.universe.length
    json.universe.push(_data)
    console.log('Universe id:'+id+' created.')
  }
  json = JSON.stringify(json)
  fs.writeFile(db_path+'universe.json',json,'utf8')
  return {ok:true,id:id}
}
