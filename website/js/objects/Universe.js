var Universe = function(seed,user) {
  this.galaxies = new ObjectArray()
  this.user = user
  for (var key in seed.galaxies) {
    this.galaxies[key] = seed.galaxies[key]
  }
  var i = 0
  var number = 1000
  var angle = Math.PI/13
  var centre = {x:0,y:0}
  var factor = 1
  var sfactor = 8
  var generateGalaxy = function(universe,num,x,y,angle,centre,factor,sfactor) {
    sfactor += 0.12
    factor+= 0.18
    x+= 1-factor
    y+= 1-factor
		var cosAngle = Math.cos( angle );
		var sinAngle = Math.sin( angle );
		var xWRTCentre = x - centre.x;
		var yWRTCentre = y - centre.y;
		var spiralFactor = 1.0 + angle/sfactor;
		var newXWRTCentre = spiralFactor * ( xWRTCentre * cosAngle - yWRTCentre * sinAngle );
		var newYWRTCentre = spiralFactor * ( xWRTCentre * sinAngle + yWRTCentre * cosAngle );
    universe.galaxies.add({x:x,y:y})
		x2 = newXWRTCentre + centre.x;
		y2 = newYWRTCentre + centre.y;
    if (i++ < num) {
      generateGalaxy(universe,num,x2,y2,angle,centre,factor,sfactor)
    }
  }
  generateGalaxy(this,number,0,0,angle,centre,factor,sfactor)
}
