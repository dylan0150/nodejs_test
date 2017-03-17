app.controller('mainCtrl', function($scope,$state,user,info){

  $scope.stats = [
    {
      label:'Example',
      value:1
    },
    {
      label:'Example',
      value:123
    },
    {
      label:'Example',
      value:76
    },
  ]

  $scope.turn = 0

  $scope.logout = function() {
    user.logout()
  }
})
