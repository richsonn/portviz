/*global App:false, portviz:false, d3:false, _:false */
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
        selection.each(function(d) {
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
                        return String(x.label) === String(label);
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

            d3.select(this).selectAll('table').remove();
            d3.select(this).selectAll('svg.stacked-bar').remove();
            d3.select(this).selectAll('svg.stacked-bar-line').remove();
            d3.select(this).selectAll('svg.linechart').remove();
            d3.select(this).selectAll('svg.bingochart').remove();
            d3.select(this).selectAll('svg.bubble').remove();
            d3.select(this).selectAll('svg.barchart').remove();

            var svg = d3.select(this).selectAll('svg')
                .data(['hi']);

            svg.enter().append('svg');

            var sel = svg.attr('width', width)
                .attr('height', height )
                .attr('class','stacked-bar')
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


}).apply(portviz.charts);
