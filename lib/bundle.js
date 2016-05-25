/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Lightening = __webpack_require__(1);
	var Node = __webpack_require__(2);
	var NodeController = __webpack_require__(3);
	var AnimateView = __webpack_require__(6);
	
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  var ctx = canvasEl.getContext("2d");
	  canvasEl.width = window.innerWidth;
	  canvasEl.height = window.innerHeight;
	
	
	  var root = new NodeController([window.innerWidth / 2, window.innerHeight], [0, 2], ctx);
	  new AnimateView(root, ctx).start();
	
	  var root = new NodeController([window.innerWidth / 4, window.innerHeight], [0, 2], ctx);
	  new AnimateView(root, ctx).start();
	
	  var root = new NodeController([window.innerWidth * 3 / 4, window.innerHeight], [0, 2], ctx);
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


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	var Node = function(pos, parent, dir, radius, color) {
	  this.radius = radius;
	  this.pos = pos;
	  this.dir = dir;
	  this.parent = parent ? parent : null;
	  this.children = [];
	  this.color = color;
	};
	
	Node.prototype.draw = function(ctx) {
	  for (var i = 0; i < this.children.length; i++) {
	    ctx.strokeStyle = this.color;
	    ctx.beginPath();
	    ctx.moveTo(this.pos[0], this.pos[1]);
	    ctx.lineTo(this.children[i].pos[0], this.children[i].pos[1]);
	    ctx.stroke();
	  }
	};
	
	
	
	var colors = {
	  '#D6D6D6': '#A6A6A6',
	  '#A6A6A6': '#666666',
	  '#666666': '#363636',
	  '#363636': '#060606'
	};
	
	Node.prototype.nextColor = function() {
	  return colors[this.color];
	};
	
	Node.prototype.generateChildren = function() {
	  // var numChildren = Math.floor(Math.random() * 5) + 1;
	  var numChildren = 2;
	
	  var childrenDirs = this.calculateChildrenDirs(numChildren);
	  var childrenPos = this.calculateChildrenPos(childrenDirs);
	
	
	  var children = [];
	  for (var i = 0; i < numChildren; i++) {
	    children.push(
	      new Node(
	        childrenPos[i],
	        this,
	        childrenDirs[i],
	        this.radius * 5 / 8,
	        this.nextColor()
	      )
	    );
	  }
	
	  this.children = children;
	  return children;
	};
	
	
	Node.prototype.calculateStartingAngle = function() {
	  var start = this.pos;
	  var end = [this.pos[0] + this.dir[0], this.pos[1] + this.dir[1]];
	  return Math.atan((start[1] - end[1]) / (start[0] - end[0])) - Math.PI / 3;
	};
	
	Node.prototype.calculateChildrenDirs = function(numChildren) {
	  var startAngle = this.calculateStartingAngle();
	  var angleIncrememnt = (Math.PI * 2 / 3 ) / numChildren;
	
	  var angles = [];
	  var dirs = [];
	
	  for (var i = 0; i < numChildren; i++) {
	    angles.push(
	      startAngle + angleIncrememnt * i + angleIncrememnt * Math.random()
	    );
	  }
	
	  var mirror = 1;
	  if (this.dir[0] < 0) {
	    mirror = -1;
	  }
	
	  for (var j = 0; j < angles.length; j++) {
	    var x = this.radius * Math.cos(angles[j]) * mirror;
	    var y = this.radius * Math.sin(angles[j]) * mirror;
	    dirs.push([x,y]);
	  }
	
	  return dirs;
	};
	
	Node.prototype.calculateChildrenPos = function(dirs) {
	  var childPos = [];
	
	  for (var i = 0; i < dirs.length; i++) {
	    childPos.push([this.pos[0] + dirs[i][0], this.pos[1] + dirs[i][1]]);
	  }
	
	  return childPos;
	};
	
	
	module.exports = Node;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(2);
	var NodeConnector = __webpack_require__(4);
	
	var NodeController = function(pos, dir, ctx) {
	  var root = new Node([pos[0],pos[1]], null, dir, 150, '#D6D6D6');
	
	  this.nodeLeaves = [root];
	  this.ctx = ctx;
	  this.leafNumber = 0;
	  this.endLeafNumber = this.nodeLeaves.length;
	  this.generateChildrenNodes();
	  this.numTimesExtentions = 0;
	  // this.start();
	};
	
	// NodeController.prototype.start = function () {
	//   this.timer = window.setInterval(function(){
	//     this.step(this.ctx);
	//   }.bind(this), 10);
	// };
	//
	// NodeController.prototype.stop = function () {
	//   window.clearInterval(this.timer);
	// };
	
	NodeController.prototype.step = function(time) {
	  for (var i = 0; i < this.nodeConnectors.length; i++) {
	    if (this.nodeConnectors[i].move(time)) {
	      if (this.numTimesExtentions > 6) {return ;}
	      this.generateChildrenNodes();
	      this.numTimesExtentions += 1;
	      break;
	    }
	  }
	};
	
	NodeController.prototype.draw = function() {
	  for (var i = 0; i < this.nodeConnectors.length; i++) {
	    this.nodeConnectors[i].draw(this.ctx);
	  }
	};
	
	
	NodeController.prototype.generateChildrenNodes = function() {
	  var newLeaves = [];
	  this.nodeLeaves.forEach(function(leaf) {
	    var childrenLeaves = leaf.generateChildren();
	    for (var i = 0; i < childrenLeaves.length; i++) {
	      newLeaves.push(childrenLeaves[i]);
	    }
	  }.bind(this));
	
	  this.generateChildrenNodeConnectors();
	  this.nodeLeaves = newLeaves;
	};
	
	NodeController.prototype.generateChildrenNodeConnectors = function() {
	  this.nodeConnectors = [];
	  this.nodeLeaves.forEach(function(leaf) {
	    for (var i = 0; i < leaf.children.length; i++) {
	      this.nodeConnectors.push(
	        new NodeConnector(leaf.pos, leaf.children[i].pos, 5)
	      );
	    }
	  }.bind(this));
	};
	
	
	// NodeController.prototype.step = function(ctx) {
	//   if (this.leafNumber === this.endLeafNumber) {
	//     this.stop();
	//     return;
	//   }
	//
	//   var node = this.nodeLeaves[this.leafNumber];
	//   if (node.radius > 10) {
	//     var newLeaves = node.generateChildren();
	//
	//   newLeaves.forEach(function(leaf) {
	//     this.nodeLeaves.push(leaf);
	//     this.endLeafNumber += 1;
	//   }.bind(this));
	// }
	//
	//   node.draw(ctx);
	//   this.leafNumber += 1;
	// };
	
	
	
	module.exports = NodeController;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(5);
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


/***/ },
/* 5 */
/***/ function(module, exports) {

	var Util = {
	  // Normalize the length of the vector to 1, maintaining direction.
	  dir: function (vec) {
	    var norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	  // Find distance between two points.
	  dist: function (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	  // Find the length of the vector.
	  norm: function (vec) {
	    return Util.dist([0, 0], vec);
	  },
	  // Return a randomly oriented vector with the given length.
	  randomVec : function (length) {
	    var deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	  // Scale the length of a vector by the given amount.
	  scale: function (vec, m) {
	    return [vec[0] * m, vec[1] * m];
	  },
	  inherits: function (ChildClass, BaseClass) {
	    function Surrogate () { this.constructor = ChildClass; }
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	  },
	};
	
	module.exports = Util;


/***/ },
/* 6 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map