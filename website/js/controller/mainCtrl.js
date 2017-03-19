app.controller('mainCtrl', function($scope,$state,user,info,userdata,universe) {

  $scope.user = userdata
  $scope.saves = userdata.universes

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

  $scope.createUniverse = function() {
    var name = prompt('Name of your universe?')
    universe.create(name).then(function(response){
      $scope.saves.push({universe:response})
    })
  }
})
