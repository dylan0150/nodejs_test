app.controller('mainCtrl', function($scope,$state,user,info,userdata) {

  $scope.user = userdata
  info.store('user',userdata)

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

  $scope.saves = [
    {
      time: 3,
      created: new Date(Date.now()),
      universe: {
        name: 'test'
      }
    }
  ]

  $scope.turn = 0

  $scope.logout = function() {
    user.logout()
  }
})
