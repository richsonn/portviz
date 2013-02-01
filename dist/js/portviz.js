/**
 * See github.com/cparker15/csv-to-json
 *
 * csv-to-json: A utility that converts data format from CSV to JSON.
 * Copyright (C) 2009-2012 Christopher Parker <http://www.cparker15.com/>
 * 
 * csv-to-json is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * csv-to-json is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with csv-to-json.  If not, see <http://www.gnu.org/licenses/>.
 */



function fixSplitsInsideQuotes(line) {
    for (var i = 0; i < line.length; i++) {
        var chunk = line[i].replace(/^[\s]*|[\s]*$/g, "");
        var quote = "";
        if (chunk.charAt(0) === '"' || chunk.charAt(0) === "'") {
            quote = chunk.charAt(0);
        }
        if (quote !== "" && chunk.charAt(chunk.length - 1) === quote) {
            quote = "";
        }
        if (quote !== "") {
            var j = i + 1;

            if (j < line.length) {
                chunk = line[j].replace(/^[\s]*|[\s]*$/g, "");
            }

            while (j < line.length && chunk.charAt(chunk.length - 1) !== quote) {
                line[i] += ',' + line[j];
                line.splice(j, 1);
                chunk = line[j].replace(/[\s]*$/g, "");
            }

            if (j < line.length) {
                line[i] += ',' + line[j];
                line.splice(j, 1);
            }
        }
    }
}

function trimWhitespace(line) {
    for (var i = 0; i < line.length; i++) {
        line[i] = line[i].replace(/^[\s]*|[\s]*$/g, "");
    }
}

function trimQuotes(line) {
    for (var i = 0; i < line.length; i++) {
        if (line[i].charAt(0) === '"') {
            line[i] = line[i].replace(/^"|"$/g, "");
        } else if (line[i].charAt(0) === "'") {
            line[i] = line[i].replace(/^'|'$/g, "");
        }
    }
}

function removeEmptyRows(csvRows) {
    var output = [];
    for (var i = 0; i < csvRows.length; i++) {
        if (csvRows[i].replace(/^[\s]*|[\s]*$/g, '') !== "") {
            output.push(csvRows[i]);
        }
    }
    return output;
}

function parseCSVLine(wholeline) {
    var line = wholeline.split(',');
    fixSplitsInsideQuotes(line);
    trimWhitespace(line);
    trimQuotes(line);
    return line;
}

function parseRows(csvRows) {
    var fields = [];
    for (var i = 0; i < csvRows.length; i++) {
        fields[i] = parseCSVLine(csvRows[i]);
    }
    return fields;
}

function convertToJson(fields) {
    var objArr = [];
    for (var i = 1; i < fields.length; i++) {
        if (fields[i].length > 0) {
             objArr.push({});
        }
        for (var j = 0; j < fields[i].length; j++) {
            objArr[i - 1][fields[0][j]] = fields[i][j];
        }
    }
    return objArr;
}


/** 
 * @throws if malformed input
 * @returns {Array} Array of js objects 
 */
function csvToJson (csvText) {
    if (csvText === "") { throw("empty input"); }
    var csvRows = removeEmptyRows(csvText.split(/[\r\n]/g));
    if (csvRows.length < 2) { throw("missing header"); }
    var fields = parseRows(csvRows);
    var objArr = convertToJson(fields);
    //var jsonText = JSON.stringify(objArr, null, "\t");
    //return jsonText;
    return objArr;
}


/*
  I've wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
  so it's better encapsulated. Now you can have multiple random number generators
  and they won't stomp all over eachother's state.
  
  If you want to use this as a substitute for Math.random(), use the random()
  method like so:
  
  var m = new MersenneTwister();
  var randomNumber = m.random();
  
  You can also call the other genrand_{foo}() methods on the instance.

  If you want to use a specific seed in order to get a repeatable random
  sequence, pass an integer into the constructor:

  var m = new MersenneTwister(123);

  and that will always produce the same random sequence.

  Sean McCullough (banksean@gmail.com)
*/

/* 
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.
 
   Before using, initialize the state by using init_genrand(seed)  
   or init_by_array(init_key, key_length).
 
   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.                          
 
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:
 
     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
 
     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
 
     3. The names of its contributors may not be used to endorse or promote 
        products derived from this software without specific prior written 
        permission.
 
   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 
 
   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

var MersenneTwister = function(seed) {
  if (seed === undefined) {
    seed = new Date().getTime();
  } 
  /* Period parameters */  
  this.N = 624;
  this.M = 397;
  this.MATRIX_A = 0x9908b0df;   /* constant vector a */
  this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
  this.LOWER_MASK = 0x7fffffff; /* least significant r bits */
 
  this.mt = new Array(this.N); /* the array for the state vector */
  this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

  this.init_genrand(seed);
}  ;
 
/* initializes mt[N] with a seed */
MersenneTwister.prototype.init_genrand = function(s) {
  this.mt[0] = s >>> 0;
  for (this.mti=1; this.mti<this.N; this.mti++) {
    s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
    this.mt[this.mti] =
      (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
    this.mt[this.mti] >>>= 0;
      /* for >32 bit machines */
  }
} ;
 
/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
  var i, j, k;
  this.init_genrand(19650218);
  i=1; j=0;
  k = (this.N>key_length ? this.N : key_length);
  var s = 0;
  for (; k; k--) {
    s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
    this.mt[i] =
      (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + init_key[j] + j; /* non linear */
    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
    i++; j++;
    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
    if (j>=key_length) j=0;
  }
  for (k=this.N-1; k; k--) {
    s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
    this.mt[i] =
      (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i; /* non linear */
    this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
    i++;
    if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
  }

  this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */ 
} ;
 
/* generates a random number on [0,0xffffffff]-interval */
MersenneTwister.prototype.genrand_int32 = function() {
  var y;
  var mag01 = new Array(0x0, this.MATRIX_A);
  /* mag01[x] = x * MATRIX_A  for x=0,1 */

  if (this.mti >= this.N) { /* generate N words at one time */
    var kk;

    if (this.mti === this.N+1)   /* if init_genrand() has not been called, */
      this.init_genrand(5489); /* a default initial seed is used */

    for (kk=0;kk<this.N-this.M;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    for (;kk<this.N-1;kk++) {
      y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
      this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
    }
    y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
    this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

    this.mti = 0;
  }

  y = this.mt[this.mti++];

  /* Tempering */
  y ^= (y >>> 11);
  y ^= (y << 7) & 0x9d2c5680;
  y ^= (y << 15) & 0xefc60000;
  y ^= (y >>> 18);

  return y >>> 0;
};
 
/* generates a random number on [0,0x7fffffff]-interval */
MersenneTwister.prototype.genrand_int31 = function() {
  return (this.genrand_int32()>>>1);
};
 
/* generates a random number on [0,1]-real-interval */
MersenneTwister.prototype.genrand_real1 = function() {
  return this.genrand_int32()*(1.0/4294967295.0); 
  /* divided by 2^32-1 */ 
};

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function() {
  return this.genrand_int32()*(1.0/4294967296.0); 
  /* divided by 2^32 */
};
 
/* generates a random number on (0,1)-real-interval */
MersenneTwister.prototype.genrand_real3 = function() {
  return (this.genrand_int32() + 0.5)*(1.0/4294967296.0); 
  /* divided by 2^32 */
};
 
/* generates a random number on [0,1) with 53-bit resolution*/
MersenneTwister.prototype.genrand_res53 = function() { 
  var a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6; 
  return(a*67108864.0+b)*(1.0/9007199254740992.0); 
} ;

/* These real versions are due to Isaku Wada, 2002/01/09 added */

// TODO: get rid of this
window.App = {};

/*global App:false, _:false, MersenneTwister:false */
/* util functions */

var money = {};
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
}).apply(money);

var boxmuller = {};
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
}).apply(boxmuller);


// TODO: move the functions below into modules.

/**
 * Return the union of the keys of the rows.
 * @param {Array}
 */
App.cols = function(rows) {
    var colhash = {};
    _.each(rows, function(row) {
        _.each(row, function(value, key) {
            colhash[key] = 1;
        });
    });

    return _.sortBy(_.keys(colhash), function(x){return x;});
};

App.projnames = function() {
    return _.map(App.projSumList.toJSON(), function(row) {
        return row.Project;
    });
};

/*global App:false, _:false */
/*
 * Map domain models to view (i.e. chart) models.
 *
 * not really sure how this should work.  it's a sketch.
 *
 * TODO: add axis labeling to the mapping, since it's really part of the "view of the data".
 */

var map = {};
(function() {
/*
 * produces one series, for use with the 'scatter' chart
 * x = portfolio cost, y = portfolio ENPV
 * you could use this with an 'optimizer' to make a pareto curve, thus the name.
 * but for now it just takes whatever portfolios exist.
 */
this.pareto = function(pd) {
    var proj = pd.toJSON();
    // first make a list of random portfolios.
    // not the most efficient or accurate way. :-)
    var randomports = _.map(_.range(5000), function(r) {
        // randomly ordered projects
        var shuffled = _.shuffle(proj);
        // choose a random number of projects
        var choose = _.random(proj.length);
        var chosen = _.first(shuffled, choose);
        // find its total cost and best enpv
        var totalcost = 0;
        var totalexpectednpv = 0 ;
        var totalbestnpv = 0;
        _.each(chosen, function(ppp){
            totalcost += +ppp.Lcost;
            totalexpectednpv += +ppp.ENPV;
            totalbestnpv += +ppp.NPV;
        });
        return {
            x: totalcost,
            best: totalbestnpv,
            expected: totalexpectednpv
        };
    });
    // now sort the ports by cost
    var sortedports = _.sortBy(randomports, function(p) {
        return p.x;
    });
    // now put the frontier ones in there
    var paretoexpectedports = [];
    var paretobestports = [];
    _.each(sortedports, function(s) {
        if (_.isEmpty(paretobestports) ||
            (s.best > _.last(paretobestports).y)) paretobestports.push({ x:s.x, y:s.best});

        if (_.isEmpty(paretoexpectedports) ||
            (s.expected > _.last(paretoexpectedports).y)) paretoexpectedports.push({x:s.x, y:s.expected});
    });


    return function(ports, portview, membership) {
        return {
            frontiers: {
                expected: paretoexpectedports,
                best: paretobestports
            },
            ports: _.map(
            _.filter(ports, function(port) { return portview[port.id]; }),
            function(port) {
                var totalcost = 0;
                var totalbestnpv = 0;  // best case
                var totalenpv = 0; // expected case
                var totalworstnpv = 0; // worst case: all the cost, none of the revenue
                _.each(_.filter(proj, function(row) {
                    var key = port.id + '_' + row.Project;
                    return _.has(membership, key) ? membership[key] : false;
                }), function(row) {
                    totalcost += +row.Lcost;
                    totalenpv += +row.ENPV;
                    totalbestnpv += +row.NPV;
                    totalworstnpv -= +row.Lcost;
                });
                return {x: totalcost,
                        yexpected: totalenpv,
                        ybest: totalbestnpv,
                        yworst: totalworstnpv,
                        label: port.name,
                        index: port.index} ;
            })
        };
    };
};

/*
 * @param {App.ProjectRevenues} inp [{Projects:x, 2012:y, ...},...]
 * @returns {Array} [{x: year, y: yearsum}, ...]
 */
this.revenueTimeSeries = function(inp) {
    var dataset = inp.toJSON();
    var years = _.without(App.cols(dataset), 'Projects');
    var data = _.map(years, function(year) {
        var colsum = _.reduce(dataset,
            function(memo, x) {
                return memo + Number(x[year]);
            }, 0);
        return {x: year, y: colsum};
    });
    return function() {
        return data;
    };
};

/*
 * @param {App.ProjectRevenues} inp [{Projects:x, 2012:y, ...},...]
 * @returns
 *     [{x: year, y: [{label: label, value: value},...]},...]
 */
this.revenueTimeSeriesGrouped = function(inp) {
    var dataset = inp.toJSON();
    var years = _.without(App.cols(dataset), 'Projects');
    var data = _.map(years, function(year) {
        var col = _.map(dataset,
            function(x) {
                return {label: x.Projects, value: +x[year]};
            });

        var foo = {x: year, y: col};
        return foo;
    });
    return function() {
        return data;
    };
};

/* 
 * @param {App.ProjectRevenues} inp [{Projects:x, 2012:y, ...},...]
 * @param {App.RevenueTargets} inp [{Label: x, 2012:y, ...},...]
 * @returns {
 *     x: [x, x, x,...],
 *     bars: {
 *         labels: [label, label, label, ...],
 *         data: [ { x: x, y: y, label: label},... ]
 *     },
 *     lines: {
 *         labels: [label, label, label, ...],
 *         data: [ { x: x, y: y, label: label},... ] 
 *     }
 * } 
 */
this.revenueTimeSeriesGroupedWithTarget = function(rev,tgt) {
    var revdataset = rev.toJSON();
    var tgtdataset = tgt.toJSON();

    var years = _.map(_.union(_.without(App.cols(revdataset), 'Projects'),
                       _.without(App.cols(tgtdataset), 'Label')), function(x){return +x;}).sort();

    var result = {};
    result.x = years;

    result.bars = {};
    result.bars.labels = _.pluck(revdataset, 'Projects').sort();
    result.bars.data = _.flatten(_.map(revdataset, function(row) {
        return _.map(_.without(_.keys(row), 'Projects'), function(key) {
            return {x: key, y: +row[key], label: row.Projects};
        });
    }));

    result.lines = {};
    result.lines.labels = _.pluck(tgtdataset, 'Label').sort();
    result.lines.data = _.flatten(_.map(tgtdataset, function(row) {
        return _.map(_.without(_.keys(row), 'Label'), function(key) {
            return {x: key, y: +row[key], label: row.Label};
        });
    }));

    return function() {
        return result;
    };
};

/* 
 * project revenue + portfolio membership
 *
 * for now, just pick randomly.
 *
 * @param {membership} member  ... ?
 * @param {App.ProjectRevenues} rev [{Projects:x, 2012:y, ...},...]
 * @returns {
 *     x: [x, x, x,...],
 *     labels: [label, label, label, ...],
 *     data: [ { x: x, y: y, label: label},... ] 
 * } 
 */
this.revenueLines = function(rev) {
    var revdataset = rev.toJSON();

    var years = _.map(_.without(App.cols(revdataset), 'Projects'),function(x){return +x;}).sort();
    var result = {};
    result.x = years;

    // TODO: use a real membership object
    var membership = [
        {
             portfolio: 'Portfolio 1',
             contains: function(project) { return Math.random() > 0.6; }
         },
        {
             portfolio: 'Portfolio 2',
             contains: function(project) { return Math.random() > 0.4; }
        }
    ];

    result.labels = _.pluck(membership, 'portfolio').sort();
    //result.labels = _.pluck(revdataset, 'Projects').sort();

    // sum over label, i.e. group by year
    result.data = _.flatten(_.map(membership, function(port) {
        var series = {};
        _.each(revdataset, function(row) {
            if (port.contains(row.Projects)) {
                _.each(_.without(_.keys(row), 'Projects'), function(year) {
                    if (!_.has(series, year)) series[year] = 0;
                    series[year] += +row[year];
                });
            }
        });
        return _.map(_.keys(series), function(year) {
            return {x: year, y:series[year], label: port.portfolio};
        });
    }));

    return function() {
        return result;
    };
};

/*
 * @returns [
 *     {
 *       label: label,
 *       data: [{projdata},...]
 *     },
 *     {
 *       label: label,
 *       data: [{projdata},...]
 *     }, ...
 * ]
 */
this.bubble = function(pd) {
    // this is all projects.
    var proj = pd.toJSON();


    /*
     * @param ports {ui.portconf} ALL ports ... maybe should use a singleton instead
     * @param portview {portid} portfolios turned on
     * @param membership {portid_projname,...} projects turned on per port
     */
    return function(ports, portview, membership) {
        return _.map(
            _.filter( ports, function(port) { return portview[port.id] ; }), function(port) {
                return {
                    label: port.name,
                    index: port.index,
                    data:  _.filter(proj, function(row) {
                        var key = port.id + '_' + row.Project;
                        return _.has(membership, key) ? membership[key] : false;
                    })
                };
            }
        );
    };
};

/*
 * for now, x is 'Stage', y is 'TA', label is 'Project'
 * TODO: make these fields configurable
 *
 * @param proj [{Project: foo, Stage: bar, TA: blah,...},...]
 * @returns 
 * [ { portname: (portfolio),
 *     portdata: {
 *     x: [x,x,x,...]
 *     y: [y,y,y,...]
 *     data: [{x:x, y:y, label: label},...]
 * } }, ... ]
 */
this.bingo = function(pd) {
    var proj = pd.toJSON();

    /*
     * @param ports {ui.portconf} ALL ports ... maybe should use a singleton instead
     * @param portview {portid} portfolios turned on
     * @param membership {portid_projname,...} projects turned on per port
     */
    return function(ports, portview, membership) {
        return _.map(
            _.filter( ports, function(port) {return portview[port.id] ; }), function(mrow) {
                return {
                    portname: mrow.name,
                    portdata: {
                        x:  [ 'Preclinical', 'Phase 1', 'Phase 2', 'Phase 3', 'NDA', 'Market' ],
                        y: _.uniq(_.pluck(proj, 'TA')).sort(),
                        data: _.map(
                            _.filter(proj, function(row) {
                                var key = mrow.id + '_' + row.Project;
                                return _.has(membership, key) ? membership[key] : false;
                            }), function(d) {
                                return {x: d.Stage, y: d.TA, label: d.Project};
                            }
                        )
                    }
                };
            }
        );
    };
};

this.table = function(psl) {
    return function() {
        return psl;
    };
};

}).apply(map);

