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

  //OBJECTS
  var m = {
    l     : false,
    r     : false,
    x     : 0,
    y     : 0
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
    if (e.button == 0) { m.l = true }
    if (e.button == 2) { m.r = true }
  })
  c.addEventListener('mouseup', function(e){
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
      if (type == terrainTypes[i].name) {this.type == terrainTypes[i]}
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
  var Unit = function(type,x,y,width,height) {
    this.class = 'Unit'
    this.id = n++
    this.x = x
    this.y = y
    this.dx = 1
    this.dy = 1
    this.width = width
    this.height = height
    this.type = { name: 'null', colour: 'white', density: 1 }
    for (var i = 0; i < unit_types.length; i++) {
      if (type == unit_types[i].name) {this.type == unit_types[i]}
    }
    this.mass = width * height * this.type.density
    units.push(this)
  }
  var UnitType = function(name,colour,density) {
    this.class = 'UnitType'
    this.id = n++
    this.name = name
    this.colour = colour
    this.density = density
    unit_types.push(this)
  }

  //LOOP
  var draw = function(){
    frame++
    drawBackground()
    drawTerrain()
    drawUnits()
    if (!$scope.paused) { window.requestAnimationFrame(draw) }
  }
  var update = function(){
    time++
    moveCamera()
    moveUnits()
  }
  var start = function(){
    loop = $interval(update,1000/refresh)
    draw()
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
      if( !collision_x(u,terrain) && !collision_x(u,units) ) { u.x += u.dx }
      if( !collision_y(u,terrain) && !collision_y(u,units) ) { u.y += u.dy }
    }
  }
  var collision_x = function(u,array) {
    var collide = false
    for (var i = 0; i < array.length; i++) {
      var t = array[i]
      if ( u.x > 0
        && u.x + u.width < t.x
        && u.x + u.dx + u.width >= t.x
        && u.y <= t.y + t.height
        && u.y + u.height >= t.y
      ) {
        collide = true
        event_Collision(u,t,'x+')
      }
      if ( u.x < 0
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
      if ( u.y > 0
        && u.y + u.height < t.y
        && u.y + u.dy + u.height >= t.y
        && u.x <= t.x + t.width
        && u.x + u.width >= t.x
      ) {
        collide = true
        event_Collision(u,t,'y+')
      }
      if ( u.y < 0
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
  }

  start()

})
