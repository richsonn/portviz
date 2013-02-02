/*global portviz:false, _:false */
/*
 * after rosettacode.org/mw/index.php?title=Knapsack_problem/0-1
 *
 * approximation: http://math.mit.edu/~goemans/18434S06/knapsack-katherine.pdf
 */
portviz.knapsack = {};
(function() {
  this.combiner = function(items, weightfn, valuefn) {
    // total value >= (1-e) * the optimal value
    // i.e. e=0.1, get over 90% of the optimal
    var _epsilon = 0.01;
    var _p = _.max(_.map(items,valuefn));
    var _k = _epsilon * _p / items.length;

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
          //console.log('put ' + i + ' ' + w);
          //console.log(r);
          _mem[_key(i,w)]=r;
          return r;
        }
      };
    })();
    var _m = function(i, w) {
      //console.log('item ' + i + ' weight ' + w);

      i = Math.round(i);
      w = Math.round(w);


      if (i < 0 || w === 0) {
        //console.log('empty, base case');
        //return _memo.put(i, w, {items: [], totalWeight: 0, totalValue: 0});
        return {items: [], totalWeight: 0, totalValue: 0};
      }

      var mm = _memo.get(i,w);
      if (!_.isUndefined(mm)) {
        //console.log('from memo');
        return mm;
      }

      var item = items[i];
      if (weightfn(item) > w) {
        //console.log('item does not fit, try the next item');
        return _memo.put(i, w, _m(i-1, w));
      }
      // this item could fit.
      //console.log('are we better off excluding it?')
      var excluded = _m(i-1, w);
      //console.log('or including it?')
      var included = _m(i-1, w - weightfn(item));
      if (included.totalValue + Math.floor(valuefn(item)/_k) > excluded.totalValue) {
        //console.log('better off including it');
        // make a copy of the list
        var i1 = included.items.slice();
        i1.push(item);
        return _memo.put(i, w,
          {items: i1,
           totalWeight: included.totalWeight + weightfn(item),
           totalValue: included.totalValue + Math.floor(valuefn(item)/_k)});
      }
      //console.log('better off excluding it.');
      return _memo.put(i,w, excluded);
    };
    return {
      /* one point */
      one: function(maxweight) {
        var scaled = _m(items.length - 1, maxweight);
        return {
          items: scaled.items,
          totalWeight: scaled.totalWeight,
          totalValue: scaled.totalValue * _k
        };
      },
      /* the entire EF */
      ef: function(maxweight, step) {
        return _.map(_.range(0, maxweight+1, step), function(weight) {
          //console.log("weight: " + weight);
          var scaled = _m(items.length - 1, weight);
          return {
            items: scaled.items,
            totalWeight: scaled.totalWeight,
            totalValue: scaled.totalValue * _k
          };
          //return _m(items.length - 1, weight);
        });
      }
    };
  };
}).apply(portviz.knapsack);
