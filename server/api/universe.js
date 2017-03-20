var config  = require('./../config')
var utils    = require('./../utils')
var uuid    = require('node-uuid')

exports.get = function(params,data,cookie) {
  var json = utils.readJSON('universe')
  for (var i = 0; i < json.universes.length; i++) {
    var u = json.universes[i]
    if (u.id == params.id && u.user_id == cookie.id) {
      return {ok:true, universe:u.data}
    }
  }
  return {ok:false}
}

exports.post = function(params,data,cookie) {
  var json = utils.readJSON('universe')
  if (typeof params.id != 'undefined') {
    for (var i = 0; i < json.universes.length; i++) {
      if (json.universes[i].id == params.id && json.universes[i].user_id == cookie.id) {
        json.universes[i].data = data
        config.writeJSON('universe',json)
        return {ok:true}
      }
    }
  } else {
    var _uuid = uuid.v1()
    json.universes.push({
      user_id: cookie.id,
      id: _uuid,
      data: data
    })
    utils.writeJSON('universe',json)
    return {ok:true, id:_uuid}
  }
  return {ok:false}
}
