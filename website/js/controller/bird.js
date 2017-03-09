app.controller('birdCtrl',function($scope,$state,$interval){

  //=== SCOPE VARIABLES ===
  $scope.paused     = false
  $scope.game_over  = false

  //=== CONTROLS ===
  $scope.pause = function() {
    if (!$scope.paused && !$scope.game_over) {
      clearInterval(engine)
      $scope.paused = true
    }
  }
  $scope.resume = function() {
    if ($scope.paused && !$scope.game_over) {
      $scope.paused = false
      engine = setInterval(update,1000/refresh_rate)
      window.requestAnimationFrame(draw)
    }
  }
  $scope.gameover = function() {
    if (!$scope.game_over) {
      $scope.game_over = true;
      noclip = true;
      p.dy = -gravity*26
      p.animation = 'dead'
    }
  }
  $scope.restart = function() {
    if ($scope.game_over) {
      noclip = false;
      p.animation = 'fly'
      clearInterval(engine)
      p.y = c.height/2 - player_dimension/2
      p.dy = 0
      p.dx = 0
      terrain = []
      floor_height = 75
      for (var i = 0; i < c.width; i++) {
        var floor = new Floor(c.width-i,c.height-75,1,75)
        terrain.push(floor)
      }
      $scope.paused = false
      $scope.game_over = false
      distance = 0
      frame = 0
      engine = setInterval(update,1000/refresh_rate)
    }
  }

  //=== COLOURS ===
  var canvas_colour     = 'white';
  var cloud_colour      = 'darkgrey';
  var block_colour      = 'blue';
  var floor_colour      = 'green';

  //=== SETTINGS ===
  var block_chance      = 0.01;
  var cloud_chance      = 0.01;
  var terrain_scatter   = 0.05;
  var enable_hitbox     = false;
  var refresh_rate      = 60;
  var floor_height      = 75;
  var floor_ceil        = 150;
  var speed             = 2;
  var gravity           = 0.5;
  var air_resistance    = 0.96;
  var lift              = 3;
  var player_dimension  = 25;
  var cloud_gap         = 75;
  var block_gap         = 75;

  //=== VARIABLES ===
  var floor_up          = false;
  var floor_down        = false;
  var frame             = 0;
  var distance          = 0;
  var terrain           = [];
  var c_cloud_gap       = 0;
  var c_block_gap       = 0;
  var noclip            = false;

  var k = {
    space: false
  }

  //=== CLASSES ===
  var Player = function(x,y,width,height) {
    //BEGIN ANIMATION
      var fly_img     = new Image()
      var dead_img    = new Image()
      fly_img.src     = "img/flapper.png"
      dead_img.src    = "img/dead.png"
      this.animation  = 'fly'
      this.loop_frame = 1
      this.loop_speed = 5
      this.loop = {
        fly: {
          img:fly_img,
          frames:[
            [0,0],[1,0],[2,0],[3,0],[4,0],
            [0,1],[1,1],[2,1],[3,1],[4,1],
            [0,2],[1,2],[2,2],[3,2]
          ],
          width:912/5,
          height:506/3
        },
        dead: {
          img:dead_img,
          frames:[
            [0,0],[1,0],[2,0],[3,0],[4,0],
            [0,1],[1,1],[2,1],[3,1],[4,1],
            [0,2],[1,2],[2,2],[3,2]
          ],
          width:551/5,
          height:304/3
        }
      }
    //END ANIMATION
    this.x          = x
    this.y          = y
    this.dx         = 0
    this.dy         = 0
    this.width      = width
    this.height     = height
    this.imgwidth   = width*2
    this.imgheight  = height*2
  }
  var Floor = function(x,y,width,height) {
    this.type = 'floor'
    this.y = y
    this.x = x
    this.width = width
    this.height = height
    this.colour = floor_colour
  }
  var Block = function(x,y,width,height) {
    this.type = 'block'
    this.y = y
    this.x = x
    this.width = width
    this.height = height
    this.colour = block_colour
  }
  var Cloud = function(x,y,width,height) {
    this.type = 'cloud'
    this.y = y
    this.x = x
    this.width = width
    this.height = height
    this.colour = cloud_colour
  }

  //=== GAME LOOP ===
  var update = function() {
    if (!$scope.game_over) {
      distance++
      if (k.space) { applyLift() }
    }
    c_cloud_gap++
    c_block_gap++
    applyGravity()
    applyAirResistance()
    movePlayer()
    var h = floor_height
    if (floor_up && floor_height < floor_ceil) {
      floor_height += 1
    }
    if (floor_down && floor_height > 15) {
      floor_height -= 1
    }
    var n = Math.random()
    if (n < terrain_scatter) {
      if (floor_down) {
        floor_down = false
      } else {
        floor_up = true
      }
    }
    if (n > 1-terrain_scatter) {
      if (floor_up) {
        floor_up = false
      } else {
        floor_down = true
      }
    }
    var floor = new Floor(c.width,c.height-h,speed,h,'green')
    terrain.push(floor)
    var n = Math.random()
    if (n > 1-block_chance && c_block_gap > block_gap) {
      c_block_gap = 0
      var h = 70+floor_height+60*Math.random()
      var block = new Block(c.width,c.height-h,80,h-15,'blue')
      terrain.push(block)
    }
    if (n < cloud_chance && c_cloud_gap > cloud_gap) {
      c_cloud_gap = 0
      var h = 100+floor.height-15
      var block = new Cloud(c.width,Math.random()*c.height/4,80,45,'darkgrey')
      terrain.push(block)
    }
    moveFloor()
  }
  var draw = function() {
    frame++
    ctx.fillStyle = canvas_colour
    ctx.fillRect(0,0,c.width,c.height)
    drawPlayer();
    drawFloor();
    drawBlocks();
    drawClouds();
    drawText();
    if (!$scope.paused) {
      window.requestAnimationFrame(draw)
    }
  }

  //=== DRAWING ===
  var drawPlayer = function() {
    var frames = p.loop[p.animation].frames
    var lx = frames[p.loop_frame][0]
    var ly = frames[p.loop_frame][1]
    var lw = p.loop[p.animation].width
    var lh = p.loop[p.animation].height
    if (frame % p.loop_speed == 0) {
      if (p.loop_frame == frames.length - 1) {
        p.loop_frame = 0
      } else {
        p.loop_frame++
      }
    }
    ctx.drawImage(p.loop[p.animation].img,lx*lw,ly*lh,lw,lh,p.x-15,p.y-16,p.imgwidth,p.imgheight)
    if (enable_hitbox) {
      ctx.strokeStyle = 'black'
      ctx.strokeRect(p.x,p.y,p.width,p.height)
    }
  }
  var drawFloor = function() {
    for (var i = terrain.length-1; i > 0; i--) {
      var t = terrain[i]
      if (t.type == 'floor') {
        ctx.fillStyle = t.colour
        ctx.fillRect(t.x,t.y,t.width,c.height)
      }
    }
  }
  var drawBlocks =  function() {
    for (var i = terrain.length-1; i > 0; i--) {
      var t = terrain[i]
      if (t.type == 'block') {
        ctx.fillStyle = t.colour
        ctx.fillRect(t.x,t.y,t.width,t.height)
      }
    }
  }
  var drawClouds =  function() {
    for (var i = terrain.length-1; i > 0; i--) {
      var t = terrain[i]
      if (t.type == 'cloud') {
        ctx.fillStyle = t.colour
        ctx.fillRect(t.x,t.y,t.width,t.height)
      }
    }
  }
  var drawText = function() {
    if ($scope.game_over) {
      ctx.font = "36px Arial"
      ctx.fillStyle = 'red'
      ctx.strokeStyle = 'black'
      ctx.fillText('GAME OVER',c.width/2-124,c.height/2-18)
      ctx.strokeText('GAME OVER',c.width/2-124,c.height/2-18)
    }
    ctx.font = "15px Arial"
    ctx.fillStyle = 'black'
    ctx.fillText('Distance: ' + distance,5,c.height-20)
  }

  //=== PHYSICS ENGINE ===
  var applyGravity = function() {
    p.dy += gravity
  }
  var applyLift = function() {
    p.dy = -lift
  }
  var applyAirResistance = function() {
    p.dy *= air_resistance
  }
  var movePlayer = function() {
    if (!collision()) {
      p.y += p.dy
      p.x += p.dx
    } else (
      $scope.gameover()
    )
  }
  var moveFloor = function() {
    for (var i = terrain.length-1; i > 0;  i--) {
      terrain[i].x -= speed
      if (terrain[i].x < -terrain[i].width) {
        terrain.splice(i,1)
      }
    }
  }
  var collision = function() {
    var collide = false
    if (noclip) {
      return collide
    }
    for (var i = 0; i < terrain.length; i++) {
      var t = terrain[i]
      if (
            p.y >= t.y - p.height
        &&  p.y <= t.y + t.height
        &&  p.x + p.width >= t.x
        &&  p.x <= t.x + t.width
      ) {
        collide = true
      }
    }
    if (p.y < c.height
      &&  p.y + p.dy + p.height >= c.height
    ) {
      p.y = c.height - p.height
      collide = true
    }
    if (p.y > 0
      &&  p.y + p.dy < 0
    ) {
      p.y = 0
      collide = true
    }
    return collide
  }

  //=== EVENT LISTENERS ===
  document.addEventListener('keydown',function(e){
    if (e.key == ' ') {
      e.preventDefault()
      k.space = true
    }
  })
  document.addEventListener('keyup',function(e){
    if (e.key == ' ') {
      e.preventDefault()
      k.space = false
    }
  })

  //=== SETUP ===

  var c     = document.getElementById('canvas')
  var ctx   = c.getContext('2d')
  var p_d   = player_dimension
  var p     = new Player(25,c.height/2-p_d/2,p_d,p_d,'darkblue')
  for (var i = 0; i < c.width; i++) {
    var floor = new Floor(c.width-i,c.height-floor_height,1,floor_height)
    terrain.push(floor)
  }
  var engine = setInterval(update,1000/refresh_rate)
  window.requestAnimationFrame(draw)
})
