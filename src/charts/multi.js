/*global portviz:false, d3:false, _:false */
(function() {
this.multi = function() {

    // the layout follows the shape of this array,
    // which must be TWO DIMENSIONAL.
    var components = [];
    var width = 720;
    var height = 445;

    var my = function(selection) {
        // find the max rows
        // for now, all row heights are the same
        var colct =
            _.max(
                _.map(components, function(row) {
                        return _.reduce(row, function(total, cell) {
                            return total + (cell.colspan ? cell.colspan : 1);
                        }, 0);
                })
            );
        var rowheight = height / components.length;
        /* @param d i think this is nothing */
        selection.each(function(parentdata){
            //console.log(parentdata);
            // there's nothing interesting in the dataset.
            //d3.select(this).selectAll('*:not(div)').remove()
            d3.select(this).selectAll('div.tab-content > svg').remove();
            d3.select(this).selectAll('table.data-table').remove();
            var tbldiv = d3.select(this).selectAll('div')
                .data(['hi']);
            tbldiv.enter().append('div');

            var tbl = tbldiv.selectAll('table').data(['hi']);
            tbl.enter().append('table').attr('class','multi');

            var tr = tbl.selectAll('tr').data(components);
            tr.enter().append('tr');
           // .each(function(){console.log('fa')})
            tr.exit().remove();

            /* @param d a row */
            tr.each(function(d){
                //console.log('row')
                var cellwidth = width / colct;
                var td = d3.select(this).selectAll('td').data(d);

                td.enter().append('td');
                td.exit().remove();

                td.attr('colspan',function(d){return d.colspan ? d.colspan : 1;})
                    .attr('rowspan',function(d){return d.rowspan ? d.rowspan : 1;})
                    /* @param d {datum, mychart} datum = function(ports, portview, membership) */
                    .each(function(d) {
                        //console.log('cell')
                        var chartwidth = cellwidth * (d.colspan ? d.colspan : 1);
                        var chartheight = rowheight * (d.rowspan ? d.rowspan : 1);
                        var hscale = chartwidth / width;
                        var vscale = chartheight / height;

                        var svg = d3.select(this).selectAll('svg.cellcontainer')
                            .data([['g']]);
                        svg.enter().append('svg').attr('class','cellcontainer');
                        svg.exit().remove();

                        svg.attr('width', chartwidth)
                            .attr('height', chartheight);

                        var ddd = d.datum(parentdata.ports, parentdata.portview, parentdata.membership);

                        var svgg = svg.selectAll('g.gcontainer').data([ddd]);
                        svgg.enter().append('g').attr('class','gcontainer');
                        svgg.exit().remove();

                        svgg.attr('transform', 'scale(' + hscale + ',' + vscale + ')');

                        svgg.call(
                                d.mychart
                                    .width(width)
                                    .height(height)
                            );
                    });
            });
        });
    };
    my.components = function(v) {
        if (!arguments.length) return components;
        components = v;
        return my;
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
    return my;
};
}).apply(portviz.charts);
