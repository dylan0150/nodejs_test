exports.host = {
  port:8080,
  name:"localhost"
}

exports.api = {
  path:'./../api/'
}

exports.setPath = function(url_path) {
  var path = ""
  var arr = url_path.split('/')
  for (var i = 0; i < arr.length-1; i++) {
    path += arr[i]
    path += '/'
  }
  exports.path.website = path+'website/'
  exports.path.index = path
  exports.path.api = path+'server/api/'
  exports.path.db = path+'server/db/'
}

exports.path = {
  api:'api',
  db:'db'
}

exports.crypt = {
  aes256: "£$%^&%*$£%^^%&$^765476924567352^&%^&bhusdfbjhFTYFVTYHJ7h8sdhf8ysdfhn789N^&BN^&BN^NM&*N^&nm8NM89na9sd^&%*8787n78n*NM&*9ntsdf8nm98dsfn89*&n789nmasfdyn9fds8&*87*&8676*&^8*&%^$9sf7d89nm98s"
}
