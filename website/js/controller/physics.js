var PhysicsEngine = function(refresh_rate,canvas_name,canvas_colour) {

  //VARIABLES
  var time      = 0
  var objects   = []
  var forces    = []
  var materials = []
  var n         = 0
  var c         = document.getElementById('canvas')
  var cc        = c.getContext('2d')
  var paused    = false

  var constants = {
     x  :0,
     y  :0
  }

  //ACCESSOR FUNCTIONS
  this.getTime = function() {
    return time
  }
  this.getObjects = function() {
    return objects
  }
  this.getMaterials = function() {
    return materials
  }
  this.getForces = function() {
    return forces
  }
  this.getConstants = function() {
    return constants
  }
  this.setConstant = function(key,value) {
    constants[key] = value
  }
  this.pause = function() {
    if (!paused) {
      clearInterval(engine)
      paused = true
    }
  }
  this.resume = function() {
    if (paused) {
      engine = setInterval(update,1000/refresh_rate)
      paused = false
    }
  }

  //OBJECT CREATION FUNCTIONS
  this.createRectangle = function(x,y,width,height,material) {
    for (var i = 0; i < materials.length; i++) {
      if (material == materials[i].name) {
        var obj = new Rectangle(x,y,width,height,materials[i],false)
        objects.push(obj)
      }
    }
  }
  this.createCircle = function(x,y,radius,material) {
    for (var i = 0; i < materials.length; i++) {
      if (material == materials[i].name) {
        var obj = new Circle(x,y,radius,materials[i],false)
        objects.push(obj)
      }
    }
  }
  this.createStaticRectangle = function(x,y,width,height,material) {
    for (var i = 0; i < materials.length; i++) {
      if (material == materials[i].name) {
        var obj = new Rectangle(x,y,width,height,materials[i],true)
        objects.push(obj)
      }
    }
  }
  this.createMaterial = function(name,density,bounce,friction,colour) {
    var material = new Material(name,density,bounce,friction,colour)
    materials.push(material)
  }
  this.createForce = function(x_scalar,x_factors,y_scalar,y_factors,constant) {
    var force = new Force(x_scalar,x_factors,y_scalar,y_factors,constant)
    forces.push(force)
  }

  //CLASSES
  var Rectangle = function(x,y,width,height,material,is_static) {
    this.id = n++
    this.type = 'rectangle'
    this.x = x
    this.y = y
    this.dx = 0
    this.dy = 0
    this.width = width
    this.height = height
    this.material = material
    this.mass = material.density * width * height
    this.static = is_static
    if (!is_static) {
      this.dx = Math.floor(Math.random()*25)
      this.dy = Math.floor(Math.random()*25)
    }
  }
  var Circle = function(x,y,radius,material,is_static) {
    this.id = n++
    this.type = 'circle'
    this.x = x
    this.y = y
    this.dx = 0
    this.dy = 0
    this.width = radius*2
    this.height = radius*2
    this.radius = radius
    this.material = material
    this.mass = material.density * radius * radius * Math.PI
    this.static = is_static
    if (!is_static) {
      this.dx = Math.floor(Math.random()*25)
      this.dy = Math.floor(Math.random()*25)
    }
  }
  var Material = function(name,density,bounce,friction,colour) {
    this.name     = name;
    this.density  = density;
    this.bounce   = bounce;
    this.friction = friction;
    this.colour   = colour
  }
  var Force = function(x_scalar,x_factors,y_scalar,y_factors,constant) {
    this.x = x_scalar;
    this.fx = x_factors;
    this.y = y_scalar;
    this.fy = y_factors;
    this.z = constant
  }

  //PHYSX UPDATES
  var update = function() {
    time++
    cc.fillStyle = canvas_colour
    cc.fillRect(0,0,c.width,c.height)
    applyForces()
    moveObjects()
    drawObjects()
  }
  var applyForces = function() {
    for (var i = 0; i < objects.length; i++) {
      if (objects[i].static != true) {
        var obj = objects[i]
        for (var j = 0; j < forces.length; j++) {
          var f = forces[j]
          var apply = true
          for (var k = 0; k < f.fx.length; k++) {
            if (typeof obj[f.fx[k]] == undefined) {
              apply = false
            }
          }
          for (var k = 0; k < f.fy.length; k++) {
            if (typeof obj[f.fy[k]] == undefined) {
              apply = false
            }
          }
          if (apply) {
            var ddx = f.x
            var ddy = f.y
            if (typeof constants[f.z] != undefined && f.z != undefined) {
              ddx *= constants[f.z]
              ddy *= constants[f.z]
            }
            for (var k = 0; k < f.fx.length; k++) {
              ddx *= obj[f.fx[k]]
            }
            for (var k = 0; k < f.fy.length; k++) {
              ddy *= obj[f.fy[k]]
            }
            obj.dx += (ddx/obj.mass)/refresh_rate
            obj.dy += (ddy/obj.mass)/refresh_rate
          }
        }
      }
    }
  }
  var moveObjects = function() {
    for (var i = 0; i < objects.length; i++) {
      var obj = objects[i]
      var cache_y = obj.y
      var cache_x = obj.x
      if (obj.dx > 0 && !collide_x_p(obj)) {
        obj.x += obj.dx
      }
      if (obj.dy > 0 && !collide_y_p(obj)) {
        obj.y += obj.dy
      }
      if (obj.dx < 0 && !collide_x_n(obj)) {
        obj.x += obj.dx
      }
      if (obj.dy < 0 && !collide_y_n(obj)) {
        obj.y += obj.dy
      }
      if (obj.y == cache_y) {
        obj.dy = 0
      }
      if (obj.x == cache_x) {
        obj.dx = 0
      }
    }
  }
  var drawObjects = function() {
    for (var i = 0; i < objects.length; i++) {
      var obj = objects[i]
      cc.fillStyle = obj.material.colour
      cc.strokeStyle = obj.material.colour
      if (obj.type == 'circle') {
        cc.beginPath();
        cc.arc(obj.x+obj.radius,obj.y+obj.radius,obj.radius,0,2*Math.PI);
        cc.stroke();
        cc.fill();
      } else {
        cc.fillRect(obj.x,obj.y,obj.width,obj.height)
      }
    }
  }

  //PHYSX EVENTS
  var collide_x_p = function(obj) {
    var collision = false;
    for (var i = 0; i < objects.length; i++) {
      var obj2 = objects[i]
      if (  obj.x + obj.dx + obj.width >= obj2.x
        &&  obj.x + obj.width <= obj2.x
        &&  obj.y + obj.height > obj2.y
        &&  obj.y < obj2.y + obj2.height
        &&  obj.id != obj2.id
      ) {
        var collision = true;
        obj.x = obj2.x - obj.width;
        if (obj2.static == true) {
          bounceStatic_x(obj,obj2)
        } else {
          dynamicBounce_x(obj,obj2)
        }
      }
    }
    return collision
  }
  var collide_x_n = function(obj) {
    var collision = false;
    for (var i = 0; i < objects.length; i++) {
      var obj2 = objects[i]
      if (  obj.x + obj.dx <= obj2.x + obj2.width
        &&  obj.x >= obj2.x + obj2.width
        &&  obj.y + obj.height > obj2.y
        &&  obj.y < obj2.y + obj2.height
        &&  obj.id != obj2.id
      ) {
        var collision = true;
        obj.x = obj2.x + obj2.width;
        if (obj2.static == true) {
          bounceStatic_x(obj,obj2)
        } else {
          dynamicBounce_x(obj,obj2)
        }
      }
    }
    return collision
  }
  var collide_y_p = function(obj) {
    var collision = false;
    for (var i = 0; i < objects.length; i++) {
      var obj2 = objects[i]
      if (  obj.y + obj.dy + obj.height >= obj2.y
        &&  obj.y + obj.height <= obj2.y
        &&  obj.x + obj.width > obj2.x
        &&  obj.x < obj2.x + obj2.width
        &&  obj.id != obj2.id
      ) {
        var collision = true;
        obj.y = obj2.y - obj.height;
        if (obj2.static == true) {
          bounceStatic_y(obj,obj2)
        } else {
          dynamicBounce_y(obj,obj2)
        }
      }
    }
    return collision
  }
  var collide_y_n = function(obj) {
    var collision = false;
    for (var i = 0; i < objects.length; i++) {
      var obj2 = objects[i]
      if (  obj.y + obj.dy <= obj2.y + obj2.height
        &&  obj.y >= obj2.y + obj2.height
        &&  obj.x + obj.width > obj2.x
        &&  obj.x < obj2.x + obj2.width
        &&  obj.id != obj2.id
      ) {
        var collision = true;
        obj.y = obj2.y + obj2.height;
        if (obj2.static == true) {
          bounceStatic_y(obj,obj2)
        } else {
          dynamicBounce_y(obj,obj2)
        }
      }
    }
    return collision
  }
  var dynamicBounce_x = function(obj1,obj2) {
    if (obj1.dx > 0 && obj2.dx > 0 || obj1.dx < 0 && obj2.dx < 0) {
      obj1.dx -= (obj2.dx*obj2.mass*obj2.material.bounce)/obj1.mass
      obj2.dx += (obj1.dx*obj1.mass*obj2.material.bounce)/obj2.mass
    } else {
      obj1.dx += (obj2.dx*obj2.mass*obj2.material.bounce)/obj1.mass
      obj2.dx += (obj1.dx*obj1.mass*obj1.material.bounce)/obj2.mass
    }
    obj2.dy = obj2.dy*obj1.material.friction*obj2.material.friction
  }
  var dynamicBounce_y = function(obj1,obj2) {
    if (obj1.dy > 0 && obj2.dy > 0 || obj1.dy < 0 && obj2.dy < 0) {
      obj1.dy -= (obj2.dy*obj2.mass*obj2.material.bounce)/obj1.mass
      obj2.dy += (obj1.dy*obj1.mass*obj2.material.bounce)/obj2.mass
    } else {
      obj1.dy += (obj2.dy*obj2.mass*obj2.material.bounce)/obj1.mass
      obj2.dy += (obj1.dy*obj1.mass*obj1.material.bounce)/obj2.mass
    }
    obj1.dx = obj1.dx*obj1.material.friction*obj2.material.friction
  }
  var bounceStatic_x = function(obj,s_obj) {
    obj.dx = 0-(obj.dx * obj.material.bounce * s_obj.material.bounce)
    obj.dy = obj.dy * obj.material.friction * s_obj.material.friction
  }
  var bounceStatic_y = function(obj,s_obj) {
    obj.dy = 0-(obj.dy * obj.material.bounce * s_obj.material.bounce)
    obj.dx = obj.dx*obj.material.friction*s_obj.material.friction
  }

  var engine = setInterval(update,1000/refresh_rate)
}
