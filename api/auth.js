var fs      = require('fs')
var config  = require('./../server/config')
var crypto  = require('crypto')
var aes256  = require('aes256')
var uuid    = require('node-uuid')

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

exports.get = function(urlparams,cookie) {
  if (typeof cookie != 'undefined') {
    var id = cookieParse(cookie).id
  }
  console.log('Authentication Type: Login')
  var json = JSON.parse(fs.readFileSync(db_path+'user.json','utf8'))
  var authenticated = false
  for (var i = 0; i < urlparams.length; i++) {
    var param = urlparams[i]
    if (param.key == 'username') {
      var username = param.value
    }
    if (param.key == 'password') {
      var password = param.value
    }
  }
  var auth_user
  var test = function() {
    var user_hash = sha512(username, decrypt(user.username_salt)).hash
    var pass_hash = sha512(password, decrypt(user.password_salt)).hash
    if (user_hash == user.username && pass_hash == user.password) {
      console.log('User Login Successful, id:'+user.id)
      auth_user = user
      authenticated = true
    }
  }
  console.log(json)
  console.log(cookie)
  for (var i = 0; i < json.user.length; i++) {
    var user = json.user[i]
    if (typeof id != 'undefined') {
      if (id == user.id) {
        test()
      }
    } else {
      test()
    }
  }
  if (authenticated) {
    setCookie(auth_user)
    var cookie = decrypt(auth_user.cookie.key)
    var id = auth_user.id
    json = JSON.stringify(json)
    fs.writeFile(db_path+'user.json',json,'utf8')
    return {ok:true,cookie:cookie,id:id}
  } else {
    console.log('Login Authentication Failed')
    return {ok:false}
  }
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
    for (var i = 0; i < json.user.length; i++) {
      var user_hash = sha512(data.username, decrypt(json.user[i].username_salt)).hash
      if (user_hash == json.user[i].username) {
        console.log('Duplicate Username Found')
        return {ok:false,error:'duplicate'}
      }
    }
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
  return {ok:true}
}

exports.try = function(cookie) {
  var found = false
  cookie = cookieParse(cookie)
  var json = JSON.parse(fs.readFileSync(db_path+'user.json','utf8'))
  for (var i = 0; i < json.user.length; i++) {
    var user = json.user[i]
    if (user.id == cookie.id) {
      console.log('User Match, id: '+user.id)
      found = true
      if (decrypt(user.cookie.key) == cookie.auth) {
        console.log('Cookie Authentication Success')
        return true
      } else {
        console.log('Cookie Authentication Failure')
      }
    }
  }
  if (!found) {
    console.log('No Matching User id')
  } else {
    console.log('Uncaught Authentication Error')
  }
  return false
}

exports.returnUser = function(cookie) {
  cookie = cookieParse(cookie)
  var json = JSON.parse(fs.readFileSync(db_path+'user.json','utf8'))
  for (var i = 0; i < json.user.length; i++) {
    if (cookie.id == json.user[i].id) {
      var user = json.user[i]
    }
  }
  return user
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
}

var setCookie = function(user) {
  var string = genRandomString(64)
  user.cookie = {
    key: encrypt(string)
  }
}

var cookieParse = function(str) {
  var obj = {}
  var arr = str.split('; ')
  for (var i = 0; i < arr.length; i++) {
    obj[arr[i].split('=')[0]] = arr[i].split('=')[1]
  }
  return obj
}
