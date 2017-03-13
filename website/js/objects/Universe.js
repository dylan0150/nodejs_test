var Universe = function(seed) {
  this.galaxies = new ObjectArray()
  for (var key in seed.galaxies) {
    this.galaxies[key] = seed.galaxies[key]
  }
}
