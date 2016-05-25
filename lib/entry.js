var Node = require('./node');
var NodeController = require('./node_controller');
var AnimateView = require('./animate_view');


document.addEventListener("DOMContentLoaded", function(){
  var canvasEl = document.getElementsByTagName("canvas")[0];
  var ctx = canvasEl.getContext("2d");
  canvasEl.width = window.innerWidth;
  canvasEl.height = window.innerHeight;


  var root = new NodeController([window.innerWidth / 2, window.innerHeight], [0, 2], window.innerHeight * 9 / 32, ctx);
  new AnimateView(root, ctx).start();


  window.addEventListener("click", function(e) {
    console.log([e.x, window.innerHeight]);
    var height = (window.innerHeight - e.y) / 2;
    new AnimateView(
      new NodeController([e.x, window.innerHeight], [0,1], height, ctx)
      , ctx
    ).start();
  });
});
