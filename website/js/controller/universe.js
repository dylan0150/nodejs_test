app.controller('universeCtrl', function($scope,$state,universeServe,getUniverse,$cookies){
  $scope.state = $state
  console.log(getUniverse)

  var universe = new Universe(getUniverse)
  console.log(universe)

  $scope.save = function() {
    getUniverse.save(universe,$state.params.universe_id)
  }
})
