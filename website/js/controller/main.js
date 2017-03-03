window.onload = function() {

  physx = new PhysicsEngine(75,'canvas','black')

  physx.createForce(9.8,['mass'],0,[],'x') //x gravity
  physx.createForce(0,[],9.8,['mass'],'y') //y gravity
  physx.createForce(-0.1,['height','dx'],-0.1,['width','dy']) //air resistance

  physx.createMaterial('rubber',1,0.75,0.75,'orange')
  physx.createMaterial('steel',25,0.5,0.5,'grey')

  physx.createStaticRectangle(-5,780,810,25,'steel')
  physx.createStaticRectangle(-5,-5,810,25,'steel')
  physx.createStaticRectangle(-5,0,25,800,'steel')
  physx.createStaticRectangle(780,0,25,800,'steel') //bounds

  physx.createPlayer(50,50,12,'rubber') //player

}

var test = function() {
  console.log(physx)
  console.log(physx.getWindow())
  console.log(physx.getConstants())
  console.log(physx.getObjects())
  console.log(physx.getForces())
  console.log(physx.getMaterials())
  console.log("Physics Updates: " + physx.getTime())
  console.log("Frame Draws: "     + physx.getFrame())
}

var x_plus = function() {
  ct = physx.getConstants()
  physx.setConstant('x',ct.x+0.5)
  console.log(ct.x)
}
var x_minus = function() {
  ct = physx.getConstants()
  physx.setConstant('x',ct.x-0.5)
  console.log(ct.x)
}
var y_plus = function() {
  ct = physx.getConstants()
  physx.setConstant('y',ct.y+0.5)
  console.log(ct.y)
}
var y_minus = function() {
  ct = physx.getConstants()
  physx.setConstant('y',ct.y-0.5)
  console.log(ct.y)
}
var pause = function() {
  physx.pause()
}
var resume = function() {
  physx.resume()
}
