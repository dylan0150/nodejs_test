var fs = require('fs')
var config = require('./../config')

exports.get = function(params,data,cookie) {
  var json = JSON.parse(fs.readFileSync(config.path.index+'server/user.json'))
  var data = {}
  for (var i = 0; i < json.users.length; i++) {
    var user = json.users[i]
    if (user.id == cookie.id) {
      data = user.data
    }
  }
  return {ok:true, user:data}
}
