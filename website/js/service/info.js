app.factory('info', function($http,user){
  var data = {}
  return {
    store: function(key,value) {
      data[key] = value
    },
    get: function() {
      return data
    }
  }
})
