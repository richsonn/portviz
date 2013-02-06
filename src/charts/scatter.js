/*global App:false, portviz:false, d3:false, _:false */
(function() {
this.scatter = function() {
    var width = 720;
    var height = 445;
    var xlabel = '';
    var ylabel = '';
    var my = function(selection) {
        var innerwidth = width - App.margins.left - App.margins.right;
        var innerheight = height - App.margins.top - App.margins.bottom;
        selection.each(function(data) {

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

            var xaxis = portviz.charts.xaxis()
                .width(width).height(height)
                .label(xlabel)
                .scale(xscale);

            var yaxis = portviz.charts.yaxis()
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
            sss.exit().remove();

            sss.attr('class','dot');

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

          sss.call(portviz.charts.tooltip(sel,
                function(d){
                    return [d.label ,
                        '<br>EPNV: ' , Number(d.y).toFixed() ,
                        '<br>cost: ' , Number(d.x).toFixed()].join('');}
          ).width(innerwidth).height(innerheight));

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
