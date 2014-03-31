ParseTrees = function(parser) {
  this.parser = parser;
  this.charts = parser.charts
  this.length = parser.length;
  this.nodes = [];

  for (var i = 0; i < parser.complete_parses.length; i++) {
  	this.nodes.push(this.build_nodes(parser.complete_parses[i]))
  }
}

ParseTrees.prototype.toString = function() {
  var st = "<Parse Trees>\n";
  for (var i = 0; i < this.nodes.length; i++) {
  	st += this.nodes[i].toString()
  }
  st += "</Parse Trees>";
	return st;
}

ParseTrees.prototype.build_nodes = function(root) {

	var nodes = [];
	var down = [];
	var left = [];

  // find subtrees of current symbol
  if (root.completing) {
		down = this.build_nodes(root.completing)
  } else {
  	down = [new TreeNode(root.prev_category())]
  }
  
  // prepend subtrees of previous symbols
  var prev = root.previous;

  while (prev && prev.dot > 0) {
	  left[0] = this.build_nodes(prev);
	  prev = prev.previous;
  }

  left.push(down);
  
  var ret = [];
  for (var i = 0; i < left.length; i++) {
  	var children = left[i];
  	if (left[i]) {
  		ret.push([new TreeNode(root.rule.lhs, children)])
  	}
  }
  return ret;
}

Object.defineProperty(ParseTrees.prototype, 'length', {get: function() {
   return this.nodes.length;
}});

TreeNode = function(body, children)  {
	this.body = body;
	this.children = children || [];
}

TreeNode.prototype.toString = function() {
	
	var st = "[."+ this.body +" ";
	if (!this.is_leaf()) {
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			st +=  child;
		}
	}
	st += ' ]';
	return st;
}

TreeNode.prototype.is_leaf = function() {
	return (this.children.length == 0);
}

module.exports = ParseTrees;
