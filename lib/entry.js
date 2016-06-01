var Node = require('./node');
var NodeController = require('./node_controller');
var AnimateView = require('./animate_view');




var animateViews = [];

document.addEventListener("DOMContentLoaded", function(){
  var canvasEl = document.getElementsByTagName("canvas")[0];
  var ctx = canvasEl.getContext("2d");
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;


  var root = new NodeController([window.innerWidth / 2, window.innerHeight], [0, 2], window.innerHeight * 9 / 32, ctx);
  var newAnimateView = new AnimateView(root, ctx);
  newAnimateView.start();
  animateViews.push(newAnimateView);

  window.clearScreen = function() {
    animateViews.forEach(function(animateView) {
      animateView.stop = true;
    });
    animateViews = [];

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  };


  var revealed = true;
  var hideRevealed = function() {
    if (!revealed) { return ; }
    document.getElementsByClassName("revealed")[0].remove();
    revealed = false;
  };

  window.addEventListener("keyup", function(e) {
    if (e.which === 32) {
      window.clearScreen();
      hideRevealed();
    }
  });


  window.addEventListener("click", function(e) {
    var height = (window.innerHeight - e.y) / 2;
    var newNodeController =
      new NodeController([e.x, window.innerHeight], [0,1], height, ctx);

    var newAnimateView = new AnimateView(newNodeController, ctx);
    newAnimateView.start();
    animateViews.push(newAnimateView);
  });
});
