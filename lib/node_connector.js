var Util = require('./util');

var NodeConnector = function(pos, targetPos, startingRadius, NodeController, color) {
  this.nodeController = NodeController;
  this.color = color;
  this.pos = pos;
  console.log(startingRadius);
  this.prevPos = pos;
  this.targetPos = targetPos;
  this.speed = 2.2;
  this.length = Util.dist(pos, targetPos);
  this.radius = startingRadius;
  this.delta =
    Util.scale(Util.dir(
      [this.targetPos[0] - this.pos[0],
    this.targetPos[1] - this.pos[1]]
  ), this.speed);
  this.lastLengthFromTarget = this.calculateLength();
};

NodeConnector.prototype.calculateLength = function() {
  return Util.dist(this.pos, this.targetPos);
};

var NORMAL_FRAME_TIME_DELTA = 1000/60;
NodeConnector.prototype.move = function (timeDelta) {
  var lengthFromTarget = this.calculateLength();
  if (this.lastLengthFromTarget < lengthFromTarget) {
    return true;
  }
  this.lastLengthFromTarget = lengthFromTarget;
  //timeDelta is number of milliseconds since last move
  //if the computer is busy the time delta will be larger
  //in this case the MovingObject should move farther in this frame
  //velocity of object is how far it should move in 1/60th of a second
  var velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.delta[0] * velocityScale,
      offsetY = this.delta[1] * velocityScale;

  this.prevPos = this.pos;
  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
};

NodeConnector.prototype.draw = function (ctx) {
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.arc(
    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();

  this.radius *= .993;
};


module.exports = NodeConnector;
