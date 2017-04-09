app.factory('user', function($cookies,$state,$http,config){

  var host      = config.host
  var userdata  = { loggedin:false }

  return {
    login: function(username,password){
      return $http({
        method:'get',
        url:host+'login?username='+username+'&password='+password
      }).then(function(response){
        if (response.data.ok) {
          $state.go('main')
          $cookies.put('key', response.data.cookie.key)
          $cookies.put('id',  response.data.user.id)
        } else {
          alert('Details not recognised')
        }
      })
    },
    create: function(username, password, email) {
      var data = {
        username: username,
        password: password,
        email: email
      }
      return $http({
        method:'post',
        url:host+'register',
        data:data,
        json:true
      }).then(function(response){
        console.log(response)
        if (response.data.ok) {
          $cookies.put('key', response.data.cookie.key)
          $cookies.put('id',  response.data.id)
          alert('User Created Successfully')
          $state.go('main')
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
    logout: function() {
      $cookies.remove('key')
      $cookies.remove('id')
      $state.go('login')
    },
    get: function() {
      var id = $cookies.get('id')
      return $http({
        method:'get',
        url:host+'api/user?id='+id
      }).then(function(response){
        var user = response.data.user
        console.log(user)
        return user
      })
    }
  }
})
