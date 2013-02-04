/*global App:false, portviz:false, _:false */
/*
 * Map domain models to view (i.e. chart) models.
 *
 * not really sure how this should work.  it's a sketch.
 *
 * TODO: add axis labeling to the mapping, since it's really part of the "view of the data".
 */

portviz.map = {};
(function() {


this.randompareto = function(items, weightfn, valuefn) {
  var randomports = _.map(_.range(5000), function() {
    var chosen = _.first( _.shuffle(items) , _.random(items.length) );
    return {
      x: _.reduce(chosen, function(t, x){return t + weightfn(x);}, 0),
      y: _.reduce(chosen, function(t, x){return t + valuefn(x);}, 0)
    };
  });

  var sortedports = _.sortBy(randomports, function(p) {
    return p.x;
  });

  var result = [];
  _.each(sortedports, function(s) {
    if (_.isEmpty(result) || (s.y > _.last(result).y))
      result.push({ x:s.x, y:s.y});
  });
  return result;

};

this.knapsackpareto = function(items, weightfn, valuefn) {
  var maxweight = _(items).reduce(function(t, x){
    if (valuefn(x) > 0) { return t + weightfn(x); }
    return t;
  }, 0);
  var steps = 200;
  var step = Math.floor(_.max([1, maxweight / steps]));

  var combiner = portviz.knapsack.combiner(items, weightfn, valuefn);
  var ef = combiner.ef(maxweight, step);
  return _.map(ef, function(x){ return {x:x.totalWeight,y:x.totalValue}; });
};

/*
 * @param port {id}
 * @param membership {portid_projname,...} projects turned on per port
 */
var portHasProj = function(port,membership) {
  /*
   * @param proj {Project}
   */
  return function(projname) {
    var key = port.id + '_' + projname;
    return _.has(membership, key) ? membership[key] : false;
  };
};

/*
 * histogram of launch years
 * @returns {
 *     x: [x, x, x,...],  (years)
 *     labels: [label, label, label, ...], (portfolios)
 *     data: [ { x: x, y: y (freq), label: label},... ] 
 * } 
 */
this.launchHist = function(pd) {
  /*
   * @param ports {ui.portconf} ALL ports ... maybe should use a singleton instead
   * @param portview {portid} portfolios turned on
   * @param membership {portid_projname,...} projects turned on per port
   */
  return function(ports, portview, membership) {
    var years = _.chain(pd).pluck('Lyear').uniq().sortBy(_.identity).value();
    var labels = _.pluck(_.filter(ports, function(port) {return portview[port.id];}), 'name');
    var data = _.flatten(_.map(_.filter(ports, function(port) {return portview[port.id];}) , function(port) {
        var php = portHasProj(port, membership);
        return _.map(years, function(year) {
          return {
            x: year,
            y: _.reduce(pd, function(t, p) {
              if (php(p.Project) && p.Lyear === year) return t + 1;
                return t;
            }, 0),
            label: port.name
          };
        });
      })
    );
    return {
      x: years,
      labels: labels,
      data: data
    };
  };
};

/*
 * produces one series, for use with the 'scatter' chart
 * x = portfolio cost, y = portfolio ENPV
 * you could use this with an 'optimizer' to make a pareto curve, thus the name.
 * but for now it just takes whatever portfolios exist.
 */
this.pareto = function(pd) {
    var proj = pd.toJSON();

    //var paretomaker = this.randompareto;
    var paretomaker = this.knapsackpareto;

    var paretobestports = paretomaker(proj, function(x){return +x.Lcost;}, function(x){return +x.NPV;});
    var paretoexpectedports = paretomaker(proj, function(x){return +x.Lcost;}, function(x){return +x.ENPV;});

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
 * @param {App.ProjectRevenues} dataset [{Projects:x, 2012:y, ...},...]
 * @returns {
 *     x: [x, x, x,...],  (years)
 *     labels: [{label, index}, ...], (portfolios)
 *     data: [ { x: x, y: y (rev), label: label},... ] 
 * }
 * {Array} [{x: year, y: yearsum}, ...]
 */
this.revenueTimeSeries = function(dataset) {
  /*
   * @param ports {ui.portconf} ALL ports ... maybe should use a singleton instead
   * @param portview {portid} portfolios turned on
   * @param membership {portid_projname,...} projects turned on per port
   */
  return function(ports, portview, membership) {
    var years = _.without(App.cols(dataset), 'Projects');
    var labels = _.map(_.filter(ports, function(port) {return portview[port.id];}), function(port) {
      return {label: port.name, index: port.index};});

    var data = _.flatten(
      _.map(
        _.filter(ports, function(port) {return portview[port.id];}),
           function(port) {
             var php = portHasProj(port, membership);
             return _.map(years, function(year) {
               var colsum = _.reduce(dataset, function(memo, x) {
                 if (php(x.Projects)) {return memo + Number(x[year]); }
                 else {return memo;}
               }, 0);
               return {
                 x: year,
                 y: colsum,
                 label: port.name
               };
             });

           }));
    return {
      x: years,
      labels: labels,
      data: data
    };
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
 * @param {membership} member  ... ?
 * @param {App.ProjectRevenues} rev [{Projects:x, 2012:y, ...},...]
 * @returns {
 *     x: [x, x, x,...],
 *     labels: [label, label, label, ...],
 *     data: [ { x: x, y: y, label: label},... ] 
 * } 
 */
this.revenueLines = function(rev) {
  //var revdataset = rev.toJSON();
  var revdataset = rev;
  var years = _.map(_.without(App.cols(revdataset), 'Projects'),function(x){return +x;}).sort();
  /*
   * @param ports {ui.portconf} ALL ports ... maybe should use a singleton instead
   * @param portview {portid} portfolios turned on
   * @param membership {portid_projname,...} projects turned on per port
   */
  return function(ports, portview, membership) {
    return {
      x: years,
      labels: _.pluck(_.filter(ports, function(port) {return portview[port.id];}), 'name'),
      data: _.flatten(
        _.map(
          _.filter( ports, function(port) { return portview[port.id];}), function(port) {
            var years = {};
            _.each(revdataset, function(project) {
              var key = port.id + '_' + project.Projects;
              if (membership[key]) {
                _.each(_.without(_.keys(project), 'Projects'), function(year) {
                  if (!_.has(years, year)) years[year] = 0;
                  years[year] += +project[year];
                });
              }
            });
            return _.map(_.keys(years), function(year) {
              return {x: year, y:years[year], label: port.name};
            });

          }
        )
      )
    };
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

}).apply(portviz.map);
