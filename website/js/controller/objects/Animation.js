var Animation = function(target, animation) {
  this.name = animation.name
  this.img = new Image()
  this.img.src = animation.img_url
  this.speed = animation.speed
  this.step = 0
  this.w = animation.frame_width
  this.h = animation.frame_height
  this.frames = []
  for (var x = 0; x < animation.x; x++) {
    for (var y = 0; y < animation.y; y++) {
      this.frames.push([x,y])
    }
  }
  target.animation[this.name] = this
}
