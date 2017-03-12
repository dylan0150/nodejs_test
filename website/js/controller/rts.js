app.controller('rtsCtrl', function($scope,$state){

  $scope.getMain = function() {
    return $state.current.name == 'rts'
  }

  var universe_id = 1

  $scope.openUniverse = function() {
    $scope.is_main = false
    $state.go('rts.universe', {universe_id:universe_id})
  }
})
