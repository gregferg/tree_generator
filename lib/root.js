var Root = function(pos, parent) {
  this.pos = pos;
  this.dir = [0,1];
  this.parent = parent;
  this.children = [];
};


module.exports = Root;
