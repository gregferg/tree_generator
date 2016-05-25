var Lightening = function(ctx, e) {
  this.startingPos = [e.clientX, e.clientY];
  this.pos = this.startingPos;
  this.ctx = ctx;
  this.draw();
};


Lightening.prototype.draw = function() {
  while (this.pos[1] < 600) {
    var nextPos = this.nextPoint(this.pos);
    this.connectPoints(this.pos, nextPos);
    this.pos = nextPos;
    if (Math.random() < .005) {
      var newPos = { clientX: this.pos[0], clientY: this.pos[1] };
      new Lightening(this.ctx, newPos);
    }
  }
};


Lightening.prototype.nextPoint = function(pos) {
  return [
    pos[0] + Math.random() * 7 - Math.random() * 7,
    pos[1] + Math.random() * 2
  ];
};

Lightening.prototype.connectPoints = function(startPos, endPos) {
  var ctx = this.ctx;

  ctx.beginPath();
  ctx.strokeStyle = 'blue';
  ctx.moveTo(startPos[0], startPos[1]);
  ctx.lineTo(endPos[0], endPos[1]);
  ctx.stroke();
};


module.exports = Lightening;
