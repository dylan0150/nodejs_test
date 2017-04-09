var nodemailer      = require('nodemailer')
var wellknown       = require('nodemailer-wellknown')
var fs              = require('fs')
var config          = require('./config')

var secure          = require('./../secure')

var path            = config.path.mail
var can_reply       = 'Game Server <dylan_gameserver@yahoo.com>'
var noreply         = 'Game Server <donotreply@dylan_gameserver.com>'

var data = fs.readdirSync(path)
var meta = JSON.parse(fs.readFileSync(path + 'meta.json'))
var templates = []
for (var i = 0; i < data.length; i++) {
  var n = data[i].split('.')
  if (n[n.length - 1] == 'html') {
    for (var i = 0; i < meta.length; i++) {
      if (meta[i].name == n[0]) {
        templates.push({
          name: n[0],
          from: meta[i].from,
          subject: meta[i].subject
        })
      }
    }
  }
}

exports.send = function(type, to, params) {

  if (typeof type != 'string') return { ok:false, err:3003, errmsg:'Invalid Type' }
  if (typeof to   != 'string') return { ok:false, err:3004, errmsg:'Invalid To' }
  var valid = false

  try {
    var yahoo = wellknown('Yahoo')
    var transporter = nodemailer.createTransport({
      host:   yahoo.host,
      port:   yahoo.port,
      secure: yahoo.secure,
      auth: {
        user: secure.get('email_username'),
        pass: secure.get('email_password')
      }
    })
  } catch (e) {
    console.error(new Error(e).stack)
    console.log('ERROR: Mail server not setup correctly')
    console.log('ERROR: Please make sure to run :node secure.js email_username [username]')
    console.log('ERROR: Please make sure to run :node secure.js email_password [password]')
    return { ok:false, err:3002, errmsg:'Mail server not setup correctly' }
  }

  for (var i = 0; i < templates.length; i++) {
    if (templates[i].name == type) {
      try {
        var html = fs.readFileSync(path + type + '.html', 'UTF-8')
        for (var key in params) html = html.replace(new RegExp("{{"+key+"}}",'g'), params[key]);
        var options = {
          from    : templates[i].from,
          to      : to,
          subject : templates[i].subject,
          html    : html
        }
        valid = true;
      } catch (e) {
        console.error(new Error(e).stack)
        return { ok:false, err:3005, errmsg:e }
      }
    }
  }
  
  console.log(options)
  if (false) { //TODO: if(valid) - When ready for live emailing.
    transporter.sendMail(options, function(error, info, response) {
      if (error) {
        console.log(error)
      }
      console.log(info)
      console.log(response)
    })
    transporter.close()
  } else {
    console.log('ERROR: Invalid Email Type')
    return { ok:false, err:3001, errmsg:'Invalid Email Type' }
  }

  return { ok:true }
}

exports.send('register','dylan.hanner@yahoo.co.uk',{})
