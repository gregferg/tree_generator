var Node = require('./node');
var NodeConnector = require('./node_connector');

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
