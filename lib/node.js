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
