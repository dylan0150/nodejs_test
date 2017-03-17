app.directive('dirSave', function(){
  return {
    restrict:'E',
    templateUrl:'dirSave.html',
    scope:{
      save:'=save',
      index:'=index'
    },
    controller: function($scope){
      $scope.universe = $scope.save.universe
    }
  }
})
