var Node = require('./node');
var NodeController = require('./node_controller');
var AnimateView = require('./animate_view');


document.addEventListener("DOMContentLoaded", function(){
  var canvasEl = document.getElementsByTagName("canvas")[0];
  var ctx = canvasEl.getContext("2d");
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;


  var root = new NodeController([window.innerWidth / 2, window.innerHeight], [0, 2], ctx);
  new AnimateView(root, ctx).start();

  // new NodeController([window.innerWidth, window.innerHeight / 2], [-2, -2], ctx);


  // var num = 0;
  // //
  // var timer = window.setInterval(function(){
  //   if (num === 200) {
  //     window.clearInterval(timer);
  //   }
  //   new NodeController([window.innerWidth / 2, window.innerHeight / 2], [0, 2], ctx);
  //   new NodeController([window.innerWidth / 2, window.innerHeight / 2], [0, -2], ctx);
  //   num += 1;
  // }, 10);

  // new NodeController([window.innerWidth / 2, window.innerHeight / 2], ctx);


  window.addEventListener("click", function(e) {
    // new NodeController([e.x, e.y], ctx);

  });
});
