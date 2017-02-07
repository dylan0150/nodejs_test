exports.get = function(headers,params){

  var json = JSON.stringify({
    headers : headers,
    params  : params
  });

  return json
}
