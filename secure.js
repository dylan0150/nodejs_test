var aesKey = ""

var aes = require('aes256')
var fs = require('fs')
var rls = require('readline-sync')

exports.path = process.argv[1].split('secure.js')[0]

exports.setUp = function() {
  var change = false
  try {
    var json = JSON.parse(fs.readFileSync(exports.path + 'secure.json'))
  } catch (e) {
    console.log('No secure.json found, creating new secure.json')
    change = true
    var json = {}
  }
  if (typeof json.aes256 == 'undefined') {
    json.aes256 = rls.question('Please enter an aes256 encryption key\n> ', { hideEchoBack: true })
    change = true
  } else { console.log('aes256 key found') }
  exports.key = aesKey = json.aes256
  if (typeof json.email_username == 'undefined') {
    var res = rls.question('Please enter your email username\n> ', { hideEchoBack: false })
    change = true
    json.email_username = aes.encrypt(aesKey, res)
  } else { console.log('email username found') }
  if (typeof json.email_password == 'undefined') {
    var res = rls.question('Please enter your email password\n> ', { hideEchoBack: true })
    change = true
    json.email_password = aes.encrypt(aesKey, res)
  } else { console.log('email password found') }
  if (change) fs.writeFileSync(exports.path + 'secure.json', JSON.stringify(json));
  return true;
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
