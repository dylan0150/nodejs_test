app.controller('rtsCtrl', function($scope,$state,user,universeServe,$timeout){

  $scope.form = {}
  $scope.getMain = function() {
    return $state.current.name == 'rts'
  }
  $scope.goToProfile = function() {
    $state.go('profile')
  }
  $scope.user = user.get()

  $scope.createUniverse = function() {
    universeServe.create().then(function(response){
      universeServe.getAll().then(function(response){
        $scope.user.universes = response.universes
      })
    })
  }

  $scope.selectUniverse = function() {
    var id = $scope.form.universe_form.selected_universe
    if (typeof id != 'undefined') {
      $state.go('rts.universe',{universe_id:id})
    } else {
      alert('Please select a universe')
    }
  }
})
