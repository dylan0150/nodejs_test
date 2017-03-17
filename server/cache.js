var config = require('./config.js')
var fs = require('fs')

exports.get = function() {

  var templates = []

  var filter = function(path, current_path) {
    var items = fs.readdirSync(path)
    for (var i = 0; i < items.length; i++) {
      var item = items[i]
      if (item.split('.').length > 1) {
        if (item.split('.')[1] == 'html' && item != 'index.html') {
          var html = fs.readFileSync(path+item,'utf-8')
          var template = {url:item,templateUrl:current_path+item,html:html}
          templates.push(template)
        }
      } else if (item != 'templates'){
        filter(path+item+'/', current_path+item+'/')
      }
    }
  }

  filter(config.path.website,'')

  return {ok:true,templates:templates}
}
