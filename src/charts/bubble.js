/*global portviz:false, d3:false, _:false */
(function() {
this.bubblechart = function() {
    var width = 720;
    var height = 445;
    var xlabel = '';
    var ylabel = '';
    /*
     * aggregate projects into portfolio.  to do this,
     * each point is plotted as if it were the aggregate.
     */
    var summary = false;
    var my = function(selection) {
        var innerwidth = width - portviz.margins.left - portviz.margins.right;
        var innerheight = height - portviz.margins.top - portviz.margins.bottom;

        /*
         * takes multiple portfolios
         * @param data 
         *     [
         *         {
         *             label: label (portfolio name),
         *             data: [...]
         *         },...
         *     ]
         */
         //console.log(selection)
        selection.each(function(data) {
            //console.log('bubble')
            //console.log(data);
            // pretend, for now, that all svg's can transition to each other.
            // and further, that the only non-svg thing is a table.
            //var rrr = d3.select(this).selectAll('*:not(svg)')
            //var rrr = d3.select(this).selectAll('table')
            //rrr.remove()
            //rrr.each(function(d){console.log('rrr');console.log(d)})
            d3.select(this).selectAll('table').remove();
            d3.select(this).selectAll('div.tab-content').remove();
            d3.select(this).selectAll('svg.stacked-bar-line').remove();
            d3.select(this).selectAll('svg.linechart').remove();
            d3.select(this).selectAll('svg.scatter').remove();
            d3.select(this).selectAll('line.xgrid').remove();
            d3.select(this).selectAll('line.ygrid').remove();
            d3.select(this).selectAll('svg.barchart').remove();


            // extend each point with aggregates, to make transitions easier
            _.each(data, function(series) {
                var seriescost = _.reduce(series.data,function(m,d){return m+Number(d.Lcost);},0);
                var seriesnpv = _.reduce(series.data,function(m,d){return m+Number(d.NPV);},0);
                var seriesenpv = _.reduce(series.data,function(m,d){return m+Number(d.ENPV);},0);
                var seriesrisk = seriesenpv / seriesnpv;

                series.data = _.map(series.data, function(d) {
                    return _.extend(_.clone(d), {
                        label: series.label,
                        labelindex: series.index,
                        seriescost: seriescost,
                        seriesrisk: seriesrisk,
                        seriesenpv: seriesenpv
                    });
                });
            });

            // bigger bubbles underneath little ones
            _.each(data, function(d){
                _.sortBy(d.data, function(row) {return -1 * summary?row.seriesnpv:row.ENPV;});
            });

            //var mincost = _.min(_.flatten(_.map(data, function(series) {
            //    return _.map(series.data, function(x){return summary?x.seriescost:+x.Lcost;});
            //})));
            var maxcost = _.max(_.flatten(_.map(data, function(series) {
                return _.map(series.data, function(x){return summary?x.seriescost:+x.Lcost;});
            })));

            var xscale = d3.scale.linear()
                .domain([0, maxcost])
                .range([0, innerwidth])
                .nice();
    
            var yscale = d3.scale.linear()
                .domain([0,1])
                .range([innerheight, 0])
                .nice();

            //var minenpv = _.min(_.flatten(_.map(data, function(series) {
            //    return _.map(series.data, function(x){return summary?x.seriesenpv:+x.ENPV;});
            //})));
            var maxenpv = _.max(_.flatten(_.map(data, function(series) {
                return _.map(series.data, function(x){return summary?x.seriesenpv:+x.ENPV;});
            })));

            // Z = bubble size = ENPV
            // http://makingmaps.net/2007/08/28/perceptual-scaling-of-map-symbols/
            var zscale = d3.scale.pow().exponent(0.85)
                .domain([0, maxenpv])
                .range([0, width / 30]);


            var colorScale = d3.scale.category10().domain(_.range(100));

            // X = Lcost
            var xaxis = portviz.charts.xaxis()
                .width(width).height(height)
                .label(xlabel)
                .scale(xscale);

            // Y = Plaunch
            var yaxis = portviz.charts.yaxis()
                .width(width).height(height)
                .label(ylabel)
                .scale(yscale);

            var svg = d3.select(this).selectAll('svg').data(['hi']);

            svg.enter().append("svg");
            svg.exit().remove();

            svg.attr("width", width)
                .attr("height", height)
                .attr("class", "bubble dot chart");

            var transformed = svg.selectAll('g.chartcontainer').data(['hi']);

            transformed.enter().append("g");
            transformed.exit().remove();
            transformed.attr('class','chartcontainer')
                .attr("transform", "translate(" + portviz.margins.left + "," + portviz.margins.top + ")");

            transformed.call(xaxis);
            transformed.call(yaxis);

            // no reason for hierarchy, it's just dots.
            var flattened = _.flatten(_.map(data, function(port) {
                return _.map(port.data, function(proj) {
                    var key = port.label + '::' + proj.Project;
                    return _.extend(_.clone(proj), {key: key, project: proj.Project, label: port.label});
                });
            }));

            var bigdiameter = function(d) {
                if (summary) return zscale(d.seriesenpv);
                return Math.max(40, (+d.ENPV < 0) ? 5 : zscale(+d.ENPV));
            };


            var sss = transformed.selectAll('a.dot').data(flattened, function(d) {return d.key;});

            // just sets initial values for the transition
            sss.enter().append('a');

            sss.attr("class", "dot");

            var ssc = sss.selectAll('circle').data(function(d){return [d];});

            var sscenter = ssc.enter().append("circle")
                .attr("cx", function(d) { 
                    return xscale(summary?d.seriescost:+d.Lcost);
                })
                .attr("cy", function(d) { 
                    return yscale(summary?d.seriesrisk:+d.Plaunch); 
                })
                .attr("r", bigdiameter);
            // used to hide the new project dot until the portfolio covers it up
            if (summary) sscenter.attr('opacity', 0);

            ssc.exit().remove();

            var ssst = ssc.transition();
            ssst.attr("cx", function(d) { 
                    return xscale(summary?d.seriescost:+d.Lcost);
                })
                .attr("cy", function(d) { 
                    return yscale(summary?d.seriesrisk:+d.Plaunch); 
                })
                .attr("r",  function(d) { 
                    return ((summary?+d.seriesenpv:+d.ENPV) < 0) ? 5 : zscale(summary?+d.seriesenpv:+d.ENPV);
                })
                .attr("fill", function(d) {
                     return ((summary?d.seriesenpv:d.ENPV) < 0 ) ? 'white': colorScale(d.labelindex);
                })
                .attr("stroke", function(d) {
                     return colorScale(d.labelindex);
                })
                .attr('name',function(d){return d.Project;});

            // don't show the new project dots until the moving is done
            if (summary) {ssst.transition().duration(0).attr('opacity', 1);}
            else {ssst.attr('opacity', data.length > 1 ? (1 / Math.sqrt(data.length)) : 1);}

            var ssse = sss.exit();
            if (!summary) {
                ssse.select('circle').transition().attr("r", bigdiameter).remove();
                ssse.transition().remove(); // parallel transition, weird.
            } else {
                ssse.remove();
            }

          sss.call(portviz.charts.tooltip(transformed,
              function(d){
                    return [summary?d.label:d.Project ,
                        '\nEPNV: ' , Number(summary?d.seriesenpv:d.ENPV).toFixed() ,
                        '\ncost: ' , Number(summary?d.seriescost:d.Lcost).toFixed() ,
                        '\np: ' , Number(summary?d.seriesrisk:d.Plaunch).toFixed(2)].join('') ; }
            ).width(innerwidth)
             .height(innerheight));

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
    my.summary = function(v) {
        if (!arguments.length) return summary;
        summary = v;
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
