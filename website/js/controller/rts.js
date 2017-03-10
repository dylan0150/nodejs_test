app.controller('rtsCtrl', function($scope,$interval) {

  //CANVAS
  var c = document.getElementById('rts')
  var ctx = c.getContext('2d')

  //CONTROLS
  $scope.resume = function() {
    if ($scope.paused) {
      $scope.paused = false
      start()
    }
  }
  $scope.pause = function() {
    if (!$scope.paused) {
      $scope.paused = true
      stop()
    }
  }
  $scope.spawnAlly = function() {
    new Unit('fighter',10,10,6,14,true,0)
  }
  $scope.spawnEnemy = function() {
    new Unit('fighter',10,10,6,14,true,1)
  }

  //SCOPE
  $scope.paused = false

  //SETTINGS
  var refresh = 60
  var background = 'black'

  //VARIABLES
  var time = 0
  var frame = 0
  var loop
  var n = 0
  var terrain = []
  var terrai_types = []
  var units = []
  var unit_types = []
  var selected_units = []

  //OBJECTS
  var m = {
    l     : false,
    r     : false,
    x     : 0,
    y     : 0,
    sx    : 0,
    sy    : 0,
    select: function() {
      selected_units = []
      if (m.sx < m.x) {x = m.sx; x2 = m.x } else { x = m.x; x2 = m.sx }
      if (m.sy < m.y) {y = m.sy; y2 = m.y } else { y = m.y; y2 = m.sy }
      for (var i = 0; i < units.length; i++) {
        var u = units[i]
        if ( x + cam.x <= u.x + u.width
          && x2 + cam.x >= u.x
          && y + cam.y <= u.y + u.height
          && y2 + cam.y >= u.y
        ) { u.select() } else { u.deselect() }
      }
    },
    target: function() {
      var x = m.x + cam.x
      var y = m.y + cam.y
      var n = 0
      var nx = 0
      var ny = 0
      var l = selected_units.length
      var d = Math.ceil(Math.sqrt(l))
      var gap = 1
      var on_target = false
      var target_id = 0
      for (var i = 0; i < selected_units.length; i++) {
        var u = selected_units[i]
        if (u.width > gap)  { gap = u.width }
        if (u.height > gap) { gap = u.height }
      }
      for (var i = 0; i < units.length; i++) {
        var u = units[i]
        if ( x + cam.x <= u.x + u.width
          && x + cam.x >= u.x
          && y + cam.y <= u.y + u.height
          && y + cam.y >= u.y
        ) { on_target = true; target_id = u.id }
      }
      for (var i = 0; i < terrain.length; i++) {
        var u = terrain[i]
        if ( x + cam.x <= u.x + u.width
          && x + cam.x >= u.x
          && y + cam.y <= u.y + u.height
          && y + cam.y >= u.y
        ) { on_target = true; target_id = u.id }
      }
      gap += 5
      for (var i = 0; i < units.length; i++) {
        var u = units[i]
        if (u.selected) {
          u.target.x = x + nx*gap
          u.target.y = y + ny*gap
          if (on_target) {
            u.setSeek.seeking = true
            u.setSeek.target = target_id
          } else {
            u.setSeek.seeking = false
          }
          if (nx == d-1) {
            nx = 0
            ny++
          } else {
            nx++
          }
        }
      }
    }
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
  var cam = {
    x     : 0,
    y     : 0,
    speed : 3,
    lock  : false
  }

  //EVENTLISTENERS
  c.addEventListener('mousedown', function(e){
    e.preventDefault()
    if (e.button == 0) { m.l = true; m.sx = m.x; m.sy = m.y }
    if (e.button == 2) { m.r = true; m.target() }
  })
  c.addEventListener('mouseup', function(e){
    e.preventDefault()
    if (e.button == 0) { m.l = false; m.select() }
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

  //CLASSES
  var Terrain = function(type,x,y,width,height) {
    this.class = 'Terrain'
    this.id = n++
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.type = { name: 'null', colour: 'white', passable: 0 }
    for (var i = 0; i < terrainTypes.length; i++) {
      if (type == terrainTypes[i].name) {this.type = terrainTypes[i]}
    }
    terrain.push(this)
  }
  var TerrainType = function(name,colour) {
    this.class = 'TerrainType'
    this.id = n++
    this.name = name
    this.colour = colour
    terrain_types.push(this)
  }
  var Unit = function(type,x,y,width,height,control,allegiance) {
    this.ai = 0
    this.allegiance = allegiance
    this.controllable = control
    this.selected = false
    this.class = 'Unit'
    this.target = {
      x: x,
      y: y
    }
    this.setSeek = {
      target: 0,
      seeking: false
    }
    this.id = n++
    this.x = x
    this.y = y
    this.dx = 15
    this.dy = 5
    this.ddx = 0
    this.ddy = 0
    this.width = width
    this.height = height
    this.type = { name: 'null', colour: 'white', density: 1, speed: 6, acceleration: 1, range: 100, attacks:[] }
    for (var i = 0; i < unit_types.length; i++) {
      if (type == unit_types[i].name) {this.type = unit_types[i]}
    }
    this.mass = width * height * this.type.density
    this.accelerate = function() {
      this.dx += this.ddx
      this.dy += this.ddy
      this.ddx = 0
      this.ddy = 0
    }
    this.steer = function() {
      var dx = this.target.x - this.x
      var dy = this.target.y - this.y
      if (dy*dy < 0.1 && dx*dx < 0.1) {
        this.ddx += -this.dx
        this.ddy += -this.dy
      } else {
        var dm = getMag(dx,dy)
        var c = this.type.speed
        dx = (dx/dm)*c
        dy = (dy/dm)*c
        var ddx = dx - this.dx
        var ddy = dy - this.dy
        var ddm = getMag(dx,dy)
        var a = this.type.acceleration
        ddx = (ddx/ddm)*a
        ddy = (ddy/ddm)*a
        this.ddx += ddx
        this.ddy += ddy
      }
    }
    this.seek = function() {
      for (var i = 0; i < units.length; i++) {
        var u = units[i]
        if (u.id == this.setSeek.target) {
          this.target.x = u.x
          this.target.y = u.y
          if (getMag(u.x - this.x,u.y - this.y) < this.type.range) {
            this.target.x = this.x
            this.target.y = this.y
          }
        }
      }
    }
    this.spawn = function(u,w,h,t) {
      var unit = new Unit(u,this.x+this.width,this.y+this.height,w,h,false,this.allegiance)
      unit.setSeek.target = t.id
      unit.setSeek.seeking = true
    }
    this.logic = function(){
      this.ai++
      if (this.ai % 100 == 0) {
        for (var i = 0; i < units.length; i++) {
          var u = units[i]
          if ( u.allegiance != this.allegiance && getMag(u.x - u.width - this.x,u.y - u.height - this.y) < this.type.range ) {
            this.spawn('missile',2,4,u)
          }
        }
      }
    }
    this.select = function()    { if (this.controllable) { this.selected = true; selected_units.push(this) } }
    this.deselect = function()  { this.selected = false }
    units.push(this)
  }
  var UnitType = function(name,colour,density,speed,acceleration,range) {
    this.class = 'UnitType'
    this.id = n++
    this.name = name
    this.colour = colour
    this.density = density
    this.speed = speed
    this.acceleration = acceleration
    this.range = range
    unit_types.push(this)
  }

  //LOOP
  var draw = function(){
    frame++
    drawBackground()
    drawTerrain()
    drawUnits()
    if (m.l) {drawSelect()}
    if (!$scope.paused) { window.requestAnimationFrame(draw) }
  }
  var update = function(){
    time++
    moveCamera()
    moveUnits()
    for (var i = 0; i < units.length; i++) {
      if (units[i].type.name == 'fighter') { units[i].logic() }
    }
  }
  var start = function(){
    loop = $interval(update,1000/refresh)
    draw()
    new UnitType('fighter','white',1,5,0.5,25)
    new UnitType('missile','white',1,12,0.2,0)
  }
  var stop = function(){
    $interval.cancel(loop)
  }

  //DRAW
  var drawBackground = function() {
    ctx.fillStyle = background
    ctx.fillRect(0,0,c.width,c.height)
  }
  var drawTerrain = function() {
    for (var i = 0; i < terrain.length; i++) {
      var t = terrain[i]
      ctx.fillStyle = t.type.colour
      ctx.fillRect(t.x-cam.x,t.y-cam.y,t.width,t.height)
    }
  }
  var drawUnits = function() {
    for (var i = 0; i < units.length; i++) {
      var u = units[i]
      ctx.fillStyle = u.type.colour
      ctx.fillRect(u.x-cam.x,u.y-cam.y,u.width,u.height)
    }
  }
  var drawSelect = function() {
    ctx.strokeStyle = 'white'
    ctx.strokeRect(m.sx,m.sy,m.x-m.sx,m.y-m.sy)
  }

  //UPDATE
  var moveCamera = function() {
    if (!cam.lock) {
      if (k.up)     { cam.y -= cam.speed }
      if (k.down)   { cam.y += cam.speed }
      if (k.right)  { cam.x += cam.speed }
      if (k.left)   { cam.x -= cam.speed }
    }
  }
  var moveUnits = function() {
    for (var i = 0; i < units.length; i++) {
      var u = units[i]
      if ( u.setSeek.seeking ) { u.seek() }
      u.steer()
      u.accelerate()
      if( !collision_x(u,terrain) && !collision_x(u,units) ) { u.x += u.dx }
      if( !collision_y(u,terrain) && !collision_y(u,units) ) { u.y += u.dy }
    }
  }
  var collision_x = function(u,array) {
    var collide = false
    for (var i = 0; i < array.length; i++) {
      var t = array[i]
      if ( u.dx > 0
        && u.id != t.id
        && u.x + u.width < t.x
        && u.x + u.dx + u.width >= t.x
        && u.y <= t.y + t.height
        && u.y + u.height >= t.y
      ) {
        collide = true
        event_Collision(u,t,'x+')
      }
      if ( u.dx < 0
        && u.id != t.id
        && u.x > t.x + t.width
        && u.x + u.dx <= t.x + t.width
        && u.y <= t.y + t.height
        && u.y + u.height >= t.y
      ) {
        collide = true
        event_Collision(u,t,'x-')
      }
    }
    return collide
  }
  var collision_y = function(u,array) {
    var collide = false
    for (var i = 0; i < array.length; i++) {
      var t = array[i]
      if ( u.dy > 0
        && u.id != t.id
        && u.y + u.height < t.y
        && u.y + u.dy + u.height >= t.y
        && u.x <= t.x + t.width
        && u.x + u.width >= t.x
      ) {
        collide = true
        event_Collision(u,t,'y+')
      }
      if ( u.dy < 0
        && u.id != t.id
        && u.y > t.y + t.height
        && u.y + u.dy <= t.y + t.height
        && u.x <= t.x + t.width
        && u.x + u.width >= t.x
      ) {
        collide = true
        event_Collision(u,t,'y-')
      }
    }
    return collide
  }
  var getMag = function(x,y) {
    var mag = Math.sqrt((x*x)+(y*y))
    return mag
  }

  //EVENTS
  event_Collision = function(u,u2,direction) {
    if (u.class == 'Unit' && u2.class == 'Terrain') {
      if (u2.type.passable == 0) {
        if (direction == 'x+') {u.x = u2.x - u.width}
        if (direction == 'x-') {u.x = u2.x + u2.width}
        if (direction == 'y+') {u.y = u2.y - u.height}
        if (direction == 'y-') {u.y = u2.y + u2.height}
      } else {
        if (direction == 'x+' || direction == 'x-') {u.dx *= u2.type.passable; u.x += u.dx }
        if (direction == 'y+' || direction == 'y-') {u.dy *= u2.type.passable; u.y += u.dy }
      }
    }
    if (u.class == 'Unit' && u2.class == 'Unit' && u.type.name == 'missile') {
      for (var i = units.length-1; i >= 0; i--) {
        if (u.id == units[i].id) {
          units.splice(i,1)
        }
      }
    }
  }

  start()

})
