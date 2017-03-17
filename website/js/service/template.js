app.factory('template', function($http, $templateCache, config){
  var host = config.host

  var get = function(){
    return $http({
      method:'get',
      url:host+'cache'
    }).then(function(response){
      return response.data
    })
  }

  return {
    cache: function(){
      return get().then(function(response){
        for (var i = 0; i < response.templates.length; i++) {
          var data = response.templates[i]
          $templateCache.put(data.url,data.html)
        }
        return response
      })
    }
  }
})
