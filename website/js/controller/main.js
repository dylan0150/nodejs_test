window.onload = function() {

  var frame_rate = 60;
  var c = document.getElementById('canvas')
  var cc = c.getContext('2d')
  var time = 0
  var n = 1

  var objects   = []
  var forces    = []
  var materials = []

  var update = function(){
    time++
    cc.fillStyle = "black";
    cc.fillRect(0,0,c.width,c.height);
    applyForces();
    moveObjects();
    drawObjects();
  }

  var drawObjects = function() {
    for (var i = 0; i < objects.length; i++) {
      var obj = objects[i]
      cc.fillStyle = "white";
      cc.fillRect(obj.x,obj.y,obj.width,obj.height);
    }
  }

  var applyForces = function() {
    for (var i = 0; i < forces.length; i++) {
      var f = forces[i]
      for (var j = 0; j < objects.length; j++) {
        var obj = objects[j]
        if (f.x*frame_rate != 1 && obj[f.x_factor] != undefined) {
          obj.dx += ((f.x * obj[f.x_factor]) / obj.mass)
        }
        if (f.y*frame_rate != 1 && obj[f.y_factor] != undefined) {
          obj.dy += ((f.y * obj[f.y_factor]) / obj.mass)
        }

      }
    }
  }

  var applyForces2 = function() {
    for (var i = 0; i < forces.length; i++) {
      var f = forces[i]
      for (var j = 0; j < objects.length; j++) {
        var obj = objects[j]
        var x_apply = []
        var y_apply = []
        for (var k = 0; k < f.x_factor.length; k++) {
          if (f.x*frame_rate != 1 && obj[f.x_factor[k]] != undefined) {
            x_apply.push(obj[f.x_factor[k]])
          }
        }
        if (x_apply.length > 0) {
          var delta_x = f.x
          for (var k = 0; k < x_apply.length; k++) {
            delta_x = delta_x*obj[x_apply[k]]
          }
          obj.dx += delta_x / obj.mass
        }
        for (var k = 0; k < f.y_factor.length; k++) {
          if (f.y*frame_rate != 1 && obj[f.y_factor[k]] != undefined) {
            y_apply.push(obj[f.y_factor[k]])
          }
        }
        if (y_apply.length > 0) {
          var delta_y = f.y
          for (var k = 0; k < y_apply.length; k++) {
            delta_y = delta_y*obj[y_apply[k]]
          }
          obj.dy += delta_y / obj.mass
        }
      }
    }
  }

  var moveObjects = function() {
    applyConstraints();
    for (var i = 0; i < objects.length; i++) {
      var obj = objects[i]
      obj.x += obj.dx;
      obj.y += obj.dy;
    }
  }

  var applyConstraints = function() {
    for (var i = 0; i < objects.length; i++) {
      var obj = objects[i]
      if (obj.x < 0)                        { wall_bounce(edge_l, obj, 'x') }
      if ((obj.x + obj.width) > c.width)    { wall_bounce(obj, edge_r, 'x') }
      if ((obj.y + obj.height) > c.height)  { wall_bounce(obj, floor,  'y') }
    }
  };

  var Object = function(x,y,height,width,material) {
    this.id = n++
    this.x = x;
    this.y = y;
    this.dx = 5;
    this.dy = 0;
    this.height = height;
    this.width = width;
    this.mass = 1;
    this.bounce = 1;
    this.friction = 1;

    for (var i = 0; i < materials.length; i++) {
      if (materials[i].name == material) {
        this.mass     = materials[i].density*this.height*this.width
        this.bounce   = materials[i].bounce
        this.friction = materials[i].friction
        this.structure = materials[i].structure
      }
    }
  }

  var wall_bounce = function(obj1, obj2, direction) {
    if (direction == 'x') {
      obj1.x = obj2.x - obj1.width
      obj1.dx = 0 - (obj1.dx * obj1.bounce * obj2.bounce)
      obj1.dy = obj1.dy * obj1.friction * obj2.friction
      obj2.dx = 0 - (obj2.dx * obj2.bounce * obj1.bounce)
      obj2.dy = obj2.dy * obj2.friction * obj1.friction
    }
    if (direction == 'y') {
      obj1.y = obj2.y - obj1.height
      obj1.dy = 0 - (obj1.dy * obj1.bounce * obj2.bounce)
      obj1.dx = obj1.dx * obj1.friction * obj2.friction
      obj2.dy = 0 - (obj2.dy * obj2.bounce * obj1.bounce)
      obj2.dx = obj2.dx * obj2.friction * obj1.friction
    }
  }

  var bounce = function(obj1, obj2) {

  }

  var Force = function(x,x_factor,y,y_factor) {
    this.x = x/frame_rate;
    this.y = y/frame_rate;
    this.x_factor = x_factor;
    this.y_factor = y_factor;
  }

  var Material = function(name,density,friction,bounce,strength,toughness) {
    this.name       = name;
    this.density    = density;
    this.friction   = friction;
    this.bounce     = bounce;
    this.strength   = strength;
    this.toughness  = toughness;
  }

  //WORLD CREATION
  var edge_l = {
    bounce: 0.99,
    friction: 0.99,
    x:0,
    y:0,
    dx:0,
    dy:0
  };
  var edge_r = {
    bounce: 0.99,
    friction: 0.99,
    x:c.width,
    y:0,
    dx:0,
    dy:0
  };
  var floor = {
    bounce: 0.99,
    friction: 0.99,
    x:0,
    y:c.height,
    dx:0,
    dy:0
  };

  //MATERIAL CREATION
  var rubber = new Material('rubber',1,0.95,0.9,0.5,0.9)
  var metal = new Material('metal',25,0.4,0.25,0.9,0.8)
  materials.push(rubber)
  materials.push(metal)

  //FORCES CREATION
  var gravity = new Force(0,'',9.8,'mass')
  var air_resistance = new Force(-0.1,'dx',-0.1,'dy')
  forces.push(air_resistance)
  forces.push(gravity)

  //OBJECT CREATION
  var ball = new Object(5,5,10,10,'rubber')
  var plate = new Object(150,150,5,50,'metal')
  objects.push(ball)
  objects.push(plate)

  setInterval(update,1000/frame_rate)
}
