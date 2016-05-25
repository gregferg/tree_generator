var Util = require('./util');
var NodeConnector = function(pos, targetPos, startingRadius, NodeController) {
  this.nodeController = NodeController;
  console.log("new connector");
  this.pos = pos;
  this.targetPos = targetPos;
  this.speed = 1;
  this.length = Util.dist(pos,  targetPos);
  this.radius = startingRadius;
  this.delta =
    Util.scale(Util.dir(
      [this.targetPos[0] - this.pos[0],
    this.targetPos[1] - this.pos[1]]
  ), this.speed);
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;
NodeConnector.prototype.move = function (timeDelta) {
  if (this.pos[1] < this.targetPos[1]) { return true; }
  //timeDelta is number of milliseconds since last move
  //if the computer is busy the time delta will be larger
  //in this case the MovingObject should move farther in this frame
  //velocity of object is how far it should move in 1/60th of a second
  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.delta[0] * velocityScale,
      offsetY = this.delta[1] * velocityScale;

  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
};

NodeConnector.prototype.draw = function (ctx) {

  ctx.beginPath();
  ctx.arc(
    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();

  this.radius *= .995;
};


module.exports = NodeConnector;
