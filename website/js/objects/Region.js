var Region = function(seed) {
  for (var key in seed) {
    this[key] = seed[key]
  }
}
