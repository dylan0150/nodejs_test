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

  //OBJECTS
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
    if (e.button == 2) { m.r = true; }
  })
  c.addEventListener('mouseup', function(e){
    e.preventDefault()
    if (e.button == 0) { m.l = false; }
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


  //LOOP
  var draw = function(){
    frame++
    drawBackground()
    if (m.l) {drawSelect()}
    if (!$scope.paused) { window.requestAnimationFrame(draw) }
  }
  var update = function(){
    time++
    moveCamera()
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
      }
      if ( u.dx < 0
        && u.id != t.id
        && u.x > t.x + t.width
        && u.x + u.dx <= t.x + t.width
        && u.y <= t.y + t.height
        && u.y + u.height >= t.y
      ) {
        collide = true
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
      }
      if ( u.dy < 0
        && u.id != t.id
        && u.y > t.y + t.height
        && u.y + u.dy <= t.y + t.height
        && u.x <= t.x + t.width
        && u.x + u.width >= t.x
      ) {
        collide = true
      }
    }
    return collide
  }

  //EVENTS

  start()

})
