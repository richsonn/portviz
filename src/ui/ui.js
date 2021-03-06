/*global d3:false, portviz: false, viz:false, _:false */
  /*
 * UI module (http://bost.ocks.org/mike/chart/)
 */

portviz.ui = {};
(function() {


var portvizrender = function() {
    var my = function(sel) {
        var row = sel.append('div').attr('class','row-fluid');
        var menu = row.append('div').attr('class','span3');
        menu.append('div').attr('id','portvizmenu');
        var viz = row.append('div').attr('class','span9');
        viz.append('div').attr('id','portvizviz');
    };
    return my;
};

var mainrender = function() {
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
    bdy.call(portvizrender());
  };
  return my;
};

var portvizmenuhead = function() {
    var my = function(selection) {
        /* @param data {parent_id: x, id: y, name: z} */
        selection.each(function(data) {
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

var portvizmanual = function(allprojects) {

    // TODO: externalize these
    var labelfn = function(x){return x['Project'];};
    var keyfn = function(x){return labelfn(x).replace(/[^A-Za-z0-9]/g,'_');};

    var my = function(selection) {
        /* @param data {name, type, parent_id, id, render} */
        selection.each(function(data) {
            var acc = d3.select(this);

            var g = acc.append('div')
                .attr('class','accordion-group')
                .data([{parent_id: data.parent_id, id: data.id, name: data.name}])
                .call(portvizmenuhead());
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
            // 
            var ll = fs.selectAll('label')
                .data(allprojects)
                .enter()
                .append('label')
                .attr('class','checkbox');
            ll.text(function(d){return labelfn(d);});
            ll.append('input')
                .attr('type','checkbox')
                //.attr('class','membershipbinding')
                .attr('id',function(d){return 'bind_' + data.id + '_' + keyfn(d);})
                .attr('name',function(d){return labelfn(d);})
                .attr('value','');
        });
    };
    return my;
};

var portvizrnr = function() {
    var my = function(selection) {
        selection.each(function(data) {
            var acc = d3.select(this);
            var id = 'portvizrnr';
            var g = acc.append('div')
                .attr('class','accordion-group')
                .data([{parent_id: data.parent_id, id: id, name: 'Choose projects in NPV order'}])
                .call(portvizmenuhead());
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

var portviznpv = function() {
    var my = function(selection) {
        selection.each(function(data) {
            var acc = d3.select(this);
            var id = 'portviznpv';
            var g = acc.append('div').attr('class','accordion-group')
                .data([{parent_id: data.parent_id, id: id, name: 'Risk-neutral maximum NPV'}])
                .call(portvizmenuhead());
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

var portvizprospect = function() {
    var my = function(selection) {
        selection.each(function(data) {
            var acc = d3.select(this);
            var id = 'portvizprospect';
            var g = acc.append('div')
                .attr('class','accordion-group')
                .data([{parent_id: data.parent_id, id: id, name: 'Prospect-theorist utility function'}])
                .call(portvizmenuhead());
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

var portvizmenu = function() {
    var my = function(selection) {
        var sel = selection;
        var id = 'portvizmenu';
        sel.append('h4').text('Portfolios');
        var acc = sel.append('div').attr('class','accordion').attr('id',id);

        // TODO: pull this out
        var ports = _.map(portviz.client.pharma.portconf, function(x) {
            return _.extend(x,
                {
                    parent_id: id,
                    id: x.id, 
                    render: porttypes[x.type].render
                });
        });

        var ppp = acc.selectAll('div').data(ports);
        ppp.enter().append('div');

        ppp.each(function(data){ d3.select(this).call(data.render); });

        sel.append('div').classed('row-fluid',1)
            .append('div').classed('span12',1)
            .append('a').attr('href','#').attr('class','btn pull-right')
            .text('Make a new portfolio');
    };
    return my;
};

var portvizviz = function() {
    var my = function(selection) {
        /* @param data {width, height, tabindex, membership, ports} */
        selection.each(function(data) {
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
var porttypes = {
    portvizprospect: {
        render: portvizprospect()
    },
    portviznpv: {
        render: portviznpv()
    },
    portvizrnr: {
        render: portvizrnr()
    },
    portvizmanual: {
        // CLIENT-SPECIFIC! TODO: extract this somewhere else
        render: portvizmanual(portviz.client.pharma.projSumList.toJSON())
    }
};


this.PortVizMenu = function(el) {
    el.empty();
    d3.selectAll(el).call(portvizmenu());
};

this.MainRenderer = function(el) {
    d3.selectAll(el).call(mainrender());
};


/**
 * updatable 
 *
 * @param el {jquery selection}
 * @param tabindex {Integer}
 * @param membership
 */
this.PortVizViz = function(el, tabindex, membership, portconf, portview) {
    var goldenRatio = 1.618;
    var widthPad = 20;
    var elwidth = el.width();
    var width = elwidth - widthPad;
    var height = elwidth / goldenRatio;
    d3.selectAll(el)
        .data([{
            width: width,
            height: height,
            tabindex: tabindex,
            membership: membership.toJSON(),
            ports: portconf,
            portview: portview.toJSON()
        }])
        .call(portvizviz());
};


}).apply(portviz.ui);






