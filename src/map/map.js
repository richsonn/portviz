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
    var randomports = _.map(_.range(5000), function() {
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
             contains: function() { return Math.random() > 0.6; }
         },
        {
             portfolio: 'Portfolio 2',
             contains: function() { return Math.random() > 0.4; }
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

}).apply(portviz.map);
