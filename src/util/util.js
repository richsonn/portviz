/*global _:false, MersenneTwister:false, portviz:false */
/* util functions */

portviz.money = {};
(function() {
    /**
     * @private
     */
    var _formatter = function(c, d, t) {
        return function(n) {
            // sign
            var s = n < 0 ? "-" : "";
            var i = parseInt(n = Math.abs(+n || 0).toFixed(c), 10) + "";
            var j = (j = i.length) > 3 ? j % 3 : 0;
            return s +
                (j ? i.substr(0, j) + t : "") +
                i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
                (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        };
    };
    /**
     * default formatter
     *
     * @returns {function(number) : string} 
     */
    this.fmt = function() {
        if (arguments.length !== 0) throw "wrong arg count";
        return _formatter(0, '.', ',');
    };
    /**
     * custom formatter
     *
     * @param c {Number} cents to show
     * @param d {String} decimal symbol
     * @param t {String} thousands symbol
     * @returns {function(number) : string} 
     */
    this.custom = function(c, d, t) {
        if (arguments.length !== 3) throw "wrong arg count";
        if (isNaN(c)) throw 'invalid cents';
        if (d === undefined) throw 'undefined decimal symbol';
        if (t === undefined) throw 'undefined thousands symbol';
        return _formatter(c, d, t);
    };
}).apply(portviz.money);

portviz.boxmuller = {};
(function() {
    this.newInstance = function(seed) {
        var _r = new MersenneTwister(seed);
        return {
            random: function() {
                var u = 2 * _r.random() - 1;
                var v = 2 * _r.random() - 1;
                var r = u * u + v * v;
                if(r === 0 || r > 1) return this.random();
                var c = Math.sqrt(-2 * Math.log(r) / r);
                return u*c;
            }
        };
    };
    this.vector = function(width) {
        var r = this.newInstance();
        var data = [];
        var d = 0;
        for (var i = 0; i < width; ++i) {
            d = d + r.random();
            data.push({x:i, y:d});
        }
        return data;
    };
}).apply(portviz.boxmuller);


(function() {
/**
 * Return the union of the keys of the rows.
 */
this.cols = function(rows) {
    var colhash = {};
    _.each(rows, function(row) {
        _.each(row, function(value, key) {
            colhash[key] = 1;
        });
    });

    return _.sortBy(_.keys(colhash), function(x){return x;});
};
}).apply(portviz);
