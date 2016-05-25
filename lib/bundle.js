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

	var Node = __webpack_require__(1);
	var NodeController = __webpack_require__(2);
	var AnimateView = __webpack_require__(5);
	
	
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


/***/ },
/* 1 */
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
	  return '#765015';
	  // return colors[this.color];
	};
	
	Node.prototype.generateChildren = function() {
	  // var numChildren = Math.floor(Math.random() * 5) + 1;
	  var numChildren = 4;
	
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
	  return Math.atan((start[1] - end[1]) / (start[0] - end[0])) - Math.PI / 4;
	};
	
	Node.prototype.calculateChildrenDirs = function(numChildren) {
	  var startAngle = this.calculateStartingAngle();
	  var angleIncrememnt = (Math.PI * 2 / 4 ) / numChildren;
	
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Node = __webpack_require__(1);
	var NodeConnector = __webpack_require__(3);
	
	var NodeController = function(pos, dir, height, ctx) {
	  '#D6D6D6';
	  var root = new Node([pos[0],pos[1]], null, dir, height, '#99803B');
	
	  this.nodeLeaves = [root];
	  this.nodeRadius = 10;
	  this.ctx = ctx;
	  this.generateChildrenNodes();
	  this.numTimesExtentions = 0;
	  this.done = false;
	};
	
	NodeController.prototype.step = function(time) {
	  if (this.numTimesExtentions > 4) { this.done = true;}
	
	  for (var i = 0; i < this.nodeConnectors.length; i++) {
	    if (this.nodeConnectors[i].move(time)) {
	      this.nodeRadius = this.nodeConnectors[i].radius;
	      this.generateChildrenNodes();
	      this.numTimesExtentions += 1;
	      break;
	    }
	  }
	};
	
	NodeController.prototype.draw = function() {
	  if (this.numTimesExtentions > 4) {return ;}
	  console.log(this.numTimesExtentions);
	
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
	  });
	
	  this.generateChildrenNodeConnectors();
	  this.nodeLeaves = newLeaves;
	};
	
	NodeController.prototype.generateChildrenNodeConnectors = function() {
	  this.nodeConnectors = [];
	  this.nodeLeaves.forEach(function(leaf) {
	    for (var i = 0; i < leaf.children.length; i++) {
	      this.nodeConnectors.push(
	        new NodeConnector(leaf.pos, leaf.children[i].pos, this.nodeRadius, this, leaf.children[i].color)
	      );
	    }
	  }.bind(this));
	};
	
	module.exports = NodeController;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(4);
	
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
	  // ctx.fillStyle = this.color;
	  // ctx.beginPath();
	  // ctx.arc(
	  //   this.prevPos[0], this.prevPos[1], this.radius * 1.03, 0, 2 * Math.PI, true
	  // );
	  // ctx.fill();
	
	  ctx.beginPath();
	  ctx.fillStyle = 'black';
	  ctx.arc(
	    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	  );
	  ctx.fill();
	
	  this.radius *= .993;
	};
	
	
	module.exports = NodeConnector;


/***/ },
/* 4 */
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
/* 5 */
/***/ function(module, exports) {

	var AnimateView = function (NodeController, ctx) {
	  this.ctx = ctx;
	  this.NodeController = NodeController;
	};
	
	
	AnimateView.prototype.start = function () {
	  //start the animation
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	AnimateView.prototype.animate = function(time){
	  if (!this.lastTime) {
	    // setting this.lastTime in the start function causes problems
	    // when creating multiple trees, since time does not reset to zero
	    this.lastTime = time;
	  }
	
	  console.log(time);
	  var timeDelta = time - this.lastTime;
	
	  if (this.NodeController.done) {
	    console.log("done");
	    return;
	  }
	
	  console.log("hi");
	
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