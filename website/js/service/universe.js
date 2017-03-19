app.factory('universe', function($http,$cookies,config){

  var user_id = $cookies.get('id')
  var host = config.host

  var Universe = function(name) {
    this.created = new Date(Date.now())
    this.name = name
    this.map = []
  }

  return {
    create: function(name) {
      var universe = new Universe(name)
      return $http({
        method:'post',
        url:host+'api/universe',
        data:universe
      }).then(function(response){
        if (response.data.ok) {
          return universe
        } else {
          return false
        }
      })
    }
  }
})
