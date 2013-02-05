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
     * @param d {
     *  x: [] (e.g. years)
     *  labels: [{label, index}] (e.g. portfolios)
     *  data: [{x,y,label,index}] (index is label index, for color)
     * }
     * @param d [{x: year, y: yearsum},...]
     */
    selection.each(function(data) {
      var colorindices = {};
      var axisindices = {};
      _.each(data.labels, function(lbl,idx) {
        colorindices[lbl.label] = lbl.index;
        axisindices[lbl.label] = idx;
      });
      var yset = _.map(data.data, function(a) { return a.y; });
      var ymin = d3.min(yset);
      if (ymin > 0) ymin = 0;
      var ymax = d3.max(yset);

      var xscale = d3.scale.ordinal()
          .domain(data.x)
          .rangeRoundBands([0, innerwidth], 0.1);

      var yscale = d3.scale.linear()
          .domain([ymin, ymax])
          .rangeRound([innerheight, 0]);

      var colorScale = d3.scale.category10().domain(_.range(100));

      var xaxis = portviz.charts.xaxis()
          .width(width).height(height)
          .label(xlabel)
          .scale(xscale);

      var yaxis = portviz.charts.yaxis()
          .width(width).height(height)
          .label(ylabel)
          .scale(yscale);

      d3.select(this).selectAll('table').remove();
      d3.select(this).selectAll('div.tab-content').remove();
      d3.select(this).selectAll('svg.stacked-bar').remove();
      d3.select(this).selectAll('svg.stacked-bar-line').remove();
      d3.select(this).selectAll('svg.linechart').remove();
      d3.select(this).selectAll('svg.scatter').remove();
      d3.select(this).selectAll('svg.bubble').remove();

      var svg = d3.select(this).selectAll('svg.barchart').data(['hi']);

      svg.enter().append('svg');
      svg.exit().remove();

      svg.attr('width', width)
          .attr('height', height )
          .attr('class','barchart');

      var sel = svg.selectAll('g.chartcontainer').data(['hi']);
      sel.enter().append('g');
      sel.exit().remove();


      sel.attr('class','chartcontainer')
        .attr('transform', 'translate(' + App.margins.left + ',' + App.margins.top + ')');

      sel.call(xaxis);
      sel.call(yaxis);

      // points
      var sss = sel.selectAll('g.bar').data(data.data, function(d){ return d.x+'::'+d.label; });
      sss.enter().append('g');
      sss.exit().remove();

      sss.attr('class','bar');
      // this is used to glue this thing to its tooltip.  yuck.
      //sss.attr('id',function(d,i){return 'bar'+i});

      var padding = 0.1 * xscale.rangeBand() / data.labels.length;

      var bar = sss.selectAll('rect').data(function(d){return [d];});
      bar.enter().append('rect')
          .attr('x', function(d) {
            return (padding/2) + xscale(d.x) + xscale.rangeBand() * axisindices[d.label] / data.labels.length;
          }) 
          .attr('width', (xscale.rangeBand()/data.labels.length) - padding)
          .attr('y', yscale(0))
          .attr('height', 0);

      bar.exit().remove();

      bar.transition().attr('class','bar')
          .attr('x', function(d) {
            return (padding/2) + xscale(d.x) + xscale.rangeBand() * axisindices[d.label] / data.labels.length;
          }) 
          .attr('width', (xscale.rangeBand()/data.labels.length) - padding)
          .attr('y', function(d) {
            return yscale(d.y);
           })
          .attr('height', function(d) {
            return yscale(0) - yscale(d.y);
          })
          .attr('opacity', 1)
          .attr('fill', function(d) {
            return colorScale(colorindices[d.label]);
          });

      // put tooltip at the end, make sure it's on top.
      // this fn manages the tooltip lifecycle
      sss.call(portviz.charts.tooltip(sel));

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