/*
 * dumps from the app 
 *
 * TODO: store this elsewhere, e.g. Cloudant.
 */

var sampledata = {};

(function() {

// rich made this
this.proj = 
[{"Project":"Avniman","Stage":"Phase 2","TA":"CNS","Grade":"B","Sched_Status":"1: Ahead of Plan","Fin_Status":"1: Under Budget","Fit":"3: Fair","Ptype":"Business Development","Funding":"Potential","NPV":"521.4","Plaunch":"0.25","ENPV":"228.6","Lyear":"2017","PeakSales":"4320","Lcost":"160"},{"Project":"Creficil","Stage":"NDA","TA":"Endocrine Disorder","Grade":"A","Sched_Status":"3: Behind Plan","Fin_Status":"1: Under Budget","Fit":"2: Good","Ptype":"Internal Development","Funding":"Funded","NPV":"339.8","Plaunch":"0.23","ENPV":"76.8","Lyear":"2015","PeakSales":"2160","Lcost":"224"},{"Project":"Eaglogen","Stage":"Market","TA":"Endocrine Disorder","Grade":"A","Sched_Status":"2: On Plan","Fin_Status":"2: On Budget","Fit":"4: Poor","Ptype":"In-Market","Funding":"Funded","NPV":"4736.3","Plaunch":"0.34","ENPV":"1602.2","Lyear":"2015","PeakSales":"24337.4","Lcost":"155"},{"Project":"Estger","Stage":"Phase 1","TA":"Immunology","Grade":"A","Sched_Status":"3: Behind Plan","Fin_Status":"2: On Budget","Fit":"3: Fair","Ptype":"Internal Development","Funding":"Funded","NPV":"902.4","Plaunch":"0.25","ENPV":"226.3","Lyear":"2015","PeakSales":"3930","Lcost":"350"},{"Project":"Holitorcitus","Stage":"Phase 2","TA":"Immunology","Grade":"A","Sched_Status":"3: Behind Plan","Fin_Status":"1: Under Budget","Fit":"3: Fair","Ptype":"Internal Development","Funding":"Funded","NPV":"2066.6","Plaunch":"0.36","ENPV":"740.9","Lyear":"2015","PeakSales":"9000","Lcost":"230"},{"Project":"Masogen","Stage":"Phase 1","TA":"Immunology","Grade":"A","Sched_Status":"2: On Plan","Fin_Status":"1: Under Budget","Fit":"2: Good","Ptype":"Internal Development","Funding":"Potential","NPV":"376.3","Plaunch":"0.17","ENPV":"64.5","Lyear":"2015","PeakSales":"1260","Lcost":"50"},{"Project":"Matisem","Stage":"Phase 1","TA":"Endocrine Disorder","Grade":"A","Sched_Status":"1: Ahead of Plan","Fin_Status":"2: On Budget","Fit":"2: Good","Ptype":"Business Development","Funding":"Potential","NPV":"1080.1","Plaunch":"0.26","ENPV":"283.7","Lyear":"2015","PeakSales":"4704","Lcost":"75"},{"Project":"Meprylol","Stage":"Phase 1","TA":"Dermatology","Grade":"A","Sched_Status":"2: On Plan","Fin_Status":"1: Under Budget","Fit":"1: Excellent","Ptype":"Business Development","Funding":"Funded","NPV":"268.8","Plaunch":"0.33","ENPV":"89.5","Lyear":"2015","PeakSales":"900","Lcost":"125"},{"Project":"Mervisil","Stage":"Market","TA":"Immunology","Grade":"A","Sched_Status":"1: Ahead of Plan","Fin_Status":"1: Under Budget","Fit":"2: Good","Ptype":"In-Market","Funding":"Funded","NPV":"358.4","Plaunch":"0.97","ENPV":"347.7","Lyear":"2015","PeakSales":"1200","Lcost":"214"},{"Project":"Metaphysis","Stage":"Phase 2","TA":"Immunology","Grade":"C","Sched_Status":"1: Ahead of Plan","Fin_Status":"1: Under Budget","Fit":"1: Excellent","Ptype":"Internal Development","Funding":"Funded","NPV":"722.3","Plaunch":"0.7","ENPV":"504.4","Lyear":"2015","PeakSales":"3282","Lcost":"42"},{"Project":"Mrilipzor","Stage":"Phase 3","TA":"CNS","Grade":"B","Sched_Status":"4: Critically Behind Plan","Fin_Status":"1: Under Budget","Fit":"2: Good","Ptype":"Internal Development","Funding":"Funded","NPV":"1009.1","Plaunch":"0.22","ENPV":"218.5","Lyear":"2015","PeakSales":"3900","Lcost":"422"},{"Project":"Mritigen","Stage":"Phase 1","TA":"CNS","Grade":"A","Sched_Status":"3: Behind Plan","Fin_Status":"2: On Budget","Fit":"2: Good","Ptype":"Internal Development","Funding":"Funded","NPV":"688.9","Plaunch":"0.3","ENPV":"207.9","Lyear":"2015","PeakSales":"3000","Lcost":"322"},{"Project":"Nifilmox","Stage":"Phase 2","TA":"Ophthalmology","Grade":"B","Sched_Status":"3: Behind Plan","Fin_Status":"2: On Budget","Fit":"3: Fair","Ptype":"Internal Development","Funding":"Potential","NPV":"1033.3","Plaunch":"0.25","ENPV":"257.2","Lyear":"2015","PeakSales":"4500","Lcost":"541"},{"Project":"OpthTank","Stage":"Phase 1","TA":"Ophthalmology","Grade":"A","Sched_Status":"2: On Plan","Fin_Status":"1: Under Budget","Fit":"2: Good","Ptype":"Business Development","Funding":"Potential","NPV":"268.8","Plaunch":"0.19","ENPV":"52.3","Lyear":"2015","PeakSales":"900","Lcost":"322"},{"Project":"Polgen","Stage":"Phase 3","TA":"Immunology","Grade":"B","Sched_Status":"3: Behind Plan","Fin_Status":"2: On Budget","Fit":"2: Good","Ptype":"Internal Development","Funding":"Potential","NPV":"632.4","Plaunch":"0.25","ENPV":"158.4","Lyear":"2015","PeakSales":"2754","Lcost":"333"},{"Project":"Prototase","Stage":"Phase 2","TA":"Endocrine Disorder","Grade":"A","Sched_Status":"3: Behind Plan","Fin_Status":"4: Critically Over Budget","Fit":"2: Good","Ptype":"Business Development","Funding":"Funded","NPV":"910","Plaunch":"0.22","ENPV":"196.1","Lyear":"2015","PeakSales":"3900","Lcost":"444"},{"Project":"Refevel","Stage":"Phase 2","TA":"CNS","Grade":"A","Sched_Status":"3: Behind Plan","Fin_Status":"1: Under Budget","Fit":"2: Good","Ptype":"Business Development","Funding":"Funded","NPV":"267.7","Plaunch":"0.25","ENPV":"65","Lyear":"2017","PeakSales":"1200","Lcost":"34.5"},{"Project":"Reflitol","Stage":"NDA","TA":"CNS","Grade":"A","Sched_Status":"1: Ahead of Plan","Fin_Status":"2: On Budget","Fit":"1: Excellent","Ptype":"Internal Development","Funding":"Funded","NPV":"1047.1","Plaunch":"0.2","ENPV":"212.9","Lyear":"2015","PeakSales":"4800","Lcost":"42"},{"Project":"Resdexel","Stage":"Preclinical","TA":"Endocrine Disorder","Grade":"A","Sched_Status":"4: Critically Behind Plan","Fin_Status":"1: Under Budget","Fit":"4: Poor","Ptype":"Internal Development","Funding":"Funded","NPV":"528.3","Plaunch":"0.19","ENPV":"97.7","Lyear":"2020","PeakSales":"4500","Lcost":"123"},{"Project":"Rilopof","Stage":"Phase 1","TA":"CNS","Grade":"A","Sched_Status":"1: Ahead of Plan","Fin_Status":"1: Under Budget","Fit":"2: Good","Ptype":"Internal Development","Funding":"Potential","NPV":"868.8","Plaunch":"0.22","ENPV":"191.7","Lyear":"2012","PeakSales":"2700","Lcost":"32"},{"Project":"Rydovanil","Stage":"Phase 1","TA":"CNS","Grade":"A","Sched_Status":"3: Behind Plan","Fin_Status":"1: Under Budget","Fit":"3: Fair","Ptype":"Internal Development","Funding":"Potential","NPV":"310.4","Plaunch":"0.27","ENPV":"66.3","Lyear":"2021","PeakSales":"2400","Lcost":"167.5"},{"Project":"Rytifil","Stage":"NDA","TA":"Ophthalmology","Grade":"B","Sched_Status":"3: Behind Plan","Fin_Status":"1: Under Budget","Fit":"3: Fair","Ptype":"Internal Development","Funding":"Funded","NPV":"361.4","Plaunch":"0.94","ENPV":"339.7","Lyear":"2012","PeakSales":"840","Lcost":"32"},{"Project":"Tikofermin","Stage":"Phase 3","TA":"Dermatology","Grade":"A","Sched_Status":"2: On Plan","Fin_Status":"1: Under Budget","Fit":"2: Good","Ptype":"Business Development","Funding":"Funded","NPV":"1262.6","Plaunch":"0.63","ENPV":"794.1","Lyear":"2012","PeakSales":"2160","Lcost":"111"},{"Project":"Trivlexin","Stage":"Phase 3","TA":"Endocrine Disorder","Grade":"A","Sched_Status":"3: Behind Plan","Fin_Status":"1: Under Budget","Fit":"3: Fair","Ptype":"Business Development","Funding":"Funded","NPV":"1024.5","Plaunch":"0.6","ENPV":"581.3","Lyear":"2015","PeakSales":"4800","Lcost":"127.1"},{"Project":"Varmenase","Stage":"Phase 2","TA":"Endocrine Disorder","Grade":"A","Sched_Status":"2: On Plan","Fin_Status":"1: Under Budget","Fit":"4: Poor","Ptype":"Business Development","Funding":"Funded","NPV":"1694.6","Plaunch":"0.32","ENPV":"544.1","Lyear":"2015","PeakSales":"7380","Lcost":"66"},{"Project":"Virtiman","Stage":"Preclinical","TA":"Immunology","Grade":"A","Sched_Status":"4: Critically Behind Plan","Fin_Status":"1: Under Budget","Fit":"1: Excellent","Ptype":"Internal Development","Funding":"Funded","NPV":"350.5","Plaunch":"0.26","ENPV":"76.4","Lyear":"2023","PeakSales":"3600","Lcost":"107.5"},{"Project":"Vrexigen","Stage":"Phase 1","TA":"CNS","Grade":"B","Sched_Status":"2: On Plan","Fin_Status":"2: On Budget","Fit":"4: Poor","Ptype":"Internal Development","Funding":"Funded","NPV":"-8.8","Plaunch":"0.16","ENPV":"-46.3","Lyear":"2020","PeakSales":"900","Lcost":"299.2"},{"Project":"Vrilimen","Stage":"Phase 1","TA":"Ophthalmology","Grade":"B","Sched_Status":"3: Behind Plan","Fin_Status":"1: Under Budget","Fit":"2: Good","Ptype":"Internal Development","Funding":"Funded","NPV":"353.1","Plaunch":"0.32","ENPV":"93.6","Lyear":"2019","PeakSales":"3000","Lcost":"185.9"},{"Project":"Weglifil","Stage":"Phase 1","TA":"Immunology","Grade":"B","Sched_Status":"2: On Plan","Fin_Status":"1: Under Budget","Fit":"2: Good","Ptype":"Internal Development","Funding":"Funded","NPV":"593.2","Plaunch":"0.18","ENPV":"97.4","Lyear":"2020","PeakSales":"4800","Lcost":"77.1"},{"Project":"Xumanase","Stage":"Preclinical","TA":"CNS","Grade":"A","Sched_Status":"3: Behind Plan","Fin_Status":"1: Under Budget","Fit":"2: Good","Ptype":"Internal Development","Funding":"Funded","NPV":"1239.9","Plaunch":"0.09","ENPV":"113","Lyear":"2015","PeakSales":"5400","Lcost":"99"},{"Project":"Xyfigil","Stage":"Phase 1","TA":"Endocrine Disorder","Grade":"B","Sched_Status":"2: On Plan","Fin_Status":"1: Under Budget","Fit":"1: Excellent","Ptype":"Internal Development","Funding":"Funded","NPV":"3.4","Plaunch":"0.29","ENPV":"-35.2","Lyear":"2022","PeakSales":"1188","Lcost":"302.2"},{"Project":"Zerxil","Stage":"Phase 3","TA":"Endocrine Disorder","Grade":"A","Sched_Status":"2: On Plan","Fin_Status":"1: Under Budget","Fit":"1: Excellent","Ptype":"Internal Development","Funding":"Funded","NPV":"172.2","Plaunch":"0.93","ENPV":"158.5","Lyear":"2014","PeakSales":"600","Lcost":"46.1"}];


// rich made this
this.rev =
[{"2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"300","2019":"1200","2020":"3000","2021":"4200","2022":"4320","Projects":"Avniman"},{"2013":"0","2014":"0","2015":"544","2016":"2160","2017":"1784","2018":"550","2019":"156","2020":"30","2021":"6","2022":"1","Projects":"Creficil"},{"2013":"0","2014":"0","2015":"0","2016":"2341","2017":"5388","2018":"9753","2019":"16482","2020":"18150","2021":"20001","2022":"22055","Projects":"Eaglogen"},{"2013":"0","2014":"0","2015":"655","2016":"1965","2017":"3275","2018":"3930","2019":"3930","2020":"2358","2021":"98","2022":"0","Projects":"Estger"},{"2013":"0","2014":"0","2015":"1500","2016":"4500","2017":"7500","2018":"9000","2019":"9000","2020":"5400","2021":"225","2022":"0","Projects":"Holitorcitus"},{"2013":"0","2014":"0","2015":"210","2016":"630","2017":"1050","2018":"1260","2019":"1260","2020":"1134","2021":"882","2022":"630","Projects":"Masogen"},{"2013":"0","2014":"0","2015":"784","2016":"2352","2017":"3920","2018":"4704","2019":"4704","2020":"2822","2021":"118","2022":"0","Projects":"Matisem"},{"2013":"0","2014":"0","2015":"150","2016":"450","2017":"750","2018":"900","2019":"900","2020":"810","2021":"630","2022":"450","Projects":"Meprylol"},{"2013":"0","2014":"0","2015":"200","2016":"600","2017":"1000","2018":"1200","2019":"1200","2020":"1080","2021":"840","2022":"600","Projects":"Mervisil"},{"2013":"0","2014":"0","2015":"547","2016":"1641","2017":"2735","2018":"3282","2019":"3282","2020":"1969","2021":"82","2022":"0","Projects":"Metaphysis"},{"2013":"0","2014":"0","2015":"975","2016":"2925","2017":"3900","2018":"3900","2019":"3900","2020":"2340","2021":"97","2022":"0","Projects":"Mrilipzor"},{"2013":"0","2014":"0","2015":"500","2016":"1500","2017":"2500","2018":"3000","2019":"3000","2020":"1800","2021":"75","2022":"0","Projects":"Mritigen"},{"2013":"0","2014":"0","2015":"750","2016":"2250","2017":"3750","2018":"4500","2019":"4500","2020":"2700","2021":"112","2022":"0","Projects":"Nifilmox"},{"2013":"0","2014":"0","2015":"150","2016":"450","2017":"750","2018":"900","2019":"900","2020":"810","2021":"630","2022":"450","Projects":"OpthTank"},{"2013":"0","2014":"0","2015":"459","2016":"1377","2017":"2295","2018":"2754","2019":"2754","2020":"1652","2021":"69","2022":"0","Projects":"Polgen"},{"2013":"0","2014":"0","2015":"650","2016":"1950","2017":"3250","2018":"3900","2019":"3900","2020":"2535","2021":"251","2022":"0","Projects":"Prototase"},{"2013":"0","2014":"0","2015":"0","2016":"0","2017":"200","2018":"600","2019":"1000","2020":"1200","2021":"1200","2022":"1080","Projects":"Refevel"},{"2013":"0","2014":"0","2015":"800","2016":"2400","2017":"4000","2018":"4800","2019":"4800","2020":"2880","2021":"120","2022":"0","Projects":"Reflitol"},{"2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"750","2021":"2250","2022":"3750","Projects":"Resdexel"},{"2013":"1350","2014":"2250","2015":"2700","2016":"2700","2017":"1620","2018":"68","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Rilopof"},{"2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"600","2022":"1800","Projects":"Rydovanil"},{"2013":"420","2014":"700","2015":"840","2016":"840","2017":"840","2018":"714","2019":"462","2020":"210","2021":"14","2022":"0","Projects":"Rytifil"},{"2013":"1080","2014":"1800","2015":"2160","2016":"2160","2017":"2160","2018":"2160","2019":"2160","2020":"2030","2021":"1771","2022":"1512","Projects":"Tikofermin"},{"2013":"0","2014":"0","2015":"800","2016":"2400","2017":"4000","2018":"4800","2019":"4800","2020":"2880","2021":"120","2022":"0","Projects":"Trivlexin"},{"2013":"0","2014":"0","2015":"1230","2016":"3690","2017":"6150","2018":"7380","2019":"7380","2020":"4428","2021":"184","2022":"0","Projects":"Varmenase"},{"2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Virtiman"},{"2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"150","2021":"450","2022":"750","Projects":"Vrexigen"},{"2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"500","2020":"1500","2021":"2500","2022":"3000","Projects":"Vrilimen"},{"2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"800","2021":"2400","2022":"4000","Projects":"Weglifil"},{"2013":"0","2014":"0","2015":"900","2016":"2700","2017":"4500","2018":"5400","2019":"5400","2020":"3240","2021":"135","2022":"0","Projects":"Xumanase"},{"2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"198","Projects":"Xyfigil"},{"2013":"0","2014":"100","2015":"300","2016":"500","2017":"600","2018":"600","2019":"540","2020":"420","2021":"300","2022":"180","Projects":"Zerxil"}];

// i made this up
this.revtarget =
[
{"Label":"Target","2013":"60000","2014":"62000","2015":"64000","2016":"66000","2017":"68000","2018":"70000","2019":"72000","2020":"74000","2021":"76000","2022":"78000"},
{"Label":"Another Target","2013":"40000","2014":"45000","2015":"50000","2016":"55000","2017":"60000","2018":"65000","2019":"70000","2020":"75000","2021":"80000","2022":"85000"},
{"Label":"Really Optimistic Target","2013":"20000","2014":"24000","2015":"29000","2016":"35000","2017":"42000","2018":"50000","2019":"60000","2020":"72000","2021":"86000","2022":"103000"}
];

// i made this up
this.budget =
[
{"Label":"Budget","2013":"600","2014":"620","2015":"540","2016":"760","2017":"680","2018":"700","2019":"520","2020":"540","2021":"600","2022":"800"}
];

// this is from pharma 2012 q4 review portfolio
this.costs = 
[{"2012":"40","2013":"20","2014":"20","2015":"40","2016":"20","2017":"20","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Avniman"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Creficil"},{"2012":"24","2013":"41","2014":"85","2015":"5","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Eaglogen"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Estger"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Holitorcitus"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Masogen"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Matisem"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Meprylol"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Mervisil"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Metaphysis"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Mrilipzor"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Mritigen"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Nifilmox"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"OpthTank"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Polgen"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Prototase"},{"2012":"7","2013":"7","2014":"7","2015":"7","2016":"3.95","2017":"2.5","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Refevel"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Reflitol"},{"2012":"17.43","2013":"17.43","2014":"17.43","2015":"17.43","2016":"17.43","2017":"17.43","2018":"13.89","2019":"3.27","2020":"1.31","2021":"1.31","2022":"1.31","Projects":"Resdexel"},{"2012":"3.36","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Rilopof"},{"2012":"0","2013":"0","2014":"15.33","2015":"16.76","2016":"18.18","2017":"22.73","2018":"33.33","2019":"33.33","2020":"25.26","2021":"25.26","2022":"25.26","Projects":"Rydovanil"},{"2012":"1","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Rytifil"},{"2012":"30","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Tikofermin"},{"2012":"71.43","2013":"41.27","2014":"11.11","2015":"3.33","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Trivlexin"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Varmenase"},{"2012":"8.89","2013":"8.71","2014":"8","2015":"8","2016":"8.88","2017":"12.4","2018":"12.4","2019":"12.4","2020":"12.4","2021":"12.4","2022":"12.4","Projects":"Virtiman"},{"2012":"23.33","2013":"27.67","2014":"32","2015":"32","2016":"60","2017":"60","2018":"60","2019":"2.64","2020":"1.56","2021":"1.56","2022":"1.56","Projects":"Vrexigen"},{"2012":"17.8","2013":"19.6","2014":"19.6","2015":"35.71","2016":"35.71","2017":"35.71","2018":"19.81","2019":"1.95","2020":"0","2021":"0","2022":"0","Projects":"Vrilimen"},{"2012":"4.2","2013":"4.2","2014":"4.2","2015":"15","2016":"15","2017":"15","2018":"15","2019":"2.97","2020":"1.48","2021":"1.48","2022":"1.48","Projects":"Weglifil"},{"2012":"0","2013":"0","2014":"0","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Xumanase"},{"2012":"28","2013":"25","2014":"25","2015":"25","2016":"39","2017":"39","2018":"39","2019":"39","2020":"39","2021":"39","2022":"39","Projects":"Xyfigil"},{"2012":"27.33","2013":"16.22","2014":"2.55","2015":"0","2016":"0","2017":"0","2018":"0","2019":"0","2020":"0","2021":"0","2022":"0","Projects":"Zerxil"}] ;


}).apply(sampledata);

/*global App:false, Backbone:false, boxmuller:false, sampledata:false, ui:false, _:false */
// TODO: namespace this differently.

// project summary
App.ProjectSummaryModel = Backbone.Model.extend({});
App.ProjectSummaries = Backbone.Collection.extend({
    model: App.ProjectSummaryModel
});
App.projSumList = new App.ProjectSummaries();
App.projSumList.reset(sampledata.proj);

// revenue per project
App.ProjectRevenueModel = Backbone.Model.extend({});
App.ProjectRevenues = Backbone.Collection.extend({
    model: App.ProjectRevenueModel
});
App.projRevList = new App.ProjectRevenues();
App.projRevList.reset(sampledata.rev);


// revenue target.  maybe doesn't need to be a collection
App.RevenueTargetModel = Backbone.Model.extend({});
App.RevenueTargets = Backbone.Collection.extend({
    model: App.RevenueTargetModel
});
App.revTargetList = new App.RevenueTargets();
App.revTargetList.reset(sampledata.revtarget);



// budget.  maybe doesn't need to be a collection
App.BudgetModel = Backbone.Model.extend({});
App.Budgets = Backbone.Collection.extend({
    model: App.BudgetModel
});
App.budgetList = new App.Budgets();
App.budgetList.reset(sampledata.budget);


// costs.  maybe doesn't need to be a collection
App.CostModel = Backbone.Model.extend({});
App.Costs = Backbone.Collection.extend({
    model: App.CostModel
});
App.costList = new App.Costs();
App.costList.reset(sampledata.costs);


App.CsvModel = Backbone.Model.extend({
    defaults: {
        'csvtext': 'project name, attr name 1, attr name 2\nFoo, val A, val B\nBar, val C, val D',
        'csvrevtext': 'project name, 2012, 2013\nFoo, 100, 200\nBar, 150, 220'
    }
});


/*
 * UI binds to a singleton of this.
 */
App.PortfolioListModel = Backbone.Model.extend({
    defaults: function() {
        var byport = {};
        _.each(ui.portconf, function(port) { byport[port.id] = true; });
        return byport;
    }
});

// a flat model is easier to bind.
// a hierarchical model is easier to mutate (add a port), more OO-ish
// what to do?
// for now, flat: {portname_projname: boolean, ...}.
App.MembershipModel = Backbone.Model.extend({
    defaults: function() {
        var r = boxmuller.newInstance(1);
        var port_proj = {};
        _.each(ui.portconf, function(port) {
            var shuffled = _.shuffle(App.projnames());
            var choose = _.random(App.projnames().length);
            var chosen = _.first(shuffled, choose);
            _.each(App.projnames(), function(projname) {
                port_proj[port.id + '_' + projname] = _.contains(chosen, projname);
                //port_proj[port.id + '_' + projname] = r.random() > 1
                // select-all is default
                // port_proj[port.id + '_' + projname] = true;
            });
        });
        return port_proj;
    }
});


// set of all portfolios.  some may be identical,
// so it's an array.
App.portfolios = [];

// to compare portfolios to each other, there's a
// membership vector, i guess.
App.visiblePortfolios = [];

// TODO: per-portfolio, configurable, or datasource.
App.revenueTarget = 50000;
App.budget = 50000;

/*
 * Reusable charts (http://bost.ocks.org/mike/chart/)
 *
 * No domain knowledge here at all.
 */

var charts = {};
(function() {

// put module globals here.

}).apply(charts);

/*global App:false, charts:false, d3:false */
/* 
 * a collection of shared things.
 */
(function() {
this.xaxis = function() {
    var width = 720;
    var height = 445;
    var label = '';
    var scale ;

    // in pixels.  TODO: draw the label, find out its actual getBBox height, and then
    // provide that to subsequent drawing steps.
    var labelheight = 12;
    var my = function(selection) {
        var innerwidth = width - App.margins.left - App.margins.right;
        var innerheight = height - App.margins.top - App.margins.bottom;
        selection.each(function(data, i) {
            var transformed = d3.select(this);

            var axis = d3.svg.axis()
                .scale(scale)
                .orient("bottom");

            var sel = transformed.selectAll('.x.axis').data(['hi']);
            sel.enter().append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + innerheight + ")");

            sel.call(axis);
            var txt = sel.selectAll('.x.label').data([label]);
            txt.enter().append('text');
            txt.attr('class','x label')
                .attr('text-anchor', 'middle')
                .attr('x', innerwidth / 2)
                .attr('y',  App.margins.bottom)
                .attr('dy', '-0.75em')
                .text(function(d){return d;});
        });
    };
    my.width = function(v) {
        if (!arguments.length) return width;
        width = v;
        return my;
    };
    my.height = function(v) {
        if (!arguments.length) return height;
        height = v;
        return my;
    };
    my.label = function(v) {
        if (!arguments.length) return label;
        label = v;
        return my;
    };
    my.scale = function(v) {
        if (!arguments.length) return scale;
        scale = v;
        return my;
    };
    return my;
};

this.yaxis = function() {
    var width = 720;
    var height = 445;
    var label = '';
    var scale ;
    var my = function(selection) {
        var innerwidth = width - App.margins.left - App.margins.right;
        var innerheight = height - App.margins.top - App.margins.bottom;
        selection.each(function(data, i) {
            var transformed = d3.select(this);

            var axis = d3.svg.axis()
                .scale(scale)
                .orient("left");
    
            var sel = transformed.selectAll('.y.axis').data(['hi']);
            sel.enter().append("g")
                .attr("class", "y axis");

            sel.call(axis);
            var txt = sel.selectAll('.y.label').data([label]);
            txt.enter().append('text');
            txt.attr('class','y label')
                .attr('text-anchor','middle')
                .attr('dy', '1em')
                .attr('transform',
                    'translate(' + -1 * App.margins.left + ', ' + innerheight / 2 + ') rotate(-90)')
                .text(function(d){return d;});

        });
    };
    my.width = function(v) {
        if (!arguments.length) return width;
        width = v;
        return my;
    };
    my.height = function(v) {
        if (!arguments.length) return height;
        height = v;
        return my;
    };
    my.label = function(v) {
        if (!arguments.length) return label;
        label = v;
        return my;
    };
    my.scale = function(v) {
        if (!arguments.length) return scale;
        scale = v;
        return my;
    };
    return my;
};
}).apply(charts);

/*global App:false, charts:false, d3:false */
(function() {
/*
 * very simple bar chart
 */
this.barchart = function() {
    var width = 720;
    var height = 445;
    var xlabel = '';
    var ylabel = '';
    var my = function(selection) {
        var innerwidth = width - App.margins.left - App.margins.right;
        var innerheight = height - App.margins.top - App.margins.bottom;
        /* 
         * ordinal on the x axis, in provided order
         * @param d [{x: year, y: yearsum},...]
         */
        selection.each(function(d, i) {
            var data = d;
            var yset = data.map(function(a) { return a.y; });
            var ymin = d3.min(yset);
            if (ymin > 0) ymin = 0;
            var ymax = d3.max(yset);

            var xscale = d3.scale.ordinal()
                .domain(data.map(function(a) { return a.x; }))
                .rangeRoundBands([0, innerwidth], 0.1);

            var yscale = d3.scale.linear()
                .domain([ymin, ymax])
                .rangeRound([innerheight, 0]);

            d3.select(this).selectAll('*:not(svg)').remove();

            var svg = d3.select(this).selectAll('svg').data(['hi']);

            svg.enter().append('svg');

            var sel = svg.attr('width', width)
                .attr('height', height )
                .append('g')
                .attr('transform', 'translate(' + App.margins.left + ',' + App.margins.top + ')');

            var xaxis = charts.xaxis()
                .width(width).height(height)
                .label(xlabel)
                .scale(xscale);

            var yaxis = charts.yaxis()
                .width(width).height(height)
                .label(ylabel)
                .scale(yscale);

            sel.call(xaxis);
            sel.call(yaxis);
            

            // rect.x,y is left,top
            var bar = sel.selectAll('.bar').data(data);

            bar.enter().append('rect');
            bar.exit().remove();
            bar.attr('class','bar')
                .attr('x', function(d) {return xscale(d.x);}) 
                .attr('width', xscale.rangeBand())
                .attr('y', function(d) {return yscale(d.y);})
                .attr('height', function(d) {return innerheight - yscale(d.y);});

        });
    };
    my.width = function(v) {
        if (!arguments.length) return width;
        width = v;
        return my;
    };
    my.height = function(v) {
        if (!arguments.length) return height;
        height = v;
        return my;
    };
    my.xlabel = function(v) {
        if (!arguments.length) return xlabel;
        xlabel = v;
        return my;
    };
    my.ylabel = function(v) {
        if (!arguments.length) return ylabel;
        ylabel = v;
        return my;
    };
    return my;
};


}).apply(charts);

/*global App:false, charts:false, d3:false, _:false */
(function() {
/*
 * a bingo chart plots category populations for
 * two categories.
 */
 this.bingo = function() {
    var width = 720;
    var height = 445;
    var xlabel = '';
    var ylabel = '';
    var my = function(selection) {
        var innerwidth = width - App.margins.left - App.margins.right;
        var innerheight = height - App.margins.top - App.margins.bottom;
        /*
         * @param d 
         *    [
         *        {
         *          portname: portfolio name,
         *          portdata: {
         *                  x: [x,x,x,...],   // (category)
         *                  y: [y,y,y,...],   // (category)
         *                  data: [{x:x, y:y, label: label (project name)}, ...]
         *          }
         *        }, ...
         *    ]
         */
        selection.each(function(ppdata, i) {
            var allx = [];
            var ally = [];

            // group the data with common categories.
            // TODO: better key generation
            //{phase::ta, [{x,y,label,i},...], phase::ta, []}
            var allpoints = [];
            // max per group
            var maxpop = 0;
            _.each(ppdata, function(ppd, ppdindex) {
                var grouped = {};
                allx = _.union(allx, ppd.portdata.x);
                ally = _.union(ally, ppd.portdata.y);
                _.each(ppd.portdata.data, function(d) {
                    var key = d.x + '::' + d.y;
                    if (_.isUndefined(grouped[key])) grouped[key] = 0;
                    var i = grouped[key];
                    var exd = _.extend(d, {
                        i:i,
                        j:ppdindex,
                        portname: ppd.portname,
                        key: ppd.portname + '::' + d.label
                        });
                    grouped[key] ++ ;
                    allpoints.push(exd);
                    maxpop = _.max([maxpop, grouped[key]]);
                });
            });

            var padding = 0.1;
            var xscale = d3.scale.ordinal()
                .domain(allx)
                .rangeRoundBands([0, innerwidth], padding);
            var yscale = d3.scale.ordinal()
                .domain(ally)
                .rangeRoundBands([0, innerheight], padding);

            var colorScale = d3.scale.category10().domain(_.range(100));

            var xaxis = charts.xaxis()
                .width(width).height(height)
                .label(xlabel)
                .scale(xscale);

            var yaxis = charts.yaxis()
                .width(width).height(height)
                .label(ylabel)
                .scale(yscale);

            //d3.select(this).selectAll('*:not(svg)').remove();
            d3.select(this).selectAll('table').remove();
            d3.select(this).selectAll('div.tab-content').remove();
            d3.select(this).selectAll('svg.stacked-bar-line').remove();
            d3.select(this).selectAll('svg.linechart').remove();
            d3.select(this).selectAll('svg.scatter').remove();
            //d3.select(this).selectAll('svg.bubble').remove()

            // we just hack the 'cx' value
            var svg = d3.select(this).selectAll('svg').data(['hi']);

            svg.enter().append('svg');
            svg.exit().remove();

            svg.attr('width', width)
                .attr('height', height)
                .attr('class', 'bingochart');

            var gg = svg.selectAll('g.chartcontainer').data(['hi']);

            gg.enter().append('g');
            gg.exit().remove();

            gg.attr('class','chartcontainer')
                .attr('transform', 'translate(' + App.margins.left + ',' + App.margins.top + ')');
                    

            var sss = gg.selectAll('a.dot')
                .data(allpoints, function(d){ return d.key; });

            sss.enter().append('a')
                .each(function(){console.log('enter');});
            sss.exit().remove();

            sss.attr('class','dot bingo')
                .attr('rel','tooltip')
                .attr('data-original-title', function(d){return d.label + '(' + d.portname + ')';});

            var ssc = sss.selectAll('circle').data(function(d){return [d];});
            ssc.enter().append('circle')
                .attr('cx', function(d) {
                    return xscale(d.x) + xscale.rangeBand() * (d.i * 2 + 1) / (maxpop * 2);
                })
                .attr('cy', function(d) {
                    return yscale(d.y) + yscale.rangeBand() * (d.j * 2 + 1) / (ppdata.length * 2);
                });

            ssc.exit().remove();

            var xspacing = innerwidth / (maxpop * allx.length);
            var yspacing = innerheight / (ppdata.length * ally.length);
            var radius = 0.8 * _.min([xspacing,yspacing]) / 2;

            ssc.transition()
                .attr('cx', function(d) {
                    return xscale(d.x) + xscale.rangeBand() * (d.i * 2 + 1) / (maxpop * 2);
                })
                .attr('cy', function(d) {
                    return yscale(d.y) + yscale.rangeBand() * (d.j * 2 + 1) / (ppdata.length * 2);
                })
                .attr('r', radius)
                .attr('fill', function(d) {
                    return colorScale(d.j);
                })
                .attr('name', function(d) {return d.label;})
                .attr('opacity', 1);

            gg.call(xaxis);
            gg.call(yaxis);

            var xgrid = gg.selectAll('.xgrid').data(allx);

            xgrid.enter().append('line');
            xgrid.exit().remove();

            xgrid.attr('class','xgrid')
                .attr('x1', function(d){
                    return xscale(d) + xscale.rangeBand() * (1 + padding / 2);})
                .attr('x2', function(d){
                    return xscale(d) + xscale.rangeBand() * (1 + padding / 2);})
                .attr('y1', yscale.rangeExtent()[0])
                .attr('y2', yscale.rangeExtent()[1]);

            var ygrid = gg.selectAll('.ygrid').data(ally);

            ygrid.enter().append('line');
            ygrid.exit().remove();

            ygrid.attr('class','ygrid')
                .attr('y1', function(d){
                    return yscale(d) - yscale.rangeBand() * ( padding / 2);})
                .attr('y2', function(d){
                    return yscale(d) - yscale.rangeBand() * ( padding / 2);})
                .attr('x1', xscale.rangeExtent()[0])
                .attr('x2', xscale.rangeExtent()[1]);

        });
        $('[rel=tooltip]').tooltip({html:true});
    };
    my.width = function(v) {
        if (!arguments.length) return width;
        width = v;
        return my;
    };
    my.height = function(v) {
        if (!arguments.length) return height;
        height = v;
        return my;
    };
    my.xlabel = function(v) {
        if (!arguments.length) return xlabel;
        xlabel = v;
        return my;
    };
    my.ylabel = function(v) {
        if (!arguments.length) return ylabel;
        ylabel = v;
        return my;
    };
    return my;
 };

}).apply(charts);

/*global App:false, charts:false, d3:false, _:false */
(function() {
this.bubblechart = function() {
    var width = 720;
    var height = 445;
    var xlabel = '';
    var ylabel = '';
    /*
     * aggregate projects into portfolio.  to do this,
     * each point is plotted as if it were the aggregate.
     */
    var summary = false;
    var my = function(selection) {
        var innerwidth = width - App.margins.left - App.margins.right;
        var innerheight = height - App.margins.top - App.margins.bottom;

        /*
         * takes multiple portfolios
         * @param data 
         *     [
         *         {
         *             label: label (portfolio name),
         *             data: [...]
         *         },...
         *     ]
         */
         //console.log(selection)
        selection.each(function(data, i) {
            //console.log('bubble')
            //console.log(data);
            // pretend, for now, that all svg's can transition to each other.
            // and further, that the only non-svg thing is a table.
            //var rrr = d3.select(this).selectAll('*:not(svg)')
            //var rrr = d3.select(this).selectAll('table')
            //rrr.remove()
            //rrr.each(function(d){console.log('rrr');console.log(d)})
            d3.select(this).selectAll('table').remove();
            d3.select(this).selectAll('div.tab-content').remove();
            d3.select(this).selectAll('svg.stacked-bar-line').remove();
            d3.select(this).selectAll('svg.linechart').remove();
            d3.select(this).selectAll('svg.scatter').remove();
            d3.select(this).selectAll('line.xgrid').remove();
            d3.select(this).selectAll('line.ygrid').remove();


            // extend each point with aggregates, to make transitions easier
            _.each(data, function(series, index) {
                var seriescost = _.reduce(series.data,function(m,d){return m+Number(d.Lcost);},0);
                var seriesnpv = _.reduce(series.data,function(m,d){return m+Number(d.NPV);},0);
                var seriesenpv = _.reduce(series.data,function(m,d){return m+Number(d.ENPV);},0);
                var seriesrisk = seriesenpv / seriesnpv;

                series.data = _.map(series.data, function(d) {
                    return _.extend(_.clone(d), {
                        label: series.label,
                        labelindex: series.index,
                        seriescost: seriescost,
                        seriesrisk: seriesrisk,
                        seriesenpv: seriesenpv
                    });
                });
            });

            // bigger bubbles underneath little ones
            _.each(data, function(d){
                _.sortBy(d.data, function(row) {return -1 * summary?row.seriesnpv:row.ENPV;});
            });

            var mincost = _.min(_.flatten(_.map(data, function(series) {
                return _.map(series.data, function(x){return summary?x.seriescost:+x.Lcost;});
            })));
            var maxcost = _.max(_.flatten(_.map(data, function(series) {
                return _.map(series.data, function(x){return summary?x.seriescost:+x.Lcost;});
            })));

            var xscale = d3.scale.linear()
                .domain([0, maxcost])
                .range([0, innerwidth])
                .nice();
    
            var yscale = d3.scale.linear()
                .domain([0,1])
                .range([innerheight, 0])
                .nice();

            var minenpv = _.min(_.flatten(_.map(data, function(series) {
                return _.map(series.data, function(x){return summary?x.seriesenpv:+x.ENPV;});
            })));
            var maxenpv = _.max(_.flatten(_.map(data, function(series) {
                return _.map(series.data, function(x){return summary?x.seriesenpv:+x.ENPV;});
            })));

            // Z = bubble size = ENPV
            // http://makingmaps.net/2007/08/28/perceptual-scaling-of-map-symbols/
            var zscale = d3.scale.pow().exponent(0.85)
                .domain([0, maxenpv])
                .range([0, width / 30]);


            var colorScale = d3.scale.category10().domain(_.range(100));

            // X = Lcost
            var xaxis = charts.xaxis()
                .width(width).height(height)
                .label(xlabel)
                .scale(xscale);

            // Y = Plaunch
            var yaxis = charts.yaxis()
                .width(width).height(height)
                .label(ylabel)
                .scale(yscale);

            var svg = d3.select(this).selectAll('svg').data(['hi']);

            svg.enter().append("svg");
            svg.exit().remove();

            svg.attr("width", width)
                .attr("height", height)
                .attr("class", "bubble dot chart");

            var transformed = svg.selectAll('g.chartcontainer').data(['hi']);

            transformed.enter().append("g");
            transformed.exit().remove();
            transformed.attr('class','chartcontainer')
                .attr("transform", "translate(" + App.margins.left + "," + App.margins.top + ")");

            transformed.call(xaxis);
            transformed.call(yaxis);

            // no reason for hierarchy, it's just dots.
            var flattened = _.flatten(_.map(data, function(port) {
                return _.map(port.data, function(proj) {
                    var key = port.label + '::' + proj.Project;
                    return _.extend(_.clone(proj), {key: key, project: proj.Project, label: port.label});
                });
            }));

            var bigdiameter = function(d) {
                if (summary) return zscale(d.seriesenpv);
                return Math.max(40, (+d.ENPV < 0) ? 5 : zscale(+d.ENPV));
            };


            var sss = transformed.selectAll('a.dot').data(flattened, function(d) {return d.key;});

            // just sets initial values for the transition
            sss.enter().append('a');

            sss.attr("class", "dot")
                .attr('rel','tooltip')
                .attr('data-original-title',function(d){
                    return [summary?d.label:d.Project ,
                        '<br>EPNV: ' , Number(summary?d.seriesenpv:d.ENPV).toFixed() ,
                        '<br>cost: ' , Number(summary?d.seriescost:d.Lcost).toFixed() ,
                        '<br>p: ' , Number(summary?d.seriesrisk:d.Plaunch).toFixed(2)].join('') ; });

            var ssc = sss.selectAll('circle').data(function(d){return [d];});

            var sscenter = ssc.enter().append("circle")
                .attr("cx", function(d) { 
                    return xscale(summary?d.seriescost:+d.Lcost);
                })
                .attr("cy", function(d) { 
                    return yscale(summary?d.seriesrisk:+d.Plaunch); 
                })
                .attr("r", bigdiameter);
            // used to hide the new project dot until the portfolio covers it up
            if (summary) sscenter.attr('opacity', 0);

            ssc.exit().remove();

            var ssst = ssc.transition();
            ssst.attr("cx", function(d) { 
                    return xscale(summary?d.seriescost:+d.Lcost);
                })
                .attr("cy", function(d) { 
                    return yscale(summary?d.seriesrisk:+d.Plaunch); 
                })
                .attr("r",  function(d) { 
                    return ((summary?+d.seriesenpv:+d.ENPV) < 0) ? 5 : zscale(summary?+d.seriesenpv:+d.ENPV);
                })
                .attr("fill", function(d,i) {
                     return ((summary?d.seriesenpv:d.ENPV) < 0 ) ? 'white': colorScale(d.labelindex);
                })
                .attr("stroke", function(d,i) {
                     return colorScale(d.labelindex);
                })
                .attr('name',function(d){return d.Project;});

            // don't show the new project dots until the moving is done
            if (summary) {ssst.transition().duration(0).attr('opacity', 1);}
            else {ssst.attr('opacity', data.length > 1 ? (1 / Math.sqrt(data.length)) : 1);}

            var ssse = sss.exit();
            if (!summary) {
                ssse.select('circle').transition().attr("r", bigdiameter).remove();
                ssse.transition().remove(); // parallel transition, weird.
            } else {
                ssse.remove();
            }


        });
        $('[rel=tooltip]').tooltip({html:true});
    };
    my.width = function(v) {
        if (!arguments.length) return width;
        width = v;
        return my;
    };
    my.height = function(v) {
        if (!arguments.length) return height;
        height = v;
        return my;
    };
    my.summary = function(v) {
        if (!arguments.length) return summary;
        summary = v;
        return my;
    };
    my.xlabel = function(v) {
        if (!arguments.length) return xlabel;
        xlabel = v;
        return my;
    };
    my.ylabel = function(v) {
        if (!arguments.length) return ylabel;
        ylabel = v;
        return my;
    };
    return my;
};

}).apply(charts);

/*global App:false, charts:false, d3:false, _:false */
(function() {
/*
 * multiple line overlaid
 */
this.line = function() {
    var width = 720;
    var height = 445;
    var xlabel = '';
    var ylabel = '';
    var my = function(selection) {
        var innerwidth = width - App.margins.left - App.margins.right;
        var innerheight = height - App.margins.top - App.margins.bottom;
        /* 
         * i don't want to have to know how to arrange the values,
         * so we have axis vectors.  the series share axes but not
         * necessarily label sets.
         * 
         * @param d {
         *     x: [x, x, x,...],
         *     labels: [label, label, label, ...],
         *     data: [ { x: x, y: y, label: label},... ] 
         * } 
         */
        selection.each(function(data, i) {

            //console.log(data);
            
            var ymax = d3.max( _.pluck( data.data, 'y'));

            var xscale = d3.scale.ordinal()
                .domain(data.x)
                .rangeRoundBands([0, innerwidth], 0.1);

            var yscale = d3.scale.linear()
                .domain([0, ymax])
                .range([innerheight, 0])
                .nice();

            var xaxis = charts.xaxis()
                .width(width).height(height)
                .label(xlabel)
                .scale(xscale);

            var yaxis = charts.yaxis()
                .width(width).height(height)
                .label(ylabel)
                .scale(yscale);

            var line = d3.svg.line()
                .x(function(d) {return xscale(d.x) + xscale.rangeBand() / 2; })
                .y(function(d) {return yscale(d.y); });

            //d3.select(this).selectAll('*:not(svg)').remove()
            d3.select(this).selectAll('table').remove();
            d3.select(this).selectAll('div.tab-content').remove();
            d3.select(this).selectAll('svg.stacked-bar-line').remove();
            d3.select(this).selectAll('svg.bubble').remove();
            d3.select(this).selectAll('svg.bingochart').remove();

            var svg = d3.select(this).selectAll('svg').data(['hi']);

            svg.enter().append('svg');
            svg.exit().remove();

            svg.attr('width', width)
                .attr('height', height )
                .attr('class','linechart');

            var sel = svg.selectAll('g').data(['hi']);

            sel.enter().append('g');
            sel.exit().remove();

            sel.attr('transform', 'translate(' + App.margins.left + ',' + App.margins.top + ')');

            sel.call(xaxis);
            sel.call(yaxis);

            // stitch the relations into paths
            var linedata = _.map(data.labels, function(label) {
                return _.compact(_.map(data.x, function(x) {
                    var item = _.find(data.data, function(row){
                        return row.label === label && row.x === x;
                    });
                    return item;
                }));
            });

            var lines = sel.selectAll('path.line').data(linedata);
            lines.enter().append('path');
            lines.exit().remove();
            lines.attr('class','line').transition().attr("d", line);

        });
    };
    my.width = function(v) {
        if (!arguments.length) return width;
        width = v;
        return my;
    };
    my.height = function(v) {
        if (!arguments.length) return height;
        height = v;
        return my;
    };
    my.xlabel = function(v) {
        if (!arguments.length) return xlabel;
        xlabel = v;
        return my;
    };
    my.ylabel = function(v) {
        if (!arguments.length) return ylabel;
        ylabel = v;
        return my;
    };
    return my;
};


}).apply(charts);

/*global charts:false, d3:false, _:false */
(function() {
this.multi = function() {

    // the layout follows the shape of this array,
    // which must be TWO DIMENSIONAL.
    var components = [];
    var width = 720;
    var height = 445;

    var my = function(selection) {
        // find the max rows
        // for now, all row heights are the same
        var colct =
            _.max(
                _.map(components, function(row) {
                        return _.reduce(row, function(total, cell) {
                            return total + (cell.colspan ? cell.colspan : 1);
                        }, 0);
                })
            );
        var rowheight = height / components.length;
        /* @param d i think this is nothing */
        selection.each(function(parentdata,i){
            //console.log(parentdata);
            // there's nothing interesting in the dataset.
            //d3.select(this).selectAll('*:not(div)').remove()
            d3.select(this).selectAll('div.tab-content > svg').remove();
            d3.select(this).selectAll('table.data-table').remove();
            var tbldiv = d3.select(this).selectAll('div')
                .data(['hi']);
            tbldiv.enter().append('div');

            var tbl = tbldiv.selectAll('table').data(['hi']);
            tbl.enter().append('table').attr('class','multi');

            var tr = tbl.selectAll('tr').data(components);
            tr.enter().append('tr');
           // .each(function(){console.log('fa')})
            tr.exit().remove();

            /* @param d a row */
            tr.each(function(d,i){
                //console.log('row')
                var cellwidth = width / colct;
                var td = d3.select(this).selectAll('td').data(d);

                td.enter().append('td');
                td.exit().remove();

                td.attr('colspan',function(d){return d.colspan ? d.colspan : 1;})
                    .attr('rowspan',function(d){return d.rowspan ? d.rowspan : 1;})
                    /* @param d {datum, mychart} datum = function(ports, portview, membership) */
                    .each(function(d,i) {
                        //console.log('cell')
                        var chartwidth = cellwidth * (d.colspan ? d.colspan : 1);
                        var chartheight = rowheight * (d.rowspan ? d.rowspan : 1);
                        var hscale = chartwidth / width;
                        var vscale = chartheight / height;

                        var svg = d3.select(this).selectAll('svg.cellcontainer')
                            .data([['g']]);
                        svg.enter().append('svg').attr('class','cellcontainer');
                        svg.exit().remove();

                        svg.attr('width', chartwidth)
                            .attr('height', chartheight);

                        var ddd = d.datum(parentdata.ports, parentdata.portview, parentdata.membership);

                        var svgg = svg.selectAll('g.gcontainer').data([ddd]);
                        svgg.enter().append('g').attr('class','gcontainer');
                        svgg.exit().remove();

                        svgg.attr('transform', 'scale(' + hscale + ',' + vscale + ')');

                        svgg.call(
                                d.mychart
                                    .width(width)
                                    .height(height)
                            );
                    });
            });
        });
    };
    my.components = function(v) {
        if (!arguments.length) return components;
        components = v;
        return my;
    };
    my.width = function(v) {
        if (!arguments.length) return width;
        width = v;
        return my;
    };
    my.height = function(v) {
        if (!arguments.length) return height;
        height = v;
        return my;
    };
    return my;
};
}).apply(charts);

/*global App:false, charts:false, d3:false, _:false */
(function() {

this.pareto = function() {
    var width = 720;
    var height = 445;
    var xlabel = '';
    var ylabel = '';
    var my = function(selection) {
        var innerwidth = width - App.margins.left - App.margins.right;
        var innerheight = height - App.margins.top - App.margins.bottom;
        /*
         * {
         *  frontiers: {
         *   expected: [ {x,y},...],
         *   best:     [ {x,y},...], },
         *  ports: [{
         *   x
         *   yexpected
         *   ybest
         *   yworst
         *   label
         *   index
         *  },...]
         */
        selection.each(function(dddd, i) {
            var data = dddd.ports;

            var xxset = _.union(_.pluck(dddd.frontiers.best, 'x'),
                                _.pluck(dddd.frontiers.expected, 'x'),
                                _.pluck(data, 'x'));
            var xmin = d3.min(xxset);
            var xmax = d3.max(xxset);
            var yyset = _.union(_.pluck(dddd.frontiers.best, 'y'),
                                _.pluck(dddd.frontiers.expected, 'y'),
                                _.flatten(_.map(data, function(a) { return [a.yexpected, a.ybest, a.yworst]; })));
            var ymin = d3.min(yyset);
            var ymax = d3.max(yyset);

            var xscale = d3.scale.linear()
                .domain([xmin, xmax])
                .range([0, innerwidth])
                .nice();

            var yscale = d3.scale.linear()
                .domain([ymin, ymax])
                .range([innerheight, 0])
                .nice();

            var colorScale = d3.scale.category10().domain(_.range(100));

            var xaxis = charts.xaxis()
                .width(width).height(height)
                .label(xlabel)
                .scale(xscale);

            var yaxis = charts.yaxis()
                .width(width).height(height)
                .label(ylabel)
                .scale(yscale);

            // points are the expected value
            var line = d3.svg.line()
                .x(function(d) { return xscale(d.x); })
                .y(function(d) { return yscale(d.yexpected); });

            //d3.select(this).selectAll('*:not(div)').remove()
            d3.select(this).selectAll('table').remove();
            d3.select(this).selectAll('svg.stacked-bar').remove();
            d3.select(this).selectAll('svg.stacked-bar-line').remove();
            d3.select(this).selectAll('svg.linechart').remove();
            d3.select(this).selectAll('svg.bingochart').remove();
            d3.select(this).selectAll('svg.bubble').remove();
            var svg = d3.select(this).selectAll('svg.scatter').data(['hi']);

            svg.enter().append("svg");
            svg.exit().remove();

            svg.attr('class','scatter')
                .attr('width', width)
                .attr('height', height);

            var sel = svg.selectAll('g').data(['hi']);

            sel.enter().append('g');
            sel.exit().remove();

            sel.attr('transform', 'translate(' + App.margins.left + ',' + App.margins.top + ')');

            sel.call(xaxis);
            sel.call(yaxis);

            var sss = sel.selectAll('a.dot').data(data, function(d){return d.label;});
            sss.enter().append('a');

            sss.attr('class','dot')
                .attr('rel','tooltip')
                .attr('data-original-title',function(d){
                    return [d.label ,
                        '<br>EPNV: ' , Number(d.yexpected).toFixed() ,
                        '<br>cost: ' , Number(d.x).toFixed()].join('');});

            var cir = sss.selectAll('circle').data(function(d){return [d];});
            cir.enter().append('circle')
                .attr('cx', line.x())
                .attr('cy', line.y());
            cir.transition()
                .attr('cx', line.x())
                .attr('cy', line.y())
                .attr('r', 8)
                .attr("stroke", function(d) { 
                    return colorScale(d.index); })
                .attr("fill", function(d) { return colorScale(d.index); });
            cir.exit().remove();

            var rec = sss.selectAll('rect').data(function(d){return [d];});
            rec.enter().append('rect')
                .attr('x', function(d){return xscale(d.x) - 2;})
                .attr('y', function(d){return yscale(d.yexpected);})
                .attr('width', 4);

            rec.transition()
                .attr('x', function(d){return xscale(d.x) - 2;})
                .attr('width', 4)
                .attr('y', function(d){return yscale(d.ybest);})
                .attr('height', function(d) {return yscale(d.yworst) - yscale(d.ybest);})
                .attr("fill", function(d) { return colorScale(d.index); });

            sss.exit().selectAll('rect').transition()
                .attr('y', function(d){return yscale(d.yexpected);})
                .attr('height', 0)
                .remove();

            sss.exit().selectAll('circle').transition()
                .attr('r', 0)
                .remove();

            sss.exit().transition().remove();

            var bline = d3.svg.line()
                .x(function(d){return xscale(d.x);})
                .y(function(d){return yscale(d.y);});
            var bestline = sel.selectAll('path.bestline').data([dddd.frontiers.best]);
            bestline.enter().append('path');
            bestline.exit().remove();
            bestline
                .attr('class','bestline')
                .transition()
                .attr('d',bline)
                .attr('stroke','black')
                .attr('fill','none');

            var eline = sel.selectAll('path.eline').data([dddd.frontiers.expected]);
            eline.enter().append('path');
            eline.exit().remove();
            eline
                .attr('class','eline')
                .transition()
                .attr('d',bline)
                .attr('stroke','black')
                .attr('fill','none');



        });
        $('[rel=tooltip]').tooltip({html:true});
    };
    my.width = function(v) {
        if (!arguments.length) return width;
        width = v;
        return my;
    };
    my.height = function(v) {
        if (!arguments.length) return height;
        height = v;
        return my;
    };
    my.xlabel = function(v) {
        if (!arguments.length) return xlabel;
        xlabel = v;
        return my;
    };
    my.ylabel = function(v) {
        if (!arguments.length) return ylabel;
        ylabel = v;
        return my;
    };
    return my;
};

}).apply(charts);

/*global App:false, charts:false, d3:false, _:false */
(function() {
this.scatter = function() {
    var width = 720;
    var height = 445;
    var xlabel = '';
    var ylabel = '';
    var my = function(selection) {
        var innerwidth = width - App.margins.left - App.margins.right;
        var innerheight = height - App.margins.top - App.margins.bottom;
        selection.each(function(data, i) {

            var xset = data.map(function(a) { return a.x; });
            var xmin = d3.min(xset);
            var xmax = d3.max(xset);
            var yset = data.map(function(a) { return a.y; });
            var ymin = d3.min(yset);
            var ymax = d3.max(yset);

            var xscale = d3.scale.linear()
                .domain([xmin, xmax])
                .range([0, innerwidth])
                .nice();

            var yscale = d3.scale.linear()
                .domain([ymin, ymax])
                .range([innerheight, 0])
                .nice();

            var colorScale = d3.scale.category10().domain(_.range(100));

            var xaxis = charts.xaxis()
                .width(width).height(height)
                .label(xlabel)
                .scale(xscale);

            var yaxis = charts.yaxis()
                .width(width).height(height)
                .label(ylabel)
                .scale(yscale);

            var line = d3.svg.line()
                .x(function(d) { return xscale(d.x); })
                .y(function(d) { return yscale(d.y); });

            //d3.select(this).selectAll('*:not(div)').remove()
            d3.select(this).selectAll('table').remove();
            d3.select(this).selectAll('svg.stacked-bar').remove();
            d3.select(this).selectAll('svg.stacked-bar-line').remove();
            d3.select(this).selectAll('svg.linechart').remove();
            d3.select(this).selectAll('svg.bingochart').remove();
            d3.select(this).selectAll('svg.bubble').remove();
            var svg = d3.select(this).selectAll('svg.scatter').data(['hi']);

            svg.enter().append("svg");
            svg.exit().remove();

            svg.attr('class','scatter')
                .attr('width', width)
                .attr('height', height);

            var sel = svg.selectAll('g').data(['hi']);

            sel.enter().append('g');
            sel.exit().remove();

            sel.attr('transform', 'translate(' + App.margins.left + ',' + App.margins.top + ')');

            sel.call(xaxis);
            sel.call(yaxis);

            var sss = sel.selectAll('a.dot').data(data, function(d){return d.label;});
            sss.enter().append('a');
            sss.exit().remove();

            sss.attr('class','dot')
                .attr('rel','tooltip')
                .attr('data-original-title',function(d){
                    return [d.label ,
                        '<br>EPNV: ' , Number(d.y).toFixed() ,
                        '<br>cost: ' , Number(d.x).toFixed()].join('');});

            var cir = sss.selectAll('circle').data(function(d){return [d];});
            cir.enter().append('circle')
                .attr('cx', line.x())
                .attr('cy', line.y());
            cir.transition()
                .attr('cx', line.x())
                .attr('cy', line.y())
                .attr('r', 8)
                .attr("fill", function(d) { return colorScale(d.index); });
            cir.exit().remove();

        });
        $('[rel=tooltip]').tooltip({html:true});
    };
    my.width = function(v) {
        if (!arguments.length) return width;
        width = v;
        return my;
    };
    my.height = function(v) {
        if (!arguments.length) return height;
        height = v;
        return my;
    };
    my.xlabel = function(v) {
        if (!arguments.length) return xlabel;
        xlabel = v;
        return my;
    };
    my.ylabel = function(v) {
        if (!arguments.length) return ylabel;
        ylabel = v;
        return my;
    };
    return my;
};

}).apply(charts);

/*global App:false, charts:false, d3:false, _:false */
(function() {
this.stackedbar = function() {
    var width = 720;
    var height = 445;
    var xlabel = '';
    var ylabel = '';
    var my = function(selection) {
        var innerwidth = width - App.margins.left - App.margins.right;
        var innerheight = height - App.margins.top - App.margins.bottom;
        /* 
         * ordinal on the x axis, in provided order
         * @param d [{x: year, y: [{label: label, value: value},...]},...]
         */
        selection.each(function(d, i) {
            var data = d;
            var labels = _.uniq(_.flatten(
                _.map(data,function(x){
                    return _.map(x.y,function(y){
                        return y.label;
                    });
                })
            )).sort();

            // running total, fill in zeros
            data.forEach(function(d) {
                var total = 0;
                d.y = _.map(labels,function(label){
                    var item = _.find(d.y, function(x){
                        return x.label === label;
                    });
                    var value = item?item.value:0;
                    var cumulative = total + value;
                    total = cumulative;
                    return {
                        label: label,
                        value: value,
                        cumulative: cumulative
                    };
                });
            });

            
            var ymax = d3.max(_.pluck(_.flatten(_.pluck(data, 'y')),'cumulative'));

            var xscale = d3.scale.ordinal()
                .domain(data.map(function(a) { return a.x; }))
                .rangeRoundBands([0, innerwidth], 0.1);

            var yscale = d3.scale.linear()
                .domain([0, ymax])
                .range([innerheight, 0])
                .nice();

            d3.select(this).selectAll('*:not(svg)').remove();
            var svg = d3.select(this).selectAll('svg')
                .data(['hi']);

            svg.enter().append('svg');

            var sel = svg.attr('width', width)
                .attr('height', height )
                .append('g')
                .attr('transform', 'translate(' + App.margins.left + ',' + App.margins.top + ')');

            var xaxis = charts.xaxis()
                .width(width).height(height)
                .label(xlabel)
                .scale(xscale);

            var yaxis = charts.yaxis()
                .width(width).height(height)
                .label(ylabel)
                .scale(yscale);

            sel.call(xaxis);
            sel.call(yaxis);

            // rect.x,y is left,top

            var grp = sel.selectAll('.group')
                .data(data)
                .enter()
                .append('g')
                .attr('class','group')
                .attr("transform", function(d) { return "translate(" + xscale(d.x) + ",0)"; });

            var rec = grp.selectAll('.stackedbar').data(function(d) {return d.y;});
            rec.enter().append('rect');
            rec.exit().remove();
                //.attr('class',function(d){return d.value})
            rec.attr('class',function(d,i){
                    return (labels.length >= 5)?'stackedbar catcolor'+(i%2) : 'stackedbar bincolor'+i;
                })
                .attr('width', xscale.rangeBand())
                .attr('y', function(d){
                    return yscale(d.cumulative);
                })
                .attr('height',function(d){return yscale(0) - yscale(d.value);});


            // if there are only a few labels, then meaningful colors
            // would be good.  if there are many, then color serves only
            // as a boundary marker.

        });
    };
    my.width = function(v) {
        if (!arguments.length) return width;
        width = v;
        return my;
    };
    my.height = function(v) {
        if (!arguments.length) return height;
        height = v;
        return my;
    };
    my.xlabel = function(v) {
        if (!arguments.length) return xlabel;
        xlabel = v;
        return my;
    };
    my.ylabel = function(v) {
        if (!arguments.length) return ylabel;
        ylabel = v;
        return my;
    };
    return my;
};


}).apply(charts);

/*global App:false, charts:false, d3:false, _:false */
(function() {
/*
 * stacked bars with lines overlaid
 */
this.stackedbarline = function() {
    var width = 720;
    var height = 445;
    var xlabel = '';
    var ylabel = '';
    var my = function(selection) {
        var innerwidth = width - App.margins.left - App.margins.right;
        var innerheight = height - App.margins.top - App.margins.bottom;
        /* 
         * i don't want to have to know how to arrange the values,
         * so we have axis vectors.  the series share axes but not
         * necessarily label sets.
         * 
         * @param d {
         *     x: [x, x, x,...],
         *     bars: {
         *         labels: [label, label, label, ...],
         *         data: [ { x: x, y: y, label: label},... ]
         *     },
         *     lines: {
         *         labels: [label, label, label, ...],
         *         data: [ { x: x, y: y, label: label},... ] 
         *     }
         * } 
         */
        selection.each(function(data, i) {
            //console.log(data)
            _.each(data.x, function(x) {
                var total = 0;
                var idx = 0;
                // fill in the cumulative field, in the correct label order.
                _.each(data.bars.labels, function(label) {
                    var item = _.find(data.bars.data, function(row){
                        return row.label === label && row.x === x;
                    });
                    if (!_.isUndefined(item)) {
                        item.cumulative = total + item.y;
                        total = item.cumulative;
                        item.color = (data.bars.labels.length >= 5)?'catcolor'+(idx%2) : 'bincolor'+idx%5;
                        idx++;
                    }
                });
            });

            
            var ymax = d3.max(
                _.union(
                    _.pluck( data.bars.data, 'cumulative'),
                    _.pluck( data.lines.data, 'y')
                )
            );


            var xscale = d3.scale.ordinal()
                .domain(data.x)
                .rangeRoundBands([0, innerwidth], 0.1);

            var yscale = d3.scale.linear()
                .domain([0, ymax])
                .range([innerheight, 0])
                .nice();

            // for now, remove everything
            //d3.select(this).selectAll('*:not(svg)').remove()
            d3.select(this).selectAll('svg').remove();
            d3.select(this).selectAll('table').remove();

            var svg = d3.select(this).selectAll('svg')
                .data(['hi']);

            svg.enter().append('svg').attr('class','stacked-bar-line');

            var sel = svg
                .attr('width', width)
                .attr('height', height )
                .append('g')
                .attr('transform', 'translate(' + App.margins.left + ',' + App.margins.top + ')');


            var xaxis = charts.xaxis().width(width).height(height)
                .label(xlabel).scale(xscale);

            var yaxis = charts.yaxis().width(width).height(height)
                .label(ylabel).scale(yscale);

            sel.call(xaxis);
            sel.call(yaxis);

            // bars, all the little pieces at once, without grouping.
            sel.selectAll('.stackedbar')
                .data(data.bars.data)
                .enter()
                .append('rect')
                .attr('class',function(d){return 'stackedbar ' + d.color; })
                .attr('x', function(d){return xscale(d.x);})
                .attr('width', xscale.rangeBand())
                .attr('y', function(d){ return yscale(d.cumulative); })
                .attr('height',function(d){return yscale(0) - yscale(d.y);});

            var line = d3.svg.line()
                .x(function(d) {return xscale(d.x) + xscale.rangeBand() / 2; })
                .y(function(d) {return yscale(d.y); });


            // stitch the relations into paths
            var lines = _.map(data.lines.labels, function(label) {
                return _.compact(_.map(data.x, function(x) {
                    var item = _.find(data.lines.data, function(row){
                        return row.label === label && row.x === x;
                    });
                    return item;
                }));
            });

            sel.selectAll('.line')
                .data(lines)
                .enter()
                .append('path')
                .attr('class','line')
                .attr("d", line);


        });
    };
    my.width = function(v) {
        if (!arguments.length) return width;
        width = v;
        return my;
    };
    my.height = function(v) {
        if (!arguments.length) return height;
        height = v;
        return my;
    };
    my.xlabel = function(v) {
        if (!arguments.length) return xlabel;
        xlabel = v;
        return my;
    };
    my.ylabel = function(v) {
        if (!arguments.length) return ylabel;
        ylabel = v;
        return my;
    };
    return my;
};


}).apply(charts);

/*global App:false, charts:false, d3:false, _:false */
(function() {
this.table = function() {
    /*
     * now updatable
     */
    var my = function(selection) {
        selection.each(function(dataset, i) {

            // TODO: add portfolio membership columns.

            // TODO: pull out special columns, e.g. Project Name
            var cols = App.cols(dataset);

            // make a dataset that's easy for d3 to walk through
            var squaredata = [];
            _.each(dataset, function(row) {
                var newrow = [];
                _.each(cols, function(col, index) {
                    newrow[index] = row[col];
                });
                squaredata.push(newrow);
            });

            // a table can't transition with anything but itself,
            // so first remove anything that's not a table.
            d3.select(this).selectAll('*:not(table)').remove();
            var tbl = d3.select(this).selectAll('table')
                .data(['table']);

            // first time, add the table
            var te = tbl.enter().append('table')
                .attr('class','table data-table table-bordered table-condensed table-hover');

            var thead = tbl.selectAll('thead').data(['thead']);
            thead.enter().append('thead');

            var tr = thead.selectAll('tr').data(['tr']);
            tr.enter().append('tr');

            var th = tr.selectAll('th')
                .data(cols);
            th.enter().append('th');
            th.text(function(x){return x;});

            var br = tbl.append('tbody')
                .selectAll('tr')
                .data(squaredata);
            br.enter().append('tr');

            var td = br.selectAll('td')
                .data(function(d){return d;});

            td.enter().append('td');
            td.text(function(d){return d;});

         });

    };
    my.height = function(){return my;};
    my.width = function(){return my;};
    return my;
};


}).apply(charts);

/* data uploader modals */
var upload = {};
(function() {
    
this.uploader = function() {
    var my = function(sel) {
        var m = sel.append('div').attr('class','modal hide fade').attr('id','uploader');
        var h = m.append('div').attr('class','modal-header');
        h.append('h3').text('Upload project data');
        var b = m.append('div').attr('class','modal-body');
        b.append('p').text('Paste your CSV below');
        b.append('textarea')
            .attr('name','csvtext')
            .attr('rows','5')
            .attr('class','input-block-level');
        var f = m.append('div').attr('class','modal-footer');
        f.append('a')
            .attr('data-dismiss','modal')
            .attr('class','btn').text('Close');
        f.append('a')
            .attr('data-dismiss','modal')
            .attr('id','uploadit')
            .attr('class','btn btn-primary').text('Save');
    };
    return my;
};

this.revuploader = function() {
    var my = function(sel) {
        var m = sel.append('div').attr('class','modal hide fade').attr('id','revuploader');
        var h = m.append('div').attr('class','modal-header');
        h.append('h3').text('Upload project revenue data');
        var b = m.append('div').attr('class','modal-body');
        b.append('p').text('Paste your CSV below');
        b.append('textarea')
            .attr('name','csvrevtext')
            .attr('rows','5')
            .attr('class','input-block-level');
        var f = m.append('div').attr('class','modal-footer');
        f.append('a')
            .attr('data-dismiss','modal')
            .attr('class','btn').text('Close');
        f.append('a')
            .attr('data-dismiss','modal')
            .attr('id','revuploadit')
            .attr('class','btn btn-primary').text('Save');
    };
    return my;
};

}).apply(upload);

/*global App:false, charts: false, d3:false, map:false, _:false */
/* visualization panes */
var viz = {};
(function() {
/* 
 * name
 * datum {Function(ports, portview, membership)}
 * mychart
 */
var tabconf = [
    {
        name: 'bubbles',
        datum: map.bubble(App.projSumList),
        mychart: charts.bubblechart().xlabel('Launch Cost(M)').ylabel('Risk (launch probability)')
    }, {
        name: 'portfolio bubbles',
        datum: map.bubble(App.projSumList),
        mychart: charts.bubblechart().summary(true).xlabel('Launch Cost (M)').ylabel('Risk (eNPV/NPV)')
    }, {
        name: 'portfolio landscape',
        datum:  map.bingo(App.projSumList),
        mychart:  charts.bingo().xlabel('Phase').ylabel('Therapeutic Area')
    }, {
        name: 'pareto',
        datum: map.pareto(App.projSumList),
        mychart:  charts.pareto().xlabel('Launch Cost (M)').ylabel('eNPV (M)')
    }, {
        name: 'revenue',
        datum: map.revenueTimeSeriesGroupedWithTarget(App.projRevList, App.revTargetList),
        mychart:  charts.stackedbarline().xlabel('Calendar Year').ylabel('Revenue (M)')
    }, {
        name: 'cost',
        datum: map.revenueTimeSeriesGroupedWithTarget(App.costList, App.budgetList),
        mychart:  charts.stackedbarline().xlabel('Calendar Year').ylabel('Cost (M)')
    }, {
        name: 'portfolio revenue',
        datum:  map.revenueLines(App.projRevList),
        mychart:  charts.line().xlabel('Calendar Year').ylabel('Revenue (M)')
    }, {
        name: 'portfolio cost',
        datum:  map.revenueLines(App.costList),
        mychart:  charts.line().xlabel('Calendar Year').ylabel('Cost (M)')
    }, {
        name: 'table',
        datum: map.table(App.projSumList.toJSON()),
        mychart:  charts.table()
    }, {
        name: 'multi',
        datum:  function(ports, portview, membership) {
            return {ports: ports, portview: portview, membership: membership};
        },
        mychart:  charts.multi()
            .components(
                [
                    [
                        { 
                            datum: map.bubble(App.projSumList),
                            mychart: charts.bubblechart().xlabel('Launch Cost(M)').ylabel('Risk (launch probability)') },
                        { 
                            datum: map.bubble(App.projSumList),
                            mychart: charts.bubblechart().summary(true).xlabel('Launch Cost (M)').ylabel('Risk (eNPV/NPV)')}
                    ],
                    [
                        { 
                            datum:  map.bingo(App.projSumList),
                            mychart:  charts.bingo().xlabel('Phase').ylabel('Therapeutic Area')},
                        {
                            datum: map.revenueTimeSeriesGroupedWithTarget(App.projRevList, App.revTargetList),
                            mychart:  charts.stackedbarline().xlabel('Calendar Year').ylabel('Revenue (M)')}
                    ]
                ]
            )
    }, {
        name: 'another multi',
        datum:  function(ports, portview, membership) {
            return {ports: ports, portview: portview, membership: membership};
        },
        mychart:  charts.multi()
            .components(
                [
                    [
                        { 
                            datum: map.bubble(App.projSumList),
                            mychart: charts.bubblechart().xlabel('Launch Cost(M)').ylabel('Risk (launch probability)') },
                        { 
                            datum:  map.bingo(App.projSumList),
                            mychart:  charts.bingo().xlabel('Phase').ylabel('Therapeutic Area')},
                        { 
                            datum: map.revenueTimeSeriesGroupedWithTarget(App.costList, App.budgetList),
                            mychart:  charts.stackedbarline().xlabel('Calendar Year').ylabel('Cost (M)')}
                    ],
                    [
                        { 
                            datum:  map.revenueLines(App.costList),
                            mychart:  charts.line().xlabel('Calendar Year').ylabel('Revenue (M)')},
                        { 
                            datum: map.revenueTimeSeriesGroupedWithTarget(App.projRevList, App.revTargetList),
                            mychart:  charts.stackedbarline().xlabel('Calendar Year').ylabel('Revenue (M)')},
                        { 
                            datum: map.revenueTimeSeries(App.projRevList),
                            mychart: charts.barchart().xlabel('Calendar Year').ylabel('Revenue (M)') }
                    ],
                    [
                        { 
                            datum:  map.revenueLines(App.projRevList),
                            mychart:  charts.line().xlabel('Calendar Year').ylabel('Revenue (M)')},
                        { 
                            datum: map.revenueTimeSeriesGrouped(App.projRevList),
                            mychart: charts.stackedbar().xlabel('Calendar Year').ylabel('Revenue (M)') },
                        { 
                            datum: map.revenueTimeSeries(App.projRevList),
                            mychart: charts.barchart().xlabel('Calendar Year').ylabel('Revenue (M)') }
                    ]
                ]
            )
    }, {
        name: 'yet another multi',
        datum:  function(ports, portview, membership) {
            return {ports: ports, portview: portview, membership: membership};
        },
        mychart:  charts.multi()
            .components(
                [
                    [
                        { 
                            datum: map.bubble(App.projSumList),
                            mychart: charts.bubblechart().xlabel('Launch Cost(M)').ylabel('Risk (launch probability)'),
                            colspan:2, rowspan: 2 },
                        { 
                            datum:  map.bingo(App.projSumList),
                            mychart:  charts.bingo().xlabel('Phase').ylabel('Therapeutic Area'), colspan:1}
                    ],
                    [
                        { 
                            datum: map.revenueTimeSeriesGroupedWithTarget(App.projRevList, App.revTargetList),
                            mychart:  charts.stackedbarline().xlabel('Calendar Year').ylabel('Revenue (M)')}
                    ],
                    [
                        { 
                            datum: map.revenueTimeSeriesGroupedWithTarget(App.costList, App.budgetList),
                            mychart:  charts.stackedbarline().xlabel('Calendar Year').ylabel('Cost (M)')},
                        { 
                            datum: map.revenueTimeSeries(App.projRevList),
                            mychart: charts.barchart().xlabel('Calendar Year').ylabel('Revenue (M)') },
                        { 
                            datum: map.revenueTimeSeries(App.projRevList),
                            mychart: charts.barchart().xlabel('Calendar Year').ylabel('Revenue (M)') }
                    ]
                ]
            )
    }
];


var tabcontent = function() {
    var width = 720;
    var height = 445;
    var tabindex = 0;
    // should this be part of the bound data instead?
    /* @type {portname_projname: boolean, ...} */
    var membership;
    /* @type ui.portconf */
    var ports;
    /* portfolios checked */
    var portview;
    var my = function(selection) {
        /*
         * render JUST the active tab's content
         * @param data [{name, datum, mychart}]
         */
        selection.each(function(data, i) {
            var mycontent = data[tabindex];
            // execute it here
            var datum = mycontent.datum(ports, portview, membership);
            var ct = d3.select(this).selectAll('div').data([datum]);
            ct.enter().append('div').attr('class','tab-content');
            ct.call(mycontent.mychart.width(width).height(height));
        });
    };
    my.portview = function(v) {
        if (!arguments.length) return portview;
        portview = v;
        return my;
    };
    my.ports = function(v) {
        if (!arguments.length) return ports;
        ports = v;
        return my;
    };
    my.membership = function(v) {
        if (!arguments.length) return membership;
        membership = v;
        return my;
    };
    my.tabindex = function(v) {
        if (!arguments.length) return tabindex;
        tabindex = v;
        return my;
    };
    my.width = function(v) {
        if (!arguments.length) return width;
        width = v;
        return my;
    };
    my.height = function(v) {
        if (!arguments.length) return height;
        height = v;
        return my;
    };
    return my;
};

var tabs = function() {
    var my = function(selection) {
        /*
         * render all the tabs, show the current tab as active
         * @param data {tab: tab, conf: conf}
         */
        selection.each(function(data, i) {
            var tabul = d3.select(this)
                .selectAll('ul')
                .data([data.conf]);

            tabul.enter()
                .append('ul')
                .attr('class','nav nav-tabs');

            var tabli = tabul
                .selectAll('li')
                .data(function(d){ return d; });

            tabli.enter().append('li')
                .append('a')
                .attr('id',function(d,i){return 'l'+i;})
                .attr('href', 'javascript:void(0)')
                .attr('class','viztab')
                .text(function(d){ return d.name; });

            tabli.attr('class',function(d,i){ 
                return (i === data.tab)?'active':'' ;
            });
        });
    };
    return my;
};
this.viztitle = function() {
    var my = function(selection) {
        var title = selection.selectAll('.title')
            .data(['Visualizations']);
        title.enter()
            .append('h4')
            .attr('class','title')
            .text(_.identity);
        title.exit().remove();
    };
    return my;
};

this.viztabs = function() {
    var tabindex = 0;
    var my = function(selection) {
        var tabsel = selection.selectAll('.viztabcontainer')
            .data([{tab:tabindex,conf:tabconf}]);
        tabsel.enter()
            .append('div')
            .attr('class','viztabcontainer');
        tabsel.call(tabs());
    };
    my.tabindex = function(v) {
        if (!arguments.length) return tabindex;
        tabindex = v;
        return my;
    };
    return my;
};

this.vizcontent = function() {
    var width = 720;
    var height = 445;
    var tabindex = 0;
    /* @type {portname_projname: boolean, ...} */
    var membership;
    /* @type ui.portconf */
    var ports ;
    var portview ;
    var my = function(selection) {

        var ct = selection.selectAll('.vizcontentcontainer')
            .data([tabconf]);

        ct.enter()
            .append('div')
            .attr('class','vizcontentcontainer');

        ct.call(tabcontent()
            .width(width)
            .height(height)
            .tabindex(tabindex)
            .membership(membership)
            .ports(ports)
            .portview(portview)
        );
    };
    my.portview = function(v) {
        if (!arguments.length) return portview;
        portview = v;
        return my;
    };
    my.ports = function(v) {
        if (!arguments.length) return ports;
        ports = v;
        return my;
    };
    my.membership = function(v) {
        if (!arguments.length) return membership;
        membership = v;
        return my;
    };
    my.tabindex = function(v) {
        if (!arguments.length) return tabindex;
        tabindex = v;
        return my;
    };
    my.width = function(v) {
        if (!arguments.length) return width;
        width = v;
        return my;
    };
    my.height = function(v) {
        if (!arguments.length) return height;
        height = v;
        return my;
    };
    return my;
};
}).apply(viz);

/*global App:false, d3:false, upload:false, viz:false, _:false */
  /*
 * UI module (http://bost.ocks.org/mike/chart/)
 */

var ui = {};
(function() {


this.portvizrender = function() {
    var my = function(sel) {
        var row = sel.append('div').attr('class','row-fluid');
        var menu = row.append('div').attr('class','span3');
        menu.append('div').attr('id','portvizmenu');
        var viz = row.append('div').attr('class','span9');
        viz.append('div').attr('id','portvizviz');
    };
    return my;
};

this.mainrender = function() {
  var my = function(d) {
    //var d = d3.selectAll(el)
    var w = d.append('div').attr('id','wrap');
    var c = w.append('div').attr('class','container-fluid');
    var bdy = c.append('div');

    var ni = bdy.append('div').attr('class','row-fluid')
        .append('div').attr('class','span12')
        .append('div').attr('class','navbar')
        .append('div').attr('class','navbar-inner');
    ni.append('a')
        .attr('class','brand')
        .attr('href','#')
        .html('Enrich Portfolio Visualizer');
    var f = ni.append('form')
        .attr('class','navbar-form pull-right');
    f.append('a')
        .attr('href','#uploader')
        .attr('class','btn')
        .attr('role','button')
        .attr('data-toggle','modal')
        .html('Upload project data');
    f.append('a')
        .attr('href','#revuploader')
        .attr('class','btn')
        .attr('role','button')
        .attr('data-toggle','modal')
        .html('Upload project revenue data');
    bdy.call(ui.portvizrender());
    d.append('div').attr('id','uploaders')
        .call(upload.uploader())
        .call(upload.revuploader());
  };
  return my;
};

this.portvizmenuhead = function() {
    var my = function(selection) {
        /* @param data {parent_id: x, id: y, name: z} */
        selection.each(function(data, i) {
            var g = d3.select(this);
            var l = g.append('div')
                .attr('class','accordion-heading')
                .append('label')
                .attr('class','checkbox');
            l.append('input')
                .attr('type','checkbox')
                //.attr('class','portfoliolistbinding')
                .attr('id', 'bind_'+data.id)
                .attr('value','');
            l.append('a')
                .attr('class','accordion-toggle')
                .attr('data-toggle','collapse')
                .attr('data-parent','#'+data.parent_id)
                .attr('href','#'+data.id)
                .text(data.name);
        });
    };
    return my;
};

this.portvizmanual = function() {
    var my = function(selection) {
        /* @param data {name, type, parent_id, id, render} */
        selection.each(function(data, i) {
            //console.log(data);
            var acc = d3.select(this);

            //var id = 'portvizmanual'
            var g = acc.append('div')
                .attr('class','accordion-group')
                .data([{parent_id: data.parent_id, id: data.id, name: data.name}])
                .call(ui.portvizmenuhead());
            var b = g.append('div')
                .attr('class','accordion-body collapse')
                .attr('id', data.id)
                .append('div')
                .attr('class','accordion-inner');
            b.append('p')
                .text('Manual portfolio config, e.g. a list of checkboxes');
            var fs = b.append('form')
                .append('fieldset');
            fs.append('legend')
                .text('Configuration');
    
            // a checkbox per project
            var ll = fs.selectAll('label')
                .data(App.projSumList.toJSON())
                .enter()
                .append('label')
                .attr('class','checkbox');
            ll.text(function(d){return d.Project;});
            ll.append('input')
                .attr('type','checkbox')
                //.attr('class','membershipbinding')
                .attr('id',function(d){return 'bind_' + data.id + '_' + d.Project;})
                .attr('name',function(d){return d.Project;})
                .attr('value','');
        });
    };
    return my;
};

this.portvizrnr = function() {
    var my = function(selection) {
        selection.each(function(data, i) {
            var acc = d3.select(this);
            var id = 'portvizrnr';
            var g = acc.append('div')
                .attr('class','accordion-group')
                .data([{parent_id: data.parent_id, id: id, name: 'Choose projects in NPV order'}])
                .call(ui.portvizmenuhead());
            var b = g.append('div')
                .attr('class','accordion-body collapse').attr('id', id)
                .append('div')
                .attr('class','accordion-inner');
            b.append('p').text('This is the "rank and yank" portfolio, an algorithm that ranks projects' +
                      'by NPV, and fills the portfolio until you run out of budget.');
            var fs = b.append('form').append('fieldset');
            fs.append('legend')
                .text('Configuration');
            fs.append('label')
                .text('budget limit');
            fs.append('input')
                .attr('type','text').attr('id','foo');
        });
    };
    return my;
};

this.portviznpv = function() {
    var my = function(selection) {
        selection.each(function(data, i) {
            var acc = d3.select(this);
            var id = 'portviznpv';
            var g = acc.append('div').attr('class','accordion-group')
                .data([{parent_id: data.parent_id, id: id, name: 'Risk-neutral maximum NPV'}])
                .call(ui.portvizmenuhead());
            var b = g.append('div').attr('class','accordion-body collapse').attr('id', id)
                .append('div').attr('class','accordion-inner');
            b.append('p').text('This is what Ron Howard rationalists say you should do:' +
                      'Optimize over project combinations to find the highest' +
                      'portfoio expected risk-neutral NPV, given only a cost constraint');
            var fs = b.append('form').append('fieldset');
            fs.append('legend').text('Configuration');
            fs.append('label').text('budget limit');
            fs.append('input').attr('type','text').attr('id','foo');
        });
    };
    return my;
};

this.portvizprospect = function() {
    var my = function(selection) {
        selection.each(function(data, i) {
            var acc = d3.select(this);
            var id = 'portvizprospect';
            var g = acc.append('div')
                .attr('class','accordion-group')
                .data([{parent_id: data.parent_id, id: id, name: 'Prospect-theorist utility function'}])
                .call(ui.portvizmenuhead());
            var b = g.append('div')
                .attr('class','accordion-body collapse')
                .attr('id', id)
                .append('div')
                .attr('class','accordion-inner');
            b.append('p').text('This is what behavioral economists think you should do:' +
                      'Optimize over project combinations to find the highest' +
                      'portfoio expected NPV, given a cost constraint' +
                      'and some utility function parameters');
            var fs = b.append('form')
                .append('fieldset');
            fs.append('legend').text('Configuration');
            fs.append('label').text('budget limit');
            fs.append('input').attr('type','text').attr('id','foo');
            fs.append('label').text('maximum loss limit');
            fs.append('input').attr('type','text').attr('id','foo');
            fs.append('label').text('loss aversion');
            fs.append('input').attr('type','text').attr('id','foo');
            fs.append('label').text('risk aversion');
            fs.append('input').attr('type','text').attr('id','foo');
        });
    };
    return my;
};

this.portvizmenu = function() {
    var my = function(selection) {
        var sel = selection;
        var id = 'portvizmenu';
        sel.append('h4').text('Portfolios');
        var acc = sel.append('div').attr('class','accordion').attr('id',id);

        var ports = _.map(ui.portconf, function(x) {
            return _.extend(x,
                {
                    parent_id: id,
                    id: x.id, 
                    render: ui.porttypes[x.type].render
                });
        });

        var ppp = acc.selectAll('div').data(ports);
        ppp.enter().append('div');

        ppp.each(function(data, i){ d3.select(this).call(data.render); });

        sel.append('div').classed('row-fluid',1)
            .append('div').classed('span12',1)
            .append('a').attr('href','#').attr('class','btn pull-right')
            .text('Make a new portfolio');
    };
    return my;
};

this.portvizviz = function() {
    var my = function(selection) {
        /* @param data {width, height, tabindex, membership, ports} */
        selection.each(function(data, i) {
            d3.select(this)
                .call(viz.viztitle())
                .call(viz.viztabs().tabindex(data.tabindex))
                .call(viz.vizcontent()
                    .width(data.width)
                    .height(data.height)
                    .tabindex(data.tabindex)
                    .membership(data.membership)
                    .ports(data.ports)
                    .portview(data.portview)
                );
          });
    };
    return my;
};

/* port types by name */
this.porttypes = {
    portvizprospect: {
        render: ui.portvizprospect()
    },
    portviznpv: {
        render: ui.portviznpv()
    },
    portvizrnr: {
        render: ui.portvizrnr()
    },
    portvizmanual: {
        render: ui.portvizmanual()
    }
};

// TODO: make this a backbone-bound collection
// TODO: use the name here, and make the type name a subhead or something
// index is used for color. TODO: something smarter.
this.portconf = [
    {index: 0, id: 'p1', type: 'portvizmanual', name: 'Option One'},
    {index: 1, id: 'p2', type: 'portvizmanual', name: 'Option Two'},
    {index: 2, id: 'p3', type: 'portvizmanual', name: 'Option Three'},
    {index: 3, id: 'p4', type: 'portvizmanual', name: 'Option Four'},
    {index: 4, id: 'p5', type: 'portvizmanual', name: 'Option Five'},
    {index: 5, id: 'p6', type: 'portvizmanual', name: 'Option Six'}
];



}).apply(ui);



App.goldenRatio = 1.618;
App.widthPad = 20;

// TODO: maybe put the stuff below back into the view?

/* @param el {jquery selection} */
App.PortVizMenu = function(el) {
    el.empty();
    d3.selectAll(el).call(ui.portvizmenu());
};

/* @param el {jquery selection} */
App.MainRenderer = function(el) {
    d3.selectAll(el).call(ui.mainrender());
};

/**
 * updatable 
 *
 * @param el {jquery selection}
 * @param tabindex {Integer}
 * @param membership {App.MembershipModel}
 */
App.PortVizViz = function(el, tabindex, membership, portview) {
    var elwidth = el.width();
    var width = elwidth - App.widthPad;
    var height = elwidth / App.goldenRatio;
    d3.selectAll(el)
        .data([{
            width: width,
            height: height,
            tabindex: tabindex,
            membership: membership.toJSON(),
            ports: ui.portconf,
            portview: portview.toJSON()
        }])
        .call(ui.portvizviz());
};





/*global App:false, Backbone:false, _:false, csvToJson:false */
/*
 * so far we just have one view, so one file
 */
App.MainView = Backbone.View.extend({
    currenttab: 0,
    // TODO: membership vector per portfolio
    membershipmodel: undefined,
    portfoliolistmodel: undefined,
    csvmodel: undefined,
    membershipModelBinder: undefined,
    portfolioListModelBinder: undefined,
    uploadModelBinder: undefined,
    initialize: function() {
        this.membershipModelBinder = new Backbone.ModelBinder();
        this.portfolioListModelBinder = new Backbone.ModelBinder();
        this.uploadModelBinder = new Backbone.ModelBinder();
        this.membershipmodel = new App.MembershipModel();
        this.portfoliolistmodel = new App.PortfolioListModel();
        this.membershipmodel.bind('change', this.fixup, this);
        this.portfoliolistmodel.bind('change', this.fixup, this);
    },
    render: function() {
        this.csvmodel = new App.CsvModel();
        this.$el.empty();
        App.MainRenderer(this.$el);
        App.PortVizMenu($('#portvizmenu'));
        this.renderviz();
        // make bindings
        var membershipBinding = {};
        _.each(_.keys(this.membershipmodel.toJSON()), function(x) {
            membershipBinding[x] = '#bind_' + x;
        });
        var portfolioListBinding = {};
        _.each(_.keys(this.portfoliolistmodel.toJSON()), function(x) {
            portfolioListBinding[x] = '#bind_' + x ;
        });
        this.membershipModelBinder.bind(
            this.membershipmodel,
            this.el,
            membershipBinding
        );
        this.portfolioListModelBinder.bind(
            this.portfoliolistmodel,
            this.el,
            portfolioListBinding);
        this.uploadModelBinder.bind(this.csvmodel, this.$('#uploaders'));
        // turn on the tooltips
        $('[rel=tooltip]').tooltip({html:true});
    },
    renderviz: function() {
        App.PortVizViz($('#portvizviz'), this.currenttab, this.membershipmodel, this.portfoliolistmodel);
    },
    events: {
        'click #uploadit':     'uploadit',
        'click #revuploadit':  'revuploadit',
        'click .viztab':       'viztab'
    },
    fixup: function() {
        //console.log('fixup')
        this.renderviz(); // update membership => render again with the bound data
    },
    viztab: function(x) {
        this.currenttab = x.target.id.substring(1);
        this.renderviz();
    },
    uploadit: function(x) {
        console.log('raw data: ' + JSON.stringify(this.csvmodel.toJSON()));
        var csvtext = this.csvmodel.get('csvtext');
        // TODO: oops, d3 has a csv parser too, duh.  use that one?
        var jsondata = csvToJson(csvtext);
        console.log('parsed data: ' + JSON.stringify(jsondata));

        App.projSumList.reset(jsondata);
        App.PortVizMenu($('#portvizmenu'));
        App.PortVizViz($('#portvizviz'), this.currenttab, this.membershipmodel, this.portfoliolistmodel);
    },
    revuploadit: function(x) {
        console.log('raw revenue data: ' + JSON.stringify(this.csvmodel.toJSON()));
        var csvrevtext = this.csvmodel.get('csvrevtext');
        // TODO: oops, d3 has a csv parser too, duh.  use that one?
        var jsondata = csvToJson(csvrevtext);
        console.log('parsed revenue data: ' + JSON.stringify(jsondata));

        App.projRevList.reset(jsondata);
        App.PortVizMenu($('#portvizmenu'));
        App.PortVizViz($('#portvizviz'), this.currenttab, this.membershipmodel, this.portfoliolistmodel);
    },
    remove: function() {
        this.membershipModelBinder.unbind();
        this.uploadModelBinder.unbind();
        this.$el.empty();
    }
});



/*global App:false, Backbone:false, money:false */
// default money formatter
var fmt = money.fmt();

// TODO: make the margins somehow aware of large-label issues
App.margins = {top: 40, right: 40, bottom: 60, left: 150};

App.AppRouter = Backbone.Router.extend({
      routes: {
                "@url": "def"
                    },
                        def: function(url) {
                              }
});

App.main = new App.MainView({
      el: $('body')
});
App.main.render();

// do this at the end
$(function(){
      App.app = new App.AppRouter();
          Backbone.history.start();
});
