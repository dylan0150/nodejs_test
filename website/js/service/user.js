app.factory('user', function($cookies,$state,$http,config){
  var host = config.host
  var userdata = {loggedin:false}
  return {
    login: function(username,password){
      return $http({
        method:'get',
        url:host+'login?username='+username+'&password='+password
      }).then(function(response){
        console.log(response)
        $cookies.put('key', response.data.cookie.key)
        $cookies.put('id',  response.data.user.id)
        if (response.data.ok) {
          $state.go('main')
        }
      })
    },
    create: function(username,password,key) {
      if (typeof data == 'undefined') {
        var data = {}
      }
      data.username = username
      data.password = password
      data.key = key
      return $http({
        method:'post',
        url:host+'register',
        data:data,
        json:true
      }).then(function(response){
        if (response.data.ok) {
          $cookies.put('key', response.data.cookie.key)
          $cookies.put('id',  response.data.id)
          alert('User Created Successfully')
        } else {
          if (response.data.duplicate) {
            alert('Duplicate Username Exists')
          } else {
            alert('Incorrect Register Key')
          }
        }
        return response.data
      })
    },
    cookieAuth: function() {
      return $http({
        method:'get',
        url:host+'auth'
      }).then(function(response){
        return response.data
      })
    },
    userAuth: function() {
      return {ok:true}
    },
    update: function(data) {
      return {ok:true}
    },
    logout: function() {
      $cookies.remove('key')
      $cookies.remove('id')
      $state.go('login')
    }
  }
})
