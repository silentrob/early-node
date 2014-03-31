
var earley = require("../earley").earley;

var grammar = GrammerFromFile("../sample.cfg")

var sentence = earley.Sentence("time/time<N> flies/flies<N>/flies<V> like/like<P>/like<V> an/an<D> arrow/arrow<N>");
var parser = new earley.Parser(grammar, sentence, false)
var result = parser.parse();

if (parser.is_valid_sentence()) {
	var trees = new earley.ParseTrees(result);
	console.log("Sentence is Valid");
	console.log(trees.toString());
	
} else {
	console.log("Invalid Sentence");
}