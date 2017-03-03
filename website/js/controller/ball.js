app.controller('ballCtrl', function($scope,$state,$interval) {

  $scope.physx = new PhysicsEngine(75,'canvas','black')

  $scope.physx.createForce(9.8,['mass'],0,[],'x') //x gravity
  $scope.physx.createForce(0,[],9.8,['mass'],'y') //y gravity
  $scope.physx.createForce(-0.1,['height','dx'],-0.1,['width','dy']) //air resistance

  $scope.physx.createMaterial('rubber',1,0.75,0.75,'orange')
  $scope.physx.createMaterial('steel',25,0.5,0.5,'grey')

  $scope.physx.createStaticRectangle(-5,780,810,25,'steel')
  $scope.physx.createStaticRectangle(-5,-5,810,25,'steel')
  $scope.physx.createStaticRectangle(-5,0,25,800,'steel')
  $scope.physx.createStaticRectangle(780,0,25,800,'steel') //bounds

  $scope.physx.createPlayer(50,50,12,'rubber') //player

  $scope.test = function() {
    console.log($scope.physx)
    console.log($scope.physx.getWindow())
    console.log($scope.physx.getConstants())
    console.log($scope.physx.getObjects())
    console.log($scope.physx.getForces())
    console.log($scope.physx.getMaterials())
    console.log("Physics Updates: " + $scope.physx.getTime())
    console.log("Frame Draws: "     + $scope.physx.getFrame())
    console.log("Current FPS: "     + $scope.physx.getFPS())
    console.log("Average FPS: "     + $scope.physx.getAverageFPS())
  }
  $scope.x_plus = function() {
    ct = $scope.physx.getConstants()
    $scope.physx.setConstant('x',ct.x+0.5)
    console.log(ct.x)
  }
  $scope.x_minus = function() {
    ct = $scope.physx.getConstants()
    $scope.physx.setConstant('x',ct.x-0.5)
    console.log(ct.x)
  }
  $scope.y_plus = function() {
    ct = $scope.physx.getConstants()
    $scope.physx.setConstant('y',ct.y+0.5)
    console.log(ct.y)
  }
  $scope.y_minus = function() {
    ct = $scope.physx.getConstants()
    $scope.physx.setConstant('y',ct.y-0.5)
    console.log(ct.y)
  }
  $scope.pause = function() {
    $scope.physx.pause()
  }
  $scope.resume = function() {
    $scope.physx.resume()
  }

});
