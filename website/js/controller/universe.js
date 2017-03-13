app.controller('universeCtrl', function($scope,$state,universeServe,getUniverse,$cookies,user){

  var c = document.getElementById('universe')

  $scope.universe = new Universe(getUniverse, user.get(), c)
  console.log($scope)

  $scope.state = $state

  $scope.save = function() {
    getUniverse.save(universe,$state.params.universe_id)
  }
})
