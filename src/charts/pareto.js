/*global App:false, portviz:false, d3:false, _:false */
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
        selection.each(function(dddd) {
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

            var xaxis = portviz.charts.xaxis()
                .width(width).height(height)
                .label(xlabel)
                .scale(xscale);

            var yaxis = portviz.charts.yaxis()
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
            d3.select(this).selectAll('svg.barchart').remove();
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
                // i tried interpolation here but there are enough points so it isn't necessary.
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

}).apply(portviz.charts);
