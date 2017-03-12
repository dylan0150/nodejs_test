var Universe = function(seed) {
  this.galaxies = new ObjectArray()
  for (var key in seed) {
    this[key] = seed[key]
  }
}
