var auth = require('./auth')

exports.get = function(urlparams,cookie) {
  var user = auth.returnUser(cookie)
  delete user.cookie
  delete user.password
  delete user.password_salt
  delete user.username
  delete user.username_salt
  return {ok:true,user:user}
}
