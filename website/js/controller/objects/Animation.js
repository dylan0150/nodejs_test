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
