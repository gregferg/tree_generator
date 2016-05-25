var Node = require('./node');
var NodeConnector = require('./node_connector');

var NodeController = function(pos, dir, ctx) {
  var root = new Node([pos[0],pos[1]], null, dir, 250, '#D6D6D6');

  this.nodeLeaves = [root];
  this.nodeRadius = 10;
  this.ctx = ctx;
  this.generateChildrenNodes();
  this.numTimesExtentions = 0;
};

NodeController.prototype.step = function(time) {
  for (var i = 0; i < this.nodeConnectors.length; i++) {
    if (this.nodeConnectors[i].move(time)) {
      if (this.numTimesExtentions > 6) {return ;}
      this.nodeRadius = this.nodeConnectors[i].radius;
      this.generateChildrenNodes();
      this.numTimesExtentions += 1;
      break;
    }
  }
};

NodeController.prototype.draw = function() {
  if (this.numTimesExtentions > 6) {return ;}
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
        new NodeConnector(leaf.pos, leaf.children[i].pos, this.nodeRadius)
      );
    }
  }.bind(this));
};

module.exports = NodeController;
