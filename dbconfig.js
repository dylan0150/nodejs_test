exports.insert = function(dbname){

  var config = require('./config');

  var connection = nodeMaria.createConnection({
    driverType: nodeMaria.DRIVER_TYPE_HANDLER_SOCKET,
    host:config.db.host,
    port:config.db.port
  });

  connection.on('error', function(error) {
    console.log(error);
    process.exit(1);
  });

  connection.on('connect', function(){
    console.log('New MariaDB connection, host:'+config.db.host+', port:'+config.db.port+', type:INSERT');

  })
}
