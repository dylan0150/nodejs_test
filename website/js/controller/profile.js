app.controller('profileCtrl', function($scope,user){
  $scope.login = function(){
    user.login('user','pass')
  }
  $scope.register = function(){
    user.create('user','pass')
  }
})
