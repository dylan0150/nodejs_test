app.controller('universeCtrl', function($scope,$state,universeServe,getUniverse,$cookies){
  $scope.state = $state
  var universe = new Universe(getUniverse.universe)
  console.log(universe)

  $scope.save = function() {
    getUniverse.save(universe,$state.params.universe_id)
  }
})
