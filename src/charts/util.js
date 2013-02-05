/*global App:false, portviz:false, d3:false, _:false */
(function() {

/*
 * selection datum should contain a 'label' field, and
 * should accomodate the tips fifo called 'tips'.
 *
 * using a single tooltip element exposes the add/remove race,
 * so it's easier to have lots of them; by id.  that way we can
 * nicely transition the fade of the old one, while creating
 * new ones.  so each mouseover target datum gets a fifo of
 * tooltips called 'tips'.
 *
 * container is where to append the tooltip.  this should
 * be an outer container of the 'tipped' items, so the tip itself
 * is painted last.
 */
this.tooltip = function(container) {
  var ttidx = 0;
  var my = function(sel) {
    sel.each(function(datum) {
      // each selection is a mouseover target
      var selection = d3.select(this);
      selection
        .on("mouseover", function(){
          ttidx += 1;
          var tooltip = container.selectAll('g#tip'+ttidx).data([datum]);
          if (_.isUndefined(datum.tips)) {
            datum.tips = [];
          } 
          datum.tips.push(ttidx);

          tooltip.enter().append('g');
          tooltip.exit().remove();

          var xy = d3.mouse(this);
          tooltip
            .attr('class','tooltip2')
            .attr('id','tip'+ttidx) // unique id!
            .attr('transform', 'translate(' + xy[0] + ',' + xy[1] + ')')
            .attr('opacity', 1);

          // rect is underneath, so goes first
          var ttrect = tooltip.selectAll('rect').data([datum]);
          ttrect.enter().append('rect');

          var tttext = tooltip.selectAll('text').data([datum]);
          tttext.enter().append('text');

          tttext.text(function(d1){ return d1.label; });

          var xoffset = 20;
          var yoffset = 20;
          var xpadding = 10;
          var ypadding = 10;

          tttext.attr('x',xoffset).attr('y',yoffset).attr('rx',5).attr('ry',5);

          var bn = tttext.node();
          if (_.isNull(bn)) {
            console.log('???');
            return;
          }
          var bbox = tttext.node().getBBox();
  
          // finally set the size of the box
          ttrect
            .attr('width',bbox.width + 2 * xpadding)
            .attr('height',bbox.height + 2 * ypadding)
            .attr('x',bbox.x - xpadding)
            .attr('y',bbox.y - ypadding)
            .attr('rx',5)
            .attr('ry',5);
  
        })
        .on("mouseout", function(){
          var rmidx = datum.tips.shift();
          var tooltip = container.selectAll('g#tip'+rmidx);
          tooltip.transition(2000).attr('opacity', 0).remove(); // fade out
        });
    });
  };
  return my;
};

this.xaxis = function() {
    var width = 720;
    var height = 445;
    var label = '';
    var scale ;

    // in pixels.  TODO: draw the label, find out its actual getBBox height, and then
    // provide that to subsequent drawing steps.
    // var labelheight = 12;
    var my = function(selection) {
        var innerwidth = width - App.margins.left - App.margins.right;
        var innerheight = height - App.margins.top - App.margins.bottom;
        selection.each(function() {
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
        var innerheight = height - App.margins.top - App.margins.bottom;
        selection.each(function() {
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
}).apply(portviz.charts);
