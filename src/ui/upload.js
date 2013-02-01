/* data uploader modals */
var upload = {};
(function() {
    
this.uploader = function() {
    var my = function(sel) {
        var m = sel.append('div').attr('class','modal hide fade').attr('id','uploader');
        var h = m.append('div').attr('class','modal-header');
        h.append('h3').text('Upload project data');
        var b = m.append('div').attr('class','modal-body');
        b.append('p').text('Paste your CSV below');
        b.append('textarea')
            .attr('name','csvtext')
            .attr('rows','5')
            .attr('class','input-block-level');
        var f = m.append('div').attr('class','modal-footer');
        f.append('a')
            .attr('data-dismiss','modal')
            .attr('class','btn').text('Close');
        f.append('a')
            .attr('data-dismiss','modal')
            .attr('id','uploadit')
            .attr('class','btn btn-primary').text('Save');
    };
    return my;
};

this.revuploader = function() {
    var my = function(sel) {
        var m = sel.append('div').attr('class','modal hide fade').attr('id','revuploader');
        var h = m.append('div').attr('class','modal-header');
        h.append('h3').text('Upload project revenue data');
        var b = m.append('div').attr('class','modal-body');
        b.append('p').text('Paste your CSV below');
        b.append('textarea')
            .attr('name','csvrevtext')
            .attr('rows','5')
            .attr('class','input-block-level');
        var f = m.append('div').attr('class','modal-footer');
        f.append('a')
            .attr('data-dismiss','modal')
            .attr('class','btn').text('Close');
        f.append('a')
            .attr('data-dismiss','modal')
            .attr('id','revuploadit')
            .attr('class','btn btn-primary').text('Save');
    };
    return my;
};

}).apply(upload);
