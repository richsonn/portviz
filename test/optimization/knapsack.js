/*global portviz:false */

var allwants = [
  {name:"map", weight:9, value: 150},
  {name:"compass", weight:13, value: 35},
  {name:"water", weight:153, value: 200},
  {name:"sandwich", weight: 50, value: 160},
  {name:"glucose", weight:15, value: 60},
  {name:"tin", weight:68, value: 45},
  {name:"banana", weight:27, value: 60},
  {name:"apple", weight:39, value: 40},
  {name:"cheese", weight:23, value: 30},
  {name:"beer", weight:52, value: 10},
  {name:"suntan cream", weight:11, value: 70},
  {name:"camera", weight:32, value: 30},
  {name:"T-shirt", weight:24, value: 15},
  {name:"trousers", weight:48, value: 10},
  {name:"umbrella", weight:73, value: 40},
  {name:"waterproof trousers", weight:42, value: 70},
  {name:"waterproof overclothes", weight:43, value: 75},
  {name:"note-case", weight:22, value: 80},
  {name:"sunglasses", weight:7, value: 20},
  {name:"towel", weight:18, value: 12},
  {name:"socks", weight:4, value: 50},
  {name:"book", weight:30, value: 10}
];

test("one knapsack", function() {
  var combiner = portviz.knapsack.combiner(allwants);
  var oneport = combiner.one(400);
  equal(oneport.totalValue, 1030, "correct total value");
  equal(oneport.totalWeight, 396, "correct total weight");
});

test("trivia", function() {
  var combiner = portviz.knapsack.combiner(allwants);
  var ef = combiner.ef(400, 1);
  equal(ef.length, 401, "401 because it includes the endpoints");
  ef = combiner.ef(400, 40);
  equal(ef.length, 11, "11 because it includes the endpoints");
  var expected = [
    {
      "items": [],
      "totalValue": 0,
      "totalWeight": 0
    },
    {
      "items": [
        "map",
        "glucose",
        "suntan cream",
        "socks"
      ],
      "totalValue": 330,
      "totalWeight": 39
    },
    {
      "items": [
        "map",
        "compass",
        "glucose",
        "suntan cream",
        "note-case",
        "socks"
      ],
      "totalValue": 445,
      "totalWeight": 74
    },
    {
      "items": [
        "map",
        "sandwich",
        "glucose",
        "suntan cream",
        "note-case",
        "sunglasses",
        "socks"
      ],
      "totalValue": 590,
      "totalWeight": 118
    },
    {
      "items": [
        "map",
        "compass",
        "sandwich",
        "glucose",
        "banana",
        "suntan cream",
        "note-case",
        "sunglasses",
        "socks"
      ],
      "totalValue": 685,
      "totalWeight": 158
    },
    {
      "items": [
        "map",
        "compass",
        "sandwich",
        "glucose",
        "banana",
        "suntan cream",
        "waterproof trousers",
        "note-case",
        "sunglasses",
        "socks"
      ],
      "totalValue": 755,
      "totalWeight": 200
    },
    {
      "items": [
        "map",
        "compass",
        "sandwich",
        "glucose",
        "banana",
        "suntan cream",
        "waterproof trousers",
        "waterproof overclothes",
        "note-case",
        "socks"
      ],
      "totalValue": 810,
      "totalWeight": 236
    },
    {
      "items": [
        "map",
        "compass",
        "sandwich",
        "glucose",
        "banana",
        "cheese",
        "suntan cream",
        "waterproof trousers",
        "waterproof overclothes",
        "note-case",
        "sunglasses",
        "socks"
      ],
      "totalValue": 860,
      "totalWeight": 266
    },
    {
      "items": [
        "map",
        "compass",
        "sandwich",
        "glucose",
        "banana",
        "cheese",
        "suntan cream",
        "camera",
        "waterproof trousers",
        "waterproof overclothes",
        "note-case",
        "sunglasses",
        "towel",
        "socks"
      ],
      "totalValue": 902,
      "totalWeight": 316
    },
    {
      "items": [
        "map",
        "compass",
        "water",
        "sandwich",
        "glucose",
        "banana",
        "suntan cream",
        "waterproof overclothes",
        "note-case",
        "sunglasses",
        "socks"
      ],
      "totalValue": 960,
      "totalWeight": 354
    },
    {
      "items": [
        "map",
        "compass",
        "water",
        "sandwich",
        "glucose",
        "banana",
        "suntan cream",
        "waterproof trousers",
        "waterproof overclothes",
        "note-case",
        "sunglasses",
        "socks"
      ],
      "totalValue": 1030,
      "totalWeight": 396
    }
];
  deepEqual(ef, expected);
});
