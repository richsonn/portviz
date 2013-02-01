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
