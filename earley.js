var debug = require("debug")("Earley");
var Grammar = require("./lib/grammer");
var SentenceFromString = require("./lib/sentence");
var parser = require("./lib/parser");
var parse_trees = require("./lib/parse_trees");


var grammar = GrammerFromFile("sample.cfg")
var sentence = SentenceFromString("time/time<N> flies/flies<N>/flies<V> like/like<P>/like<V> an/an<D> arrow/arrow<N>");
var earley = new Parser(grammar, sentence, false)
var result = earley.parse();

if (earley.is_valid_sentence()) {
	var trees = new parse_trees(result);
	console.log("Sentence is Valid");
	console.log(trees.toString());
	
} else {
	console.log("Invalid Sentence");
}