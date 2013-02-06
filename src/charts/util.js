/*global App:false, portviz:false, d3:false, _:false */
(function() {

/*
 * selection datum should contain a 'label' field, which can
 * contain multiple lines.  first line is emphasized.
 *
 * selection datum should accomodate the tips queue called 'tips'.
 *
 * using a single tooltip element exposes the add/remove race,
 * so it's easier to have lots of them; by id.  that way we can
 * nicely transition the fade of the old one, while creating
 * new ones.  so each mouseover target datum gets a queue of
 * tooltips called 'tips'.
 *
 * container is where to append the tooltip.  this should
 * be an outer container of the 'tipped' items, so the tip itself
 * is painted last.
 *
 * @param labelfn function to extract label from datum
 */
this.tooltip = function(container, labelfn) {
  var ttidx = 0;
  /*
   * @param sel selection to tip
   */
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

          // start out invisible; we move this box below and then expose it.
          tooltip
            .attr('class','tooltip2')
            .attr('id','tip'+ttidx) // unique id!
            .attr('opacity', 0);

          // rect is underneath, so goes first
          var ttrect = tooltip.selectAll('rect').data([datum]);
          ttrect.enter().append('rect');

          // text container
          var tttext = tooltip.selectAll('text').data([datum]);
          tttext.enter().append('text');
          tttext.attr('x', 0).attr('y', 0).attr('text-anchor','start');

          // split lines into tspans
          var ttspan = tttext.selectAll('tspan').data(function(d2){
            return labelfn(d2).split(/\r\n|\r|\n/g);
          });
          ttspan.enter().append('tspan');
          ttspan
            .attr('x',0)
            .attr('dy',function(d1,i){
              return (i===0?'1em':(i===1)?'1.5em':'1em');
            })
            .attr('class',function(d1,i){return (i===0?'head':'');});

          ttspan.text(function(dspan){ return dspan; });

          var bbox = tttext.node().getBBox();

          var padding = 10;
          ttrect
            .attr('width', bbox.width + 2 * padding)
            .attr('height', bbox.height + 2 * padding)
            .attr('x',0 - padding)
            .attr('y',0 - padding)
            .attr('rx',5)
            .attr('ry',5);

          var xy = d3.mouse(this);

          var xoffset = 20;
          var yoffset = 20;
          // if there's room on the right, put the box there.
          var right = width - (xy[0] + xoffset + bbox.width + padding);
          // if there's room on the bottom, put the box there.
          var bottom = height - (xy[1] + yoffset + bbox.height + padding);

          var xt;
          if (right > 0) {xt = xy[0] + xoffset;}
          else {xt = xy[0] - (xoffset + bbox.width);}

          var yt;
          if (bottom > 0) {yt = xy[1] + yoffset;}
          else {yt = xy[1] - (yoffset + bbox.height);}

          tooltip
            .attr('transform', 'translate(' + xt + ',' + yt + ')')
            .attr('opacity', 1);
        })
        .on("mouseout", function(){
          var rmidx = datum.tips.shift();
          var tooltip = container.selectAll('g#tip'+rmidx);
          tooltip.transition(2000).attr('opacity', 0).remove(); // fade out slowly
        });
    });
  };
  var width = 0;
  var height = 0;
  // paint the tip inside this width
  my.width = function(v) {
    if (!arguments.length) return width;
    width = v;
    return my;
  };
  // paint the tip inside this height
  my.height = function(v) {
    if (!arguments.length) return height;
    height = v;
    return my;
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
