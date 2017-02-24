window.onload = function() {

  physx = new PhysicsEngine(120,'canvas','black')

  physx.createForce(9.8,['mass'],0,[],'x')
  physx.createForce(0,[],9.8,['mass'],'y')
  physx.createForce(-0.1,['height','dx'],-0.1,['width','dy'])

  physx.createMaterial('rubber',1,0.75,0.75,'orange')
  physx.createMaterial('steel',25,0.5,0.5,'grey')

  physx.createStaticRectangle(0,780,800,25,'steel')
  physx.createStaticRectangle(0,-5,800,25,'steel')
  physx.createStaticRectangle(-5,0,25,800,'steel')
  physx.createStaticRectangle(780,0,25,800,'steel')

  physx.createCircle(50,50,5,'rubber')

}

var test = function() {
  console.log(physx)
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