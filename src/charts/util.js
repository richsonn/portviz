/*global App:false, charts:false, d3:false */
/* 
 * a collection of shared things.
 */
(function() {
this.xaxis = function() {
    var width = 720;
    var height = 445;
    var label = '';
    var scale ;

    // in pixels.  TODO: draw the label, find out its actual getBBox height, and then
    // provide that to subsequent drawing steps.
    var labelheight = 12;
    var my = function(selection) {
        var innerwidth = width - App.margins.left - App.margins.right;
        var innerheight = height - App.margins.top - App.margins.bottom;
        selection.each(function(data, i) {
            var transformed = d3.select(this);

            var axis = d3.svg.axis()
                .scale(scale)
                .orient("bottom");

            var sel = transformed.selectAll('.x.axis').data(['hi']);
            sel.enter().append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + innerheight + ")");

            sel.call(axis);
            var txt = sel.selectAll('.x.label').data([label]);
            txt.enter().append('text');
            txt.attr('class','x label')
                .attr('text-anchor', 'middle')
                .attr('x', innerwidth / 2)
                .attr('y',  App.margins.bottom)
                .attr('dy', '-0.75em')
                .text(function(d){return d;});
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
    my.label = function(v) {
        if (!arguments.length) return label;
        label = v;
        return my;
    };
    my.scale = function(v) {
        if (!arguments.length) return scale;
        scale = v;
        return my;
    };
    return my;
};

this.yaxis = function() {
    var width = 720;
    var height = 445;
    var label = '';
    var scale ;
    var my = function(selection) {
        var innerwidth = width - App.margins.left - App.margins.right;
        var innerheight = height - App.margins.top - App.margins.bottom;
        selection.each(function(data, i) {
            var transformed = d3.select(this);

            var axis = d3.svg.axis()
                .scale(scale)
                .orient("left");
    
            var sel = transformed.selectAll('.y.axis').data(['hi']);
            sel.enter().append("g")
                .attr("class", "y axis");

            sel.call(axis);
            var txt = sel.selectAll('.y.label').data([label]);
            txt.enter().append('text');
            txt.attr('class','y label')
                .attr('text-anchor','middle')
                .attr('dy', '1em')
                .attr('transform',
                    'translate(' + -1 * App.margins.left + ', ' + innerheight / 2 + ') rotate(-90)')
                .text(function(d){return d;});

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
    my.label = function(v) {
        if (!arguments.length) return label;
        label = v;
        return my;
    };
    my.scale = function(v) {
        if (!arguments.length) return scale;
        scale = v;
        return my;
    };
    return my;
};
}).apply(charts);
