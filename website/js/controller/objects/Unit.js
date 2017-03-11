var Unit = function( world, logic, collide, options ) {
  this.animation  = { empty:true, current:'null' }
  this.image      = ""
  if (this.image != "") {
    this.img      = new Image()
    this.img.src  = this.image
  }
  this.class      = 'Unit'
  this.colour     = 'white'
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
  this.dr         = 0
  this.ddx        = 0
  this.ddy        = 0
  this.ddr        = 0
  for (var key in options) {
    this[key] = options[key]
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

  this.update = function () {
    this.time++
    if (typeof logic == 'function') { logic(this) }
    this.dx += this.ddx
    this.ddx = 0
    this.dy += this.ddy
    this.ddy = 0
    this.dr += this.ddr
    this.ddr = 0
    this.r += this.dr
    while (this.r >= 360) { this.r -= 360 }
    while (this.r < 0)    { this.r += 360 }
    if ( !this.collision ) { var c = { x:false, y:false, r:false } } else { var c = world.collision(this) }
    if (this.clip) {
      if (!c.x) { this.x += this.dx }
      if (!c.y) { this.y += this.dy }
    } else {
      this.x += this.dx
      this.y += this.dy
    }
  }

  this.applyForce = function (x,y,r) {
    this.ddx += x
    this.ddy += y
    this.ddr += r
  }

  world.add(this)
}
