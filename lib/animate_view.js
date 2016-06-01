var AnimateView = function (NodeController, ctx) {
  this.ctx = ctx;
  this.NodeController = NodeController;
  this.stop = false;
};

AnimateView.prototype.start = function () {
  //start the animation
  requestAnimationFrame(this.animate.bind(this));
};

AnimateView.prototype.animate = function(time){
  if (this.stop) {return ;}
  if (!this.lastTime) {
    // setting this.lastTime in the start function causes problems
    // when creating multiple trees, since time does not reset to zero
    this.lastTime = time;
  }

  var timeDelta = time - this.lastTime;

  if (this.NodeController.done) {
    return;
  }

  this.NodeController.step(timeDelta);
  this.NodeController.draw(this.ctx);
  this.lastTime = time;

  //every call to animate requests causes another call to animate
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = AnimateView;
