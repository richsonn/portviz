/*global App:false, charts:false, d3:false, _:false */
(function() {
this.table = function() {
    /*
     * now updatable
     */
    var my = function(selection) {
        selection.each(function(dataset) {

            // TODO: add portfolio membership columns.

            // TODO: pull out special columns, e.g. Project Name
            var cols = App.cols(dataset);

            // make a dataset that's easy for d3 to walk through
            var squaredata = [];
            _.each(dataset, function(row) {
                var newrow = [];
                _.each(cols, function(col, index) {
                    newrow[index] = row[col];
                });
                squaredata.push(newrow);
            });

            // a table can't transition with anything but itself,
            // so first remove anything that's not a table.
            d3.select(this).selectAll('*:not(table)').remove();
            var tbl = d3.select(this).selectAll('table')
                .data(['table']);

            // first time, add the table
            tbl.enter().append('table')
                .attr('class','table data-table table-bordered table-condensed table-hover');

            var thead = tbl.selectAll('thead').data(['thead']);
            thead.enter().append('thead');

            var tr = thead.selectAll('tr').data(['tr']);
            tr.enter().append('tr');

            var th = tr.selectAll('th')
                .data(cols);
            th.enter().append('th');
            th.text(function(x){return x;});

            var br = tbl.append('tbody')
                .selectAll('tr')
                .data(squaredata);
            br.enter().append('tr');

            var td = br.selectAll('td')
                .data(function(d){return d;});

            td.enter().append('td');
            td.text(function(d){return d;});

         });

    };
    my.height = function(){return my;};
    my.width = function(){return my;};
    return my;
};


}).apply(charts);
