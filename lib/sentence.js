var str = require("string");

Word = function(word, tags) {
  this.word = word || "";
  this.tags = tags || [];
}

Word.prototype.toString = function() {
  return this.word + "<" + this.tags.join(",") + "> "
}

Sentence = function(words) {
  this.words = words || [];
}

Sentence.prototype.addWord = function(w) {
  this.words.push(w);
}

Object.defineProperty(Sentence.prototype, 'length', {get: function() {
   return this.words.length;
}});

Sentence.prototype.toString = function() {
  var s = "";
  for (var i = 0; i < this.words.length; i++) {
    s += this.words[i].toString();
  }
  return s;  
}


/*
 Create a Sentence object from a given string in the Apertium stream format:
  time/time<N> flies/flies<N>/flies<V> like/like<P>/like<V> an/an<D> arrow/arrow<N>
*/
module.exports.SentenceFromString = function(text) {

  // prepare regular expressions to find word and tags
  var sentence = new Sentence();
  var words = str(text).split(' ');

  var re = /\/[^\<]*\<([^\>]*)\>/g;
  for (var i = 0; i < words.length; i++) {
    var match = words[i].match(/^[^\/]*/);
    
    var t = [];
    matches = re.exec(words[i]);
    while (matches != null) {
      t.push(matches[1]);
      matches = re.exec(words[i]);
    }

    var w = new Word(match[0], t);
    sentence.addWord(w);
  }
  return sentence;
}

var isArray = function(obj) {
  return toString.call(obj) === "[object Array]";
}

module.exports.SentenceFromJSON = function(json) {
  var sentence = new Sentence();
  var i, w;

  for (i = 0; i < json.length; i++) {
    if (isArray(json[i].pos)) {
      w = new Word(json[i].lemma, json[i].pos);  
    } else {
      w = new Word(json[i].lemma, [json[i].pos]);
    }
    sentence.addWord(w);
  }
  
  return sentence;
}
