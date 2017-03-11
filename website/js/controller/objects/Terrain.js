var Terrain = function( world, logic, collide, options ) {
  this.animation  = { empty:true, current:'null' }
  this.image      = ""
  if (this.image != "") {
    this.img      = new Image()
    this.img.src  = this.image
  }
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
  }
  this.show = function () {
    if (!this.animation.empty) {
      var a = this.animation[this.animation.current]
      if (this.time % a.speed == 0)   { a.step++ }
      if (a.step >= a.frames.length)  { a.step = 0 }
      var lx = a.frames[a.step][0]
      var ly = a.frames[a.step][1]
      ctx.drawImage(a.img,lx*a.w,ly*a.h,a.w,a.h,this.x-cam.x-this.width/2,this.y-cam.y-this.height/2,this.width,this.height)
    } else if (this.image != "") {
      ctx.drawImage(this.img,this.x-cam.x-this.width/2,this.y-cam.y-this.height/2,this.width,this.height)
    } else {
      ctx.fillStyle = this.colour
      ctx.fillRect(this.x-cam.x-this.width/2,this.y-cam.y-this.height/2,this.width,this.height)
    }
  }
  world.add(this)
};
