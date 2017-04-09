var aesKey = ""

var aes = require('aes256')
var fs = require('fs')
var readline = require('readline')

exports.path = process.argv[1].split('secure.js')[0]

exports.setUp = function(callback) {
  var change = false
  try {
    var json = JSON.parse(fs.readFileSync(exports.path + 'secure.json'))
  } catch (e) {
    console.log('No secure.json found, creating new secure.json')
    change = true
    var json = {}
  }
  var input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  var getAes = function(callback) {
    if (typeof json.aes256 == 'undefined') {
      input.question('Please Enter an aes256 key',function(res){
        change = true
        json.aes256 = aesKey = res
        getEmail(callback)
      })
    } else {
      aesKey = json.aes256
      getEmail(callback)
    }
  }
  var getEmail = function(callback) {
    if (typeof json.email_username == 'undefined') {
      input.question('Please enter your email username',function(res){
        change = true
        json.email_username = aes.encrypt(aesKey, res)
        getPass(callback)
      })
    } else {
      getPass(callback)
    }
  }
  var getPass = function(callback) {
    if (typeof json.email_password == 'undefined') {
      input.question('Please enter your email password',function(res){
        change = true
        json.email_password = aes.encrypt(aesKey, res)
        if (change) fs.writeFileSync(exports.path + 'secure.json', JSON.stringify(json));
        callback()
      })
    } else {
      callback()
    }
  }
  getAes(callback)
}

exports.get = function(key) {
  var json = JSON.parse(fs.readFileSync(exports.path + 'secure.json'))
  return aes.decrypt(aesKey, json[key])
}

exports.set = function(key, value) {
  if (key == 'aes256') return false;
  var json = JSON.parse(fs.readFileSync(exports.path + 'secure.json'))
  json[key] = aes.encrypt(aesKey, value)
  fs.writeFileSync(exports.path + 'secure.json', JSON.stringify(json))
}

exports.key = aesKey

if (process.argv.length > 2) {
  exports.set(process.argv[2], process.argv[3])
  console.log('DONE')
}
