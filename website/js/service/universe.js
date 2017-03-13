app.factory('universeServe', function($http,$cookies,config){
  var host = config.host
  return {
    get: function(id) {
      return $http({
        method: 'get',
        url: host+'universe?id='+id
      }).then(function(response){
        return response.data
      })
    },
    create: function() {
      return $http({
        method: 'post',
        url: host+'universe',
        data: JSON.stringify(new Universe({},$cookies.get('id'))),
        json: true
      }).then(function(response){
        return response.data
      })
    },
    save: function(universe,id) {
      return $http({
        method: 'post',
        url: host+'universe?id='+id,
        data: universe
      }).then(function(response){
        return response.data
      })
    },
    getAll: function() {
      return $http({
        method: 'get',
        url: host+'universe'
      }).then(function(response){
        return response.data
      })
    }
  }
})
