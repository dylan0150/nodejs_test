app.controller('universeCtrl', function($scope,$state,universeServe,getUniverse){
  $scope.state = $state
  console.log(getUniverse)

  var universe = new Universe(getUniverse)
})
