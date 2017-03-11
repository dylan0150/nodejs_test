var Terrain = function( world, options, logic, collide ) {
  this.class      = 'Terrain'
  this.time       = 0
  this.collision  = true
  this.clip       = true
  this.isentity   = true
  this.x          = 0
  this.y          = 0
  this.r          = 0
  this.width      = 1
  this.height     = 1
  for (var key in options) {
    this[key] = options[key]
  }
  if  ( typeof logic    != undefined ) { this.logic   = logic }
  if  ( typeof collide  != undefined ) { this.collide = collide }
  world.add(this)
};

Terrain.prototype.show = function () {
  ctx.fillStyle = this.colour
  ctx.rotate(this.r*Math.PI/180)
  ctx.fillRect(this.x-cam.x-this.width/2,this.y-cam.y-this.height/2,this.width,this.height)
  ctx.rotate(-this.r*Math.PI/180)
};

Terrain.prototype.update = function () {
  this.time++
  this.logic()
};

Terrain.prototype.collide = function () {

};

Terrain.prototype.logic = function () {
  
};
