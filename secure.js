var aesKey = ""

var aes = require('aes256')
var fs = require('fs')

exports.path = process.argv[1].split('secure.js')[0]

exports.get = function(key) {
  var json = JSON.parse(fs.readFileSync(exports.path + 'secure.json'))
  return aes.decrypt(aesKey, json[key])
}

exports.set = function(key, value) {
  var json = JSON.parse(fs.readFileSync(exports.path + 'secure.json'))
  json[key] = aes.encrypt(aesKey, value)
  fs.writeFileSync(exports.path + 'secure.json', JSON.stringify(json))
}

exports.key = aesKey

if (process.argv.length > 2) {
  exports.set(process.argv[2], process.argv[3])
  console.log('DONE')
}
