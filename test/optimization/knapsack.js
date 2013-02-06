/*global portviz:false, _:false */
/*
 * after rosettacode.org/mw/index.php?title=Knapsack_problem/0-1
 */
var allwants = [
  {name: "map", weight: 9, value: 150},
  {name: "compass", weight: 13, value: 35},
  {name: "water", weight: 153, value: 200},
  {name: "sandwich", weight: 50, value: 160},
  {name: "glucose", weight: 15, value: 60},
  {name: "tin", weight: 68, value: 45},
  {name: "banana", weight: 27, value: 60},
  {name: "apple", weight: 39, value: 40},
  {name: "cheese", weight: 23, value: 30},
  {name: "beer", weight: 52, value: 10},
  {name: "suntan cream", weight: 11, value: 70},
  {name: "camera", weight: 32, value: 30},
  {name: "T-shirt", weight: 24, value: 15},
  {name: "trousers", weight: 48, value: 10},
  {name: "umbrella", weight: 73, value: 40},
  {name: "waterproof trousers", weight: 42, value: 70},
  {name: "waterproof overclothes", weight: 43, value: 75},
  {name: "note-case", weight: 22, value: 80},
  {name: "sunglasses", weight: 7, value: 20},
  {name: "towel", weight: 18, value: 12},
  {name: "socks", weight: 4, value: 50},
  {name: "book", weight: 30, value: 10}
];

var near = function (actual, expected, tolerance) {
  if (expected === 0 && actual === 0) return true;
  if (expected === 0) {
    return Math.abs(expected - actual) / actual < tolerance;
  }
  return Math.abs(expected - actual) / expected < tolerance;
};

test("one knapsack", function () {
  var combiner =
    portviz.knapsack.combiner(allwants,
      function (x) {return x.weight; },
      function (x) {return x.value; });
  var oneport = combiner.one(400);
  ok(near(oneport.totalValue, 1030, 0.01), "correct total value");
  ok(near(oneport.totalValue, 1030, 0.01), "correct total value");
  equal(oneport.totalWeight, 396, "correct total weight");
});

test("frontier", function () {
  var combiner =
    portviz.knapsack.combiner(allwants,
      function (x) {return x.weight; },
      function (x) {return x.value; });
  var ef = combiner.ef(400, 1);
  equal(ef.length, 401, "401 because it includes the endpoints");
  ef = combiner.ef(400, 40);
  equal(ef.length, 11, "11 because it includes the endpoints");
  var expectedTotalValue = [
    0,
    330,
    445,
    590,
    685,
    755,
    810,
    860,
    902,
    960,
    1030
  ];
  _.each(ef, function (element, index) {
    // 15% error!  bleah!
    ok(near(element.totalValue, expectedTotalValue[index], 0.15),
      'actual ' + element.totalValue + ' expected ' + expectedTotalValue[index]);
  });
  deepEqual(_.pluck(ef, 'totalWeight'), [
    0,
    39,
    74,
    118,
    158,
    200,
    236,
    266,
    316,
    354,
    396
  ]);
  deepEqual(_.map(ef, function (x) {return x.items.length; }), [
    0,
    4,
    6,
    7,
    9,
    10,
    10,
    12,
    14,
    11,
    12
  ]);
});
