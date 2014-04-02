// Construct a tree from a JSON string

var earley = require("../earley").earley;
var grammar = GrammerFromFile("../sample.cfg")

var json = [
		{ "word":"time", "lemma":"time", "pos": "N"},
		{ "word":"flies", "lemma":"flies", "pos": ["N","V"] },
		{ "word":"like", "lemma":"like", "pos": ["V","P"]},
		{ "word":"an", "lemma":"an", "pos": "D"},
		{ "word":"arrow", "lemma":"arrow", "pos": "N"}
	]

var sentence = earley.Sentence.SentenceFromJSON(json);
var parser = new earley.Parser(grammar, sentence, false)
var result = parser.parse();

if (parser.is_valid_sentence()) {
	var trees = new earley.ParseTrees(result);
	console.log("Sentence is Valid");
	console.log(trees.toString());
} else {
	console.log("Invalid Sentence");
}