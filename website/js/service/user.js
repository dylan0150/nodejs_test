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
      })
    },
    create: function(username,password) {
      if (typeof data == 'undefined') {
        var data = {}
      }
      data.username = username
      data.password = password
      data.key = 'plsregistermekthnxbye'
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
        } else {
          if (response.data.duplicate) {
            alert('Duplicate Username Exists')
          } else {
            alert('Incorrect Register Key')
          }
        }
      })
    },
    cookieAuth: function() {
      return {ok:true}
    },
    userAuth: function() {
      return {ok:true}
    },
    update: function(data) {
      return {ok:true}
    }
  }
})
