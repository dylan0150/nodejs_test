var nodemailer      = require('nodemailer')
var wellknown       = require('nodemailer-wellknown')
var secure          = require('./../secure')

var can_reply       = 'Game Server <dylan_gameserver@yahoo.com>'
var noreply         = 'No Reply <donotreply@dylan_server.com>'

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

exports.sendEmail = function(type, message, to) {
  var options = {
    from:'',
    to:to,
    subject:'Hello',
    html:'<h1>Hello World</h1>'
  }
  if (type == 'test') {
    options.from = can_reply,
    options.to = 'dylan.hanner@yahoo.co.uk'
  }
  transporter.sendMail(options, function(error, info, response) {
    if (error) {
      console.log(error)
    }
    console.log(info)
    console.log(response)
  })
  transporter.close()
}
