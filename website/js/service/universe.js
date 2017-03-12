app.factory('universeServe', function($http,config){
  var host = config.host
  return {
    get: function(id) {
      return $http({
        method: 'GET',
        url: host+'universe?id='+id
      }).then(function(response){
        return response.data
      })
    },
    create: function() {
      return $http({
        method: 'POST',
        url: host+'universe',
        data: JSON.stringify(new Universe()),
        json: true
      }).then(function(response){
        return response.data
      })
    },
    save: function(universe,id) {
      return $http({
        method: 'POST',
        url: host+'universe?id='+id,
        data: universe
      }).then(function(response){
        return response.data
      })
    }
  }
})
