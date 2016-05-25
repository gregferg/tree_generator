var AnimateView = function (NodeController, ctx) {
  this.ctx = ctx;
  this.NodeController = NodeController;
};


AnimateView.prototype.start = function () {
  this.lastTime = 0;
  //start the animation
  requestAnimationFrame(this.animate.bind(this));
};

AnimateView.prototype.animate = function(time){
  var timeDelta = time - this.lastTime;

  this.NodeController.step(timeDelta);
  this.NodeController.draw(this.ctx);
  this.lastTime = time;

  //every call to animate requests causes another call to animate
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = AnimateView;
