var Unit = function( world, options, logic, collide ) {
  this.class      = 'Unit'
  this.time       = 0
  this.collision  = true
  this.clip       = true
  this.isentity   = true
  this.width      = 1
  this.height     = 1
  this.x          = 0
  this.y          = 0
  this.r          = 0
  this.dx         = 0
  this.dy         = 0
  this.dr         = 1
  this.ddx        = 0
  this.ddy        = 0
  this.ddr        = 0
  for (var key in options) {
    this[key] = options[key]
  }
  if  ( typeof logic    != undefined ) { this.logic   = logic }
  if  ( typeof collide  != undefined ) { this.collide = collide }
  world.add(this)
}

Unit.prototype.show = function () {
  ctx.fillStyle = this.colour
  ctx.rotate(this.r*Math.PI/180)
  ctx.fillRect(this.x-cam.x-this.width/2,this.y-cam.y-this.height/2,this.width,this.height)
  ctx.rotate(-this.r*Math.PI/180)
};

Unit.prototype.update = function () {
  this.time++
  this.logic()
  this.dx += this.ddx
  this.ddx = 0
  this.dy += this.ddy
  this.ddy = 0
  this.dr += this.ddr
  this.ddr = 0
  this.r += this.dr
  if ( !this.collision ) { var c = { x:false, y:false, r:false } } else { var c = collison(this) }
  if (this.clip) {
    if (!c.x) { this.x += this.dx }
    if (!c.y) { this.y += this.dy }
  } else {
    this.x += this.dx
    this.y += this.dy
  }
};

Unit.prototype.applyForce = function (x,y,r) {
  this.ddx += x
  this.ddy += y
  this.ddr += r
};

Unit.prototype.collide = function () {

};

Unit.prototype.logic = function () {

};
