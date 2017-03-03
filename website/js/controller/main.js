app.controller('mainCtrl',function($scope,$state){
  $scope.goToBall = function() {
    $state.go('ball')
  }
})
