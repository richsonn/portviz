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
        selection.each(function(data) {
            //console.log(data)
            _.each(data.x, function(x) {
                var total = 0;
                var idx = 0;
                // fill in the cumulative field, in the correct label order.
                _.each(data.bars.labels, function(label) {
                    var item = _.find(data.bars.data, function(row){
                        return String(row.label) === String(label) && String(row.x) === String(x);
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
                        return String(row.label) === String(label) && String(row.x) === String(x);
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
