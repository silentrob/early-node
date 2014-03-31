
function Chart(rows) {
  this.rows = rows || [];
}

Object.defineProperty(Chart.prototype, 'length', {get: function() {
   return this.rows.length;
}});

// Add a row to chart, only if wasn't already there
Chart.prototype.add_row = function(row) {

  var add = true;
  
  for (var i = 0; i < this.rows.length;i++) {
    if (this.rows[i].length == row.length && 
      this.rows[i].dot == row.dot && 
      this.rows[i].start == row.start &&
      this.rows[i].rule.lhs == row.rule.lhs && 
      this.rows[i].rule.rhs.compare(row.rule.rhs) == true
    ) {
      add = false;
     }
  }
  
  if (add === true) {
    this.rows.push(row);
  }
}

Chart.prototype.toString = function() {
    var st = '<Chart>';
    for (var i = 0; i < this.length; i++) {
      st += '\n\t' + this.rows[i].toString();
    }
    st+= '\n</Chart>'
    return st;
}


// Initialize a chart row, consisting of a rule, a position
function ChartRow(rule, dot, start, previous, completing) {
    this.rule = rule;
    this.dot = dot || 0;
    this.start = start || 0;
    this.previous = previous;
    this.completing = completing;
}

Object.defineProperty(ChartRow.prototype, 'length', {get: function() {
   return this.rule.length;
}});

// Return next category to parse, i.e. the one after the dot
ChartRow.prototype.next_category = function() {
  if (this.dot < this.length) {
    return this.rule.rhs[this.dot];
  } else {
    return null;
  }
}

// Returns last parsed category
ChartRow.prototype.prev_category = function() {
  if (this.dot > 0) {
    return this.rule.rhs[this.dot-1];
  } else {
    return null;
  }
}

ChartRow.prototype.toString = function() {

  // TODO Add the DOT back in.

  var rh = this.rule.rhs.join(' ')
  var lh = this.rule.lhs;
  var rule_str = "[" + lh +" -> "+ rh +"]";

  return "<Row " + rule_str + " ["+ this.start+"]>";
}

ChartRow.prototype.is_complete = function() {
  return (this.length == this.dot)
}

module.exports.ChartRow = ChartRow;
module.exports.Chart = Chart;

Array.prototype.compare = function (array) {
  // if the other array is a falsy value, return
  if (!array)
    return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length)
    return false;

  for (var i = 0, l=this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].compare(array[i]))
        return false;
    }
    else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}