var fs = require('fs')
var config = require('./../config')
var utils  = require('./../utils')

exports.get = function(params,data,cookie) {
  var json = JSON.parse(fs.readFileSync(config.path.index+'server/user.json'))
  var data = {}
  for (var i = 0; i < json.users.length; i++) {
    var user = json.users[i]
    if (user.id == cookie.id) {
      data = user.data
    }
  }
  data.universes = []
  json = utils.readJSON('universe')
  for (var i = 0; i < json.universes.length; i++) {
    var u = json.universes[i]
    if (u.user_id == cookie.id) {
      data.universes.push({id:u.id,universe:u.data})
    }
  }
  return {ok:true, user:data}
}
