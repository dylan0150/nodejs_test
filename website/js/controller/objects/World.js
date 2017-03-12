var World = function( canvas, refresh, seed ) {
  c              = canvas
  ctx            = c.getContext('2d')
  paused         = true
  cam = {
    x     : 0,
    y     : 0,
    speed : 3,
    lock  : false
  }

  var loop
  var time       = 0
  var frame      = 0
  var background = 'black'

  var environment = {
    length:0,
    forEach: function( _function, _class ) {
      for (var key in this) {
        var obj = this[key]
        if (obj.isentity) {
          if (_class == undefined) {
            _function(obj)
          } else if (obj.class == _class) {
            _function(obj)
          }
        }
      }
    }
  }
  this.add = function (object) {
    var n = environment.length++
    object['id'] = n
    environment[n] = object
  }
  this.remove = function(id) {
    if (typeof environment[id] != undefined) {
      delete environment[id]
    }
  }
  this.get = function(){
    return environment
  }

  var m = {
    l     : false,
    r     : false,
    x     : 0,
    y     : 0,
    sx    : 0,
    sy    : 0
  }

  var k = {
    up    : false,
    down  : false,
    left  : false,
    right : false,
    q     : false,
    w     : false,
    e     : false,
    r     : false,
    space : false
  }

  //EVENTS
  c.addEventListener('mousedown', function(e){
    e.preventDefault()
    if (e.button == 0) { m.l = true; m.sx = m.x; m.sy = m.y }
    if (e.button == 2) { m.r = true }
  })
  c.addEventListener('mouseup', function(e){
    e.preventDefault()
    if (e.button == 0) { m.l = false }
    if (e.button == 2) { m.r = false }
  })
  c.addEventListener('mousemove', function(e){
    m.x = e.clientX
    m.y = e.clientY
  })
  document.addEventListener('keydown', function(e){
    if (e.key == 'ArrowUp')     { k.up    = true }
    if (e.key == 'ArrowDown')   { k.down  = true }
    if (e.key == 'ArrowLeft')   { k.left  = true }
    if (e.key == 'ArrowRight')  { k.right = true }
    if (e.key == 'q')           { k.q     = true }
    if (e.key == 'w')           { k.w     = true }
    if (e.key == 'e')           { k.e     = true }
    if (e.key == 'r')           { k.r     = true }
    if (e.key == ' ')           { k.space = true }
  })
  document.addEventListener('keyup', function(e){
    if (e.key == 'ArrowUp')     { k.up    = false }
    if (e.key == 'ArrowDown')   { k.down  = false }
    if (e.key == 'ArrowLeft')   { k.left  = false }
    if (e.key == 'ArrowRight')  { k.right = false }
    if (e.key == 'q')           { k.q     = false }
    if (e.key == 'w')           { k.w     = false }
    if (e.key == 'e')           { k.e     = false }
    if (e.key == 'r')           { k.r     = false }
    if (e.key == ' ')           { k.space = false }
  })

  //LOOP
  var draw = function(){
    frame++
    drawBackground()
    environment.forEach(function(e){ e.show() })
    if (m.l) { drawSelect() }
    if (!paused) { window.requestAnimationFrame(draw) }
  }
  var update = function(){
    time++
    moveCamera()
    environment.forEach(function(e){ e.update() })
  }
  var drawBackground = function() {
    ctx.fillStyle = background
    ctx.fillRect(0,0,c.width,c.height)
  }
  var drawSelect = function() {
    ctx.strokeStyle = 'white'
    ctx.strokeRect(m.sx,m.sy,m.x-m.sx,m.y-m.sy)
  }
  var moveCamera = function() {
    if (!cam.lock) {
      if (k.up)     { cam.y -= cam.speed }
      if (k.down)   { cam.y += cam.speed }
      if (k.right)  { cam.x += cam.speed }
      if (k.left)   { cam.x -= cam.speed }
    }
  }
  this.start = function () {
    if (paused) {
      paused = false
      loop = setInterval(update,1000/refresh)
      draw()
    }
  }
  this.stop = function() {
    if (!paused) {
      paused = true
      clearInterval(loop)
    }
  }

  //PHYSICS
  this.collision = function(u) {
    var x = false
    var y = false
    environment.forEach(function(e){
      if ( u.id != e.id) {
        if ( u.dx > 0
          && u.x + u.width/2 <= e.x - e.width/2
          && u.x + u.width/2 + u.dx > e.x - e.width/2
          && u.y + u.height/2 > e.y - e.height/2
          && u.y - u.height/2 < e.y + e.height/2
        ) { x = true; u.x = e.x - u.width/2 }
        if ( u.dx < 0
          && u.x - u.width/2 >= e.x + e.width/2
          && u.x - u.width/2 + u.dx < e.x + e.width/2
          && u.y + u.height/2 > e.y - e.height/2
          && u.y - u.height/2 < e.y + e.height/2
        ) { x = true; u.x = e.x + e.width/2 }
        if ( u.dy > 0
          && u.y + u.height/2 <= e.y - e.height/2
          && u.y + u.height/2 + u.dy > e.y - e.height/2
          && u.x + u.width/2 > e.x - e.width/2
          && u.x - u.width/2 < e.x + e.width/2
        ) { y = true; u.y = e.y - u.height/2 }
        if ( u.dy < 0
          && u.y - u.height/2 >= e.y + e.height/2
          && u.y - u.height/2 + u.dy < e.y + e.height/2
          && u.x + u.width/2 > e.x - e.width/2
          && u.x - u.width/2 < e.x + e.width/2
        ) { y = true; u.y = e.y + e.height/2 }
        if (x || y) { u.collide(e) }
      }
    })
    return { x:x, y:y }
  }
}
