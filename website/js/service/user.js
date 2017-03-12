app.factory('user', function($cookies,$state,$http,config){
  var host = config.host
  return {
    login: function(username,password){
      return $http({
        method:'get',
        url:host+'auth?username='+username+'&password='+password
      }).then(function(response){
        if (response.data.ok) {
          var date = new Date();
          date.setDate(date.getDate() + 1)
          $cookies.put('auth',response.data.cookie.key,{expires:date})
        }
        console.log($cookies.getAll())
      })
    },
    create: function(username,password,data) {
      if (typeof data == 'undefined') {
        var data = {}
      }
      data.username = username
      data.password = password
      return $http({
        method:'post',
        url:host+'auth?method=create',
        data:data,
        json:true
      }).then(function(response){
        console.log(response)
      })
    },
    auth: function() {

    }
  }
})
