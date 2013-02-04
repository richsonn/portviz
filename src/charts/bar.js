/*global App:false, portviz:false, d3:false, _:false */
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
        selection.each(function(d) {
            var data = d;
            var yset = _.map(data, function(a) { return a.y; });
            var ymin = d3.min(yset);
            if (ymin > 0) ymin = 0;
            var ymax = d3.max(yset);

            var xscale = d3.scale.ordinal()
                .domain(_.map(data, function(a) { return a.x; }))
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

            var xaxis = portviz.charts.xaxis()
                .width(width).height(height)
                .label(xlabel)
                .scale(xscale);

            var yaxis = portviz.charts.yaxis()
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


}).apply(portviz.charts);
