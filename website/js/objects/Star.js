var Star = function(seed) {
  this.planets = new ObjectArray()
  for (var key in seed) {
    this[key] = seed[key]
  }
}
