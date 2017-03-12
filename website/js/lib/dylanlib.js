var ObjectArray = function() {
  this.length = 0
  this.n = 0
  this.forEach = function( _function, _params ) {
    var apply = true
    for (var key in this) {
      var apply = true
      for (var param in _params) {
        if (typeof this[key][param] == 'undefined') {
          apply = false
        } else if (_params[param] != '_exists_' && this[key][param] != _params[param]) {
          apply = false
        }
      }
      if (apply) {
        _function( this[key] )
      }
    }
  }
  this.add = function(thing, key) {
    this.length++
    if (typeof key != 'undefined') {
      this[key] = thing
    } else {
      this[this.n++] = thing
    }
  }
  this.remove = function(key) {
    this.length--
    delete this[key]
  }
}

var Animation = function(target, name, img_url, width, height, speed, frames) {
  this.name = animation.name
  this.img = new Image()
  this.img.src = img_url
  this.speed = speed
  this.step = 0
  this.w = width
  this.h = height
  this.frames = frames
  target.animation[this.name] = this
}
