var Grammar = require("./grammer");
var Chart = require("./chart");

Parser = function(grammar, sentence, debug) {
  this.grammar = grammar;
  this.sentence = sentence;
  this.debug = debug;

	this.charts = [];
	this.complete_parses = [];

  for (var i = 0; i <= sentence.length; i++) {
  	this.charts.push(new Chart.Chart([]));
  }
}

Parser.GAMMA_SYMBOL = 'GAMMA';

Parser.prototype.parse = function() {
	this.init_first_chart();
	
	// we go word by word
	for (var i = 0; i < this.charts.length; i++) {
    var chart = this.charts[i];
    this.prescan(chart, i) // scan current input

    var length = chart.length;
    var old_length = -1;
    while (old_length != length) {
    	
			this.predict(chart, i);
			this.complete(chart, i)
	    old_length = length;
	    length = chart.length;
		}
	}

	if (this.debug) {
    console.log("Parsing charts:");
    for (var i = 0; i < this.charts.length; i++) {
    	console.log("-----------%d-------------", i)
    	console.log(this.charts[i].toString());
    	console.log("-------------------------")
    }		
	}
    
	return this;
}

Object.defineProperty(Parser.prototype, 'length', {get: function() {
   return this.sentence.length;
}});

//  Add initial Gamma rule to first chart
Parser.prototype.init_first_chart = function() {
	var row = new Chart.ChartRow(new Grammar.Rule(Parser.GAMMA_SYMBOL, ['S']), 0, 0)
  this.charts[0].add_row(row);
}

// Scan current word in sentence, and add appropriate grammar categories to current chart
Parser.prototype.prescan = function(chart, position) {
	var word = this.sentence.words[position-1];
	if (word) {
		var rules = [];

		for (var i = 0; i < word.tags.length; i++) {
			var tag = word.tags[i];
			rules.push(new Grammar.Rule(tag, [word.word]));
		}
		
		for (var i = 0; i < rules.length; i++) {
			chart.add_row(new Chart.ChartRow(rules[i], 1,	 position-1))
		}
	}
}

Parser.prototype.predict = function(chart, position) {
	for (var i = 0; i < chart.rows.length; i++) {
		var row = chart.rows[i];
		
	  var next_cat = row.next_category();
		var rules = this.grammar.get(next_cat)
	
		if (rules != null) {
  		for (var n = 0; n < rules.length; n++) {
  			var rule = rules[n];			
  			var c = new Chart.ChartRow(rule, 0, position);
  			chart.add_row(c);
  		}
		}
	}
}

Parser.prototype.complete = function(chart, position) {
	for (var i = 0; i < chart.rows.length; i++) {
		var row = chart.rows[i];
		if (row.is_complete()) {
			var completed = row.rule.lhs;
			for (var n = 0; n < this.charts[row.start].rows.length; n++) {
				var r = this.charts[row.start].rows[n];
				if (completed == r.next_category()) {
					chart.add_row(new Chart.ChartRow(r.rule, r.dot+1, r.start, r, row));
				}
			}
		}
	}
}

Parser.prototype.is_valid_sentence = function() {
	var res = false;
	var lastChart = this.charts[this.charts.length - 1];

	for (var i = 0; i < lastChart.rows.length; i++) {
		var row = lastChart.rows[i];
		if (row.start == 0) {
			if (row.rule.lhs == Parser.GAMMA_SYMBOL) {
				if (row.is_complete()) {
					this.complete_parses.push(row);
					res =  true;
				}
			}
		}
	}

	return res;
}
      
module.exports = Parser;