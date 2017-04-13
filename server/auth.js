var aes     = require('aes256')
var crypto  = require('crypto')
var uuid    = require('node-uuid')
var fs      = require('fs')

var secure  = require('./../secure')
var config  = require('./config')
var mailer  = require('./mailer')

try {
  var aes_key = secure.key
} catch (e) {
  console.log('Error: no aes256 key found')
  throw e;
}

exports.accept = function(request) {
  if (typeof request.headers.cookie == 'undefined') {
    return {ok:false, err:4032, errmsg:'No Cookie Found'}
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
    return { ok:false, err:4034, errmsg:'Invalid/Expired Cookie' }
  } else {
    return {
      cookie:cookie,
      user  :user,
      ok    :true
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
    return { ok:false, err:4033, errmsg:'Invalid Login Credentials' }
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
    if (json.users[i].username == data.username) return { ok:false, err:4031, errmsg:'Duplicate Username' };
  }
  if (!validateEmail(data.email)) return { ok: false, err:4035, errmsg:'Invalid Email' };
  var user = new User(data)
  var cookie = user.cookie
  var id = user.id
  json.users.push(user)
  fs.writeFileSync(config.path.index+'server/user.json',JSON.stringify(json))
  var username  = user.username
  var link      = config.host.sitename + '/register?id=' + exports.encrypt(user.id)
  var site_name = config.host.sitename
  mailer.send('register', data.email, {username, link, site_name})
  return { ok:true, cookie:cookie, id:id }
}

exports.validate = function(request) {
  var id = exports.decrypt( request.url.split('/register?id=')[1] )
  var json = JSON.parse(fs.readFileSync(config.path.index+'server/user.json'))
  var valid = false
  for (var i = 0; i < json.users.length; i++) {
    if (json.users[i].id == id) {
      valid = true
      console.log('Validation for user '+id)
      if (json.users[i].validated == false) {
        mailer.send('validate-success', json.users[i].data.email, {username: json.users[i].username})
      }
      json.users[i].validated = true
    }
  }
  if (valid) {
    fs.writeFileSync(config.path.index+'server/user.json',JSON.stringify(json))
    return { ok:true }
  } else {
    return { ok:false, err:4038, errmsg:'Id invalid'}
  }
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

var validateEmail = function(email) {
  console.log('Email validation for ' + email)
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(email)
}
