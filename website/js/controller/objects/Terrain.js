var Terrain = function( world, logic, collide, options ) {
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
  this.update = function () {
    this.time++
    if (typeof logic == 'function') { logic(this) }
  };
  this.show = function () {
    ctx.fillStyle = this.colour
    ctx.fillRect(this.x-cam.x-this.width/2,this.y-cam.y-this.height/2,this.width,this.height)
  };
  world.add(this)
};
