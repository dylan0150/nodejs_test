var fs      = require('fs')
var config  = require('./../server/config')
var crypto  = require('crypto')
var aes256  = require('aes256')
var uuid    = require('node-uuid')
var _cookie = require('cookie')

var path    = config.path
var db_path = config.db_path

var genRandomString = function(length){
  return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length)
}
var sha512 = function(string, salt){
  var hash = crypto.createHmac('sha512', salt)
  hash.update(string)
  var value = hash.digest('hex')
  return {
    salt:salt,
    hash:value
  }
}
var salthash = function(string) {
  var salt = genRandomString(32)
  return sha512(string,salt)
}

var aes_256_key = "0089a163d04d753caa1452137b0710778e6d452ee1089JKASDNJGASDHJf7b943d7e7d060bbfb4b7e5b2d2b54163fa046ASNDJKBYCWABJWE2fd24624aae95026273b5e4e88b860"
var encrypt = function(data) {
  return aes256.encrypt(aes_256_key,data)
}
var decrypt = function(data) {
  return aes256.decrypt(aes_256_key,data)
}

exports.decrypt = decrypt
exports.encrypt = encrypt
exports.hash    = salthash

exports.get = function(urlparams) {
  var json = JSON.parse(fs.readFileSync(db_path+'user.json','utf8'))
  var authenticated = false
  for (var i = 0; i < urlparams.length; i++) {
    var param = urlparams[i]
    if (param.key == 'id') {
      var id = param.value
    }
    if (param.key == 'username') {
      var username = param.value
    }
    if (param.key == 'password') {
      var password = param.value
    }
    if (param.key == 'cookie') {
      var cookie = param.value
    }
  }
  for (var i = 0; i < json.user.length; i++) {
    var user = json.user[i]
    if (typeof cookie == 'undefined') {
      var user_hash = sha512(username, decrypt(user.username_salt)).hash
      var pass_hash = sha512(password, decrypt(user.password_salt)).hash
      if (user_hash == user.username && pass_hash == user.password) {
        authenticated = true
        return {ok:true,cookie:user.cookie}
      }
    } else if (_cookie.parse(cookie).key == decrypt(user.cookie.key)) {
      authenticated = true
    }
  }
  return {ok:authenticated}
}

exports.post = function(data,urlparams) {
  var json = JSON.parse(fs.readFileSync(db_path+'user.json','utf8'))
  for (var i = 0; i < urlparams.length; i++) {
    var param = urlparams[i]
    if (param.key == 'method') {
      var method = param.value
    }
  }
  if (method == 'create') {
    var user = new User(data.user)
    user.setName(data.username)
    user.setPassword(data.password)
    json.user.push(user)
  }
  if (method == 'update') {
    for (var i = 0; i < json.user.length; i++) {
      if (json.user.id == data.id) {
        for (var key in data) {
          user[key] = data
        }
      }
    }
  }
  json = JSON.stringify(json)
  fs.writeFile(db_path+'user.json',json,'utf8')
}

var User = function(data) {
  this.id = uuid.v4();
  for (var key in data) {
    this[key] = encrypt(data[key])
  }
  this.setName = function(username) {
    var hash = salthash(username)
    this.username = hash.hash
    this.username_salt = encrypt(hash.salt)
  }
  this.setPassword = function(password) {
    var hash = salthash(password)
    this.password = hash.hash
    this.password_salt = encrypt(hash.salt)
  }
  var string = genRandomString(64)
  this.cookie = {
    key: encrypt(string)
  }
}
