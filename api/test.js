exports.get = function(headers,params){

  var json = JSON.stringify({
    params  : params
  });

  return json
}
