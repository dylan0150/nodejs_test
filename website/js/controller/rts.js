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
  var terrainTypes = []

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
    speed : 1,
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
    this.id = n++
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.type = { name: 'null', colour: 'white' }
    for (var i = 0; i < terrainTypes.length; i++) {
      if (type == terrainTypes[i].name) {this.type == terrainTypes[i]}
    }
    terrain.push(this)
  }
  var TerrainType = function(name,colour) {
    this.name = name
    this.colour = colour
    terrainTypes.push(this)
  }

  //LOOP
  var draw = function(){
    frame++
    drawBackground()
    drawTerrain()
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
  var drawTerrain = function() {
    for (var i = 0; i < terrain.length; i++) {
      var t = terrain[i]
      ctx.fillStyle = t.colour
      ctx.fillRect(t.x,t.y,t.width,t.height)
    }
  }

  //UPDATE
  var moveCamera = function() {
    if (!cam.lock) {
      if (k.up)     { cam.y += cam.speed }
      if (k.down)   { cam.y -= cam.speed }
      if (k.right)  { cam.x += cam.speed }
      if (k.left)   { cam.x -= cam.speed }
    }
  }

  start()

})
