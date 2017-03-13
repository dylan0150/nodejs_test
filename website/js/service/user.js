app.factory('user', function($cookies,$state,$http,config){
  var host = config.host
  var userdata = {loggedin:false}
  return {
    login: function(username,password){
      return $http({
        method:'get',
        url:host+'auth?username='+username+'&password='+password
      }).then(function(response){
        if (response.data.ok) {
          var date = new Date();
          date.setDate(date.getDate() + 1)
          $cookies.put('auth',response.data.cookie,{expires:date})
          $cookies.put('id',response.data.id)
          userdata = response.data
          userdata.loggedin = true
          return $http({
            method:'get',
            url:host+'universe'
          }).then(function(response){
            userdata.universes = response.data.universes
            $state.go('rts')
          })
        }
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
    get: function() {
      return userdata
    },
    auth: function() {
      return $http({
        method:'get',
        url:host+'user'
      }).then(function(response){
        userdata = response.data.user
        userdata.loggedin = true
        return response.data.ok
      })
    }
  }
})
