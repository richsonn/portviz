/*global portviz:false */
test("revenue time series", function() {
  var rev = [
    {'2012':1, '2013':10, 'Projects':'proj1'},
    {'2012':100, '2013':1000, 'Projects':'proj2'},
    {'2012':10000, '2013':100000, 'Projects':'proj3'}
  ];
  var ports = [
    {index:0, id:'p1',name:'ppA'},
    {index:1, id:'p2',name:'ppB'}
  ];
  var portview = {
    p1: true,
    p2: false
  };
  var membership = {
    p1_proj1: true,
    p1_proj2: true,
    p1_proj3: true,
    p2_proj1: true,
    p2_proj2: false,
    p2_proj3: false
  };
  var f = portviz.map.revenueTimeSeries(rev);
  var result = f(ports, portview, membership);
  deepEqual(result, {
    x:['2012','2013'],
    labels: ['ppA'],
    data: [
      {x:'2012', y:10101, label:'ppA'},
      {x:'2013', y:101010, label:'ppA'}
    ]
  });
});

test("launch histogram", function() {
  var projdata = [
    {Project: 'proj1', Lyear: '2017'},
    {Project: 'proj2', Lyear: '2018'},
    {Project: 'proj3', Lyear: '2018'}
  ];
  var ports = [
    {index:0, id:'p1',name:'ppA'},
    {index:1, id:'p2',name:'ppB'}
  ];
  var portview = {
    p1: true,
    p2: false
  };
  var membership = {
    p1_proj1: true,
    p1_proj2: true,
    p1_proj3: true,
    p2_proj1: true,
    p2_proj2: false,
    p2_proj3: false
  };
  var f = portviz.map.launchHist(projdata);
  var result = f(ports, portview, membership);
  /* should only include p1 */
  /* one launch in 2017 */
  /* two launches in 2018 */
  deepEqual(result, {
    x: ['2017','2018'],
    labels: ['ppA'],
    data: [
      {label: 'ppA', x:'2017', y:1},
      {label: 'ppA', x:'2018', y:2}
    ]
  });
});

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

test("revenuelines simple", function() {
  var rev = [
    {'2012':123, '2013':234, 'Projects':'proj1'},
    {'2012':124, '2013':235, 'Projects':'proj2'}
  ];
  var f = portviz.map.revenueLines(rev);
  var ports = [
    {index:0, id:'p1',name:'ppA'},
    {index:1, id:'p2',name:'ppB'}
  ];
  var portview = {
    p1: true,
    p2: false
  };
  var membership = {
    p1_proj1: true,
    p1_proj2: true,
    p2_proj1: true,
    p2_proj2: false
  };
  var result = f(ports, portview, membership);
  deepEqual(result, {
    "data": [
      {
        "label": "ppA",
        "x": "2012",
        "y": 247
      },
      {
        "label": "ppA",
        "x": "2013",
        "y": 469
      }
    ],
    "labels": [
      "ppA"
    ],
    "x": [
      2012,
      2013
    ]
  } );
});


test("revenuelines a little more", function() {
  var rev = [
    {'2012':1, '2013':2, 'Projects':'proj1'},
    {'2012':3, '2013':4, 'Projects':'proj2'}
  ];
  var f = portviz.map.revenueLines(rev);
  var ports = [
    {index:0, id:'p1',name:'ppA'},
    {index:1, id:'p2',name:'ppB'},
    {index:1, id:'p3',name:'ppC'}
  ];
  var portview = {
    p1: true,
    p2: true,
    p3: true
  };
  var membership = {
    p1_proj1: true,
    p1_proj2: true,
    p2_proj1: false,
    p2_proj2: false,
    p3_proj1: true,
    p3_proj2: false
  };
  var result = f(ports, portview, membership);
  deepEqual(result, {
    "data": [
      {
        "label": "ppA",
        "x": "2012",
        "y": 4
      },
      {
        "label": "ppA",
        "x": "2013",
        "y": 6
      },
      {
        "label": "ppC",
        "x": "2012",
        "y": 1
      },
      {
        "label": "ppC",
        "x": "2013",
        "y": 2
      }
    ],
    "labels": [
      "ppA",
      "ppB",
      "ppC"
    ],
    "x": [
      2012,
      2013
    ]
    } );
});
