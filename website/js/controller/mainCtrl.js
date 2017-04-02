app.controller('mainCtrl', function($scope, $state, user) {

  $scope.logout = function() {
    user.logout()
  }
  
})
