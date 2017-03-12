var Planet = function(seed) {
  this.regions = new ObjectArray()
  for (var key in seed) {
    this[key] = seed[key]
  }
}
