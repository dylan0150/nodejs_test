var aes     = require('aes256')
var crypto  = require('crypto')
var uuid    = require('node-uuid')
var fs      = require('fs')

var config  = require('./config')

var aes_key = config.crypt.aes256

exports.accept = function(request) {
  if (typeof request.headers.cookie == 'undefined') {
    return {ok:false}
  }
  var cookie = exports.parseCookie(request.headers.cookie)
  var json = JSON.parse(fs.readFileSync(config.path.index+'server/user.json'))
  authorized = false
  for (var i = 0; i < json.users.length; i++) {
    if (json.users[i].id == cookie.id && json.users[i].cookie.key == cookie.key) {
      authorized = true
      var user = json.users[i]
    }
  }
  if (!authorized) {
    return {ok:false}
  } else {
    return {
      'cookie':cookie,
      'user'  :user,
      'ok'    :true
    }
  }
}

exports.login = function(request) {
  var json = JSON.parse(fs.readFileSync(config.path.index+'server/user.json'))
  var params = exports.parseParams(request.url)
  authorized = false
  for (var i = 0; i < json.users.length; i++) {
    if (json.users[i].username == params.username) {
      var pass = sha512(params.password,exports.decrypt(json.users[i].salt)).hash
      if (pass == json.users[i].password) {
        authorized = true
        var cookie = setCookie(json.users[i])
        json.users[i].cookie = cookie
        var user = json.users[i]
      }
    }
  }
  if (!authorized) {
    return {ok:false}
  } else {
    fs.writeFileSync(config.path.index+'server/user.json',JSON.stringify(json))
    return { cookie:cookie, user:user, ok:true }
  }
}

exports.register = function(data) {
  var json = JSON.parse(fs.readFileSync(config.path.index+'server/user.json'))
  for (var i = 0; i < json.users.length; i++) {
    if (json.users[i].email == data.email) {
      console.log( 'Duplicate email clash for ' + data.email )
      console.log( 'Email validated: ' + json.users[i].validated )
      return { ok:false, err:4030, errmsg:'Duplicate Email' }
    }
    if (json.users[i].username == data.username) {
      return { ok:false, err:4031, errmsg:'Duplicate Username' }
    }
  }
  delete data.key
  var user = new User(data)
  var cookie = user.cookie
  var id = user.id
  json.users.push(user)
  fs.writeFileSync(config.path.index+'server/user.json',JSON.stringify(json))
  return { ok:true, cookie:cookie, id:id }
}

exports.parseCookie = function(cookie) {
  cookie = cookie.split('; ')
  var obj = {}
  for (var i = 0; i < cookie.length; i++) {
    obj[cookie[i].split('=')[0]] = cookie[i].split('=')[1]
  }
  return obj
}
exports.parseParams = function(url) {
  var obj = {}
  if (url.split('?').length > 1) {
    var params = url.split('?')[1].split('&')
    for (var i = 0; i < params.length; i++) {
      obj[params[i].split('=')[0]] = params[i].split('=')[1]
    }
  }
  return obj
}

exports.encrypt = function(string) {
  return aes.encrypt(aes_key,string)
}
exports.decrypt = function(string) {
  return aes.decrypt(aes_key,string)
}

var genRandomString = function(len) {
  return crypto.randomBytes(Math.ceil(len/2)).toString('hex').slice(0,len)
}
var sha512 = function(string, salt) {
  var hash = crypto.createHmac('sha512', salt)
  hash.update(string)
  hash = hash.digest('hex')
  return {
    salt:salt,
    hash:hash
  }
}
var salthash = function(string) {
  var salt = genRandomString(16)
  return sha512(string,salt)
}

var setCookie = function(user) {
  if (typeof user.cookie == 'undefined') {
    user.cookie = {}
  }
  user.cookie.key = salthash(uuid.v4()).hash
  return user.cookie
}

var User = function(data) {
  var pass = salthash(data.password)
  this.username = data.username
  this.password = pass.hash
  this.salt = exports.encrypt(pass.salt)
  this.validated = false
  delete data.username
  delete data.password
  this.id   = uuid.v1()+'-'+uuid.v4()
  this.data = data
  setCookie(this)
}
