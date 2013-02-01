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
        selection.each(function(data) {

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
