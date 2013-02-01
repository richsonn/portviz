/*global portviz:false, _:false */
/*
 * after rosettacode.org/mw/index.php?title=Knapsack_problem/0-1
 */
portviz.knapsack = {};
(function() {
  this.combiner = function(wants) {
    var _memo = (function(){
      var _mem = {};
      var _key = function(i, w) {
        return i + '::' + w;
      };
      return {
        get: function(i, w) {
          return _mem[_key(i,w)];
        },
        put: function(i, w, r) {
          _mem[_key(i,w)]=r;
          return r;
        }
      };
    })();
    var _m = function(i, w) {
      var mm = _memo.get(i,w);
      if (!_.isUndefined(mm)) {
        return mm;
      }
      if (i < 0 || w === 0) {
        // empty, base case
        return _memo.put(i, w, {items: [], totalWeight: 0, totalValue: 0});
      }
      var item = wants[i];
      if (item.weight > w) {
        // this item does not fit, try the next item
        return _memo.put(i, w, _m(i-1, w));
      }
      // this item could fit.
      // are we better off excluding it...
      var excluded = _m(i-1, w);
      // or including it it ...
      var included = _m(i-1, w-item.weight);
      if (included.totalValue + item.value > excluded.totalValue) {
        // better off including it
        // make a copy
        var i1 = included.items.slice();
        i1.push(item.name);
        return _memo.put(i, w,
          {items: i1,
           totalWeight: included.totalWeight + item.weight,
           totalValue: included.totalValue + item.value});
      }
      // better off excluding it.
      return _memo.put(i,w, excluded);
    };
    return {
      /* one point */
      one: function(maxweight) {
        return _m(wants.length - 1, maxweight);
      },
      /* the entire EF */
      ef: function(maxweight, step) {
        return _.map(_.range(0, maxweight+1, step), function(weight) {
          return _m(wants.length - 1, weight);
        });
      }
    };
  };
}).apply(portviz.knapsack);
