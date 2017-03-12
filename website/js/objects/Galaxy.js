var Galaxy = function(seed) {
  this.stars = new ObjectArray()
  for (var key in seed) {
    this[key] = seed[key]
  }
}
