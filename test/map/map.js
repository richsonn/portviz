/*global portviz:false */
test("randompareto", function() {
  var items = [
    {w:1, v:2},
    {w:1, v:2}
  ];
  var rp = portviz.map.randompareto(items, function(x){return x.w;}, function(x){return x.v;});
  equal(rp.length, 3, "length");
  deepEqual(rp, [
    {
      "x": 0,
      "y": 0
    },
    {
      "x": 1,
      "y": 2
    },
    {
      "x": 2,
      "y": 4
    }
  ] , "exact");
});

test("knapsackpareto", function() {
  var items = [
    {w:1, v:2},
    {w:1, v:2}
  ];
  var rp = portviz.map.knapsackpareto(items, function(x){return x.w;}, function(x){return x.v;});
  equal(rp.length, 3, "length");
    deepEqual(rp, [
    {
      "x": 0,
      "y": 0
    },
    {
      "x": 1,
      "y": 2
    },
    {
      "x": 2,
      "y": 4
    }
  ] , "exact");
});
