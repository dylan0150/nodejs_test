//SETUP
var fs              = require('fs')
var express         = require('express')
var bodyParser      = require('body-parser')
var config          = require('./server/config')
var secure          = require('./secure')

var arr = process.argv[1].split('/')
var path = ""
for (var i = 0; i < arr.length-1; i++) {
  path += arr[i]
  path += '/'
}
config.path = {
  website : path+'website/',
  index   : path,
  api     : path+'server/api/',
  db      : path+'server/db/',
  mail    : path+'server/mailtemplates/'
}
secure.path = path

if (!secure.setUp()) {
  console.log('secure setup failed')
  return false;
} else { console.log('secure setup successful') }

var auth            = require('./server/auth')
var request_handler = require('./server/handler')
var mailer          = require('./server/mailer')
var exapp           = express()

//WEBSITE
exapp.use(express.static('website'))
exapp.use(bodyParser.json())
exapp.use(function(req,res,next){
  //called for all requests
  next()
})

//API
exapp.get('/auth', function(request,response){
  request_handler.auth(request,response)
})
exapp.get('/cache', function(request,response){
  response.status(200).send(require('./server/cache').get()).end()
})
exapp.get('/login*', function(request,response){
  request_handler.login(request,response)
})
exapp.post('/register*', function(request,response){
  request_handler.register(request,response)
})
exapp.get('/register*', function(request,response){
  request_handler.validate(request,response)
})
exapp.get('/api*', function(request,response){
  request_handler.get(request,response)
})
exapp.post('/api*', function(request,response){
  request_handler.post(request,response)
})

var commands = {
  err: function(msg) {
    ///DESC Throw a new error and crash///DESC
    console.info('exit');
    throw new Error('Forced error');
    return true;
  },
  cmd: function() {
    ///DESC Prints all available commands///DESC
    console.info(' --- Commands:')
    for (var key in commands) {
      console.info(key+" --"+commands[key].toString().split('///DESC')[1])
    }
    return true;
  },
  log: function() {
    ///DESC Saves current log to a new file and begins a new logfile///DESC
    saveLog()
    newLog()
  }
}

var newLog = function(){
  var str = '<<< BEGIN LOG '
  str += '|| date: '+new Date(Date.now()).toString()+" "
  str += '|| host: '+config.host.name+':'+config.host.port
  str += ' >>>\n\n'
  fs.writeFileSync(config.path.index+'log/__log.txt',str)
}
var saveLog = function(){
  var log = fs.readFileSync(config.path.index+'server/log/__log.txt','UTF-8')
  var now = new Date(Date.now())
  var year = now.getFullYear()
  var month = now.getMonth() + 1
  var day = now.getDate()
  var path = config.path.index+'log/logfile_'+day+month+year+'_'+now+'.txt'
  fs.writeFileSync(path.replace(/ /g,''),log)
}
console.log = function(data) {
  var now = new Date(Date.now())
  var time = now.getHours()+":"+now.getMinutes()+":"
  var seconds = now.getSeconds()
  if (seconds < 10) { seconds = "0"+seconds }
  var mseconds = now.getMilliseconds()
  if (mseconds < 10) { mseconds = "00"+mseconds }
  else if (mseconds < 100) { mseconds = "0"+mseconds }
  time += seconds+"::"+mseconds+" "
  var entry = time+data.toString()+"\n"
  fs.appendFileSync(config.path.index+'log/__log.txt',entry)
}
console.error = function(data) {
  var now = new Date(Date.now())
  var time = now.getHours()+":"+now.getMinutes()+":"
  var seconds = now.getSeconds()
  if (seconds < 10) { seconds = "0"+seconds }
  var mseconds = now.getMilliseconds()
  if (mseconds < 10) { mseconds = "00"+mseconds }
  else if (mseconds < 100) { mseconds = "0"+mseconds }
  time += seconds+"::"+mseconds+" "
  var entry = time+data.toString()+"\n"
  fs.appendFileSync(config.path.index+'log/__err.txt',entry)
}

try {
  var log = fs.readFileSync(config.path.index+'log/__log.txt','UTF-8')
  var str = '\n<<< BEGIN LOG '
  str += '|| date: '+new Date(Date.now()).toString()+" "
  str += '|| host: '+config.host.name+':'+config.host.port
  str += ' >>>\n\n'
  fs.appendFileSync(config.path.index+'log/__log.txt',str)
} catch (e) {
  console.info('No log found: starting new logfile')
  newLog()
}

//SERVER
exapp.listen(config.host.port, function () {
  console.info('HOSTNAME:'+config.host.name+', listening on PORT:'+config.host.port)
  console.info('Server Running')
  commands.cmd()
  process.stdin.setEncoding('UTF-8')
  var prompt = "% <"+config.host.name+":"+config.host.port+"> "
  process.stdout.write(prompt)
  process.stdin.on('data', function(data){
    console.log(data.toString().trim())
    try {
      var params = (data.trim()+"").replace(/\n/g,'').split(' ')
      var command = params[0]
      params.splice(0,1)
      commands[command].apply(null,params)
    } catch (e) {
      if (e.toString() == 'Error: Forced error') throw e;
      console.info('Sorry, '+(data.trim()+"").replace(/\n/g,'')+' is not a valid command. Use [cmd] to print all available commands.')
    }
    process.stdout.write(prompt)
  })
})
