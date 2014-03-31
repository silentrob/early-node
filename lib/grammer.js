var fs = require("fs");
var str = require("string");
var lineReader = require('line-reader');

function Rule(lhs, rhs) {
  this.lhs = lhs;
  this.rhs = rhs;
}

Rule.prototype.toString = function() {
  return "<Rule "+ this.lhs + " -> "+ this.rhs.join(" ") +">";
}

Object.defineProperty(Rule.prototype, 'length', {get: function() {
   return this.rhs.length;
}});

Rule.prototype.get = function(item) {
  return this.rhs[item]
}

function Grammar() {
  this.rules = {};
}

Grammar.prototype.get = function(lhs) {
  if (this.rules[lhs]) {
    return this.rules[lhs];
  } else {
    return null;
  }
}

Grammar.prototype.toString = function() {
  var st = '<Grammar>\n';
  for (group in this.rules) {
    for ( var i = 0; i < this.rules[group].length; i++) {
      st+= '\t' + this.rules[group][i].toString() + '\n';
    }
  }
  st+= '</Grammar>'
  return st;
}


// Add a rule to the grammar
Grammar.prototype.add_rule = function(rule) {
  var lhs = rule.lhs;
  if (lhs in this.rules) {
    this.rules[lhs].push(rule);
  } else {
    this.rules[lhs] = [rule];
  }  
}

GrammerFromFile = function(filename) {
  var grammar = new Grammar();

  // Lets do this sync, it should be a short file.
  var contents = fs.readFileSync(filename, 'utf-8');
  var lines = str(contents).lines();

  for (var n = 0; n < lines.length;n++) {
    var line = lines[n];
    if (line.indexOf("#") == -1 && line.length >= 3) {

      var rule = line.split("->")
      var lhs = str(rule[0]).trim();
      var outcome = rule[1].split('|');
      for (var i = 0; i < outcome.length; i++) {
        var rhs = str(outcome[i]).trim();
        var symbols = rhs.split(' ');

        var r = new Rule(lhs.s, symbols);
        grammar.add_rule(r);
      }
    }
  }
  return grammar;
}

module.exports = GrammerFromFile;
module.exports.Rule = Rule;