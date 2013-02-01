/*global portviz:false */
test("csv2json without header", function() {
    var input = "asdf";
    throws(
        function() { portviz.csvToJson(input); },
        /missing header/,
        "should say 'missing header'"
    );
});

test("csv2json empty", function() {
    var input = "";
    throws(
        function() { portviz.csvToJson(input); },
        /empty input/,
        "should say 'empty input'"
    );
});

test("csv2json", function() {
    var input = "foo,bar\na,b";
    var actual = portviz.csvToJson(input);
    var expected =[{foo: "a", bar: "b"}];
    deepEqual(actual, expected);
});

test("trim whitespace", function() {
    /*global trimWhitespace:false */
    equal(trimWhitespace("as df", "as df"));
    equal(trimWhitespace("asdf", "asdf"));
    equal(trimWhitespace(" asdf ", "asdf"));
    equal(trimWhitespace("\tasdf ", "asdf"));
    equal(trimWhitespace("\t asdf ", "asdf"));
    equal(trimWhitespace(" as df ", "as df"));
});

test("trim quotes", function() {
    /*global trimWhitespace:false */
    equal(trimWhitespace("\"asdf\"", "asdf"));
    equal(trimWhitespace("\'asdf\'", "asdf"));
    // ?
    equal(trimWhitespace("\''asdf\'", "asdf"));
    equal(trimWhitespace("\''''''asdf\'", "asdf"));
});

test("remove empty rows", function() {
/*global removeEmptyRows:false */
    deepEqual(removeEmptyRows(['a','b']), ['a','b']);
    deepEqual(removeEmptyRows(['a','','b']), ['a','b']);
});

test("parse csv line", function() {
    /*global parseCSVLine:false */
    deepEqual(parseCSVLine("a,b"), ['a','b']);
});

test("parse rows", function() {
    /*global parseRows:false */
    deepEqual(parseRows(['a,b','c,d']),[['a','b'],['c','d']]);
});

test("convert to json", function() {
    /*global convertToJson:false */
    deepEqual(convertToJson([['a','b'],['c','d']]), [{a:'c', b:'d'}]);
    deepEqual(convertToJson([['a','b'],['c','d'],['e','f']]), [{a:'c', b:'d'},{a:'e',b:'f'}]);
});
