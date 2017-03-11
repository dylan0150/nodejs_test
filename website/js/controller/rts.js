app.controller('rtsCtrl', function($scope) {

  $scope.paused = true

  $scope.stop = function() {
    if (!$scope.paused) {
      world.stop()
      $scope.paused = true
    }
  }
  $scope.start = function() {
    if ($scope.paused) {
      world.add({})
      world.start()
      $scope.paused = false
    }
  }

  var c = document.getElementById('canvas')
  var world = new World(c,60)
  var options = {
    x:50,
    y:50,
    width:150,
    height:150
  }
  new Unit(world,
    function(unit){
      unit.applyForce(0,0,0)
    },
    function(unit){
      console.log('I collided')
    },options)
  console.log(world.get())

})
