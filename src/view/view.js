/*global App:false, Backbone:false, _:false, csvToJson:false */
/*
 * so far we just have one view, so one file
 */
App.MainView = Backbone.View.extend({
    currenttab: 0,
    // TODO: membership vector per portfolio
    membershipmodel: undefined,
    portfoliolistmodel: undefined,
    csvmodel: undefined,
    membershipModelBinder: undefined,
    portfolioListModelBinder: undefined,
    uploadModelBinder: undefined,
    initialize: function() {
        this.membershipModelBinder = new Backbone.ModelBinder();
        this.portfolioListModelBinder = new Backbone.ModelBinder();
        this.uploadModelBinder = new Backbone.ModelBinder();
        this.membershipmodel = new App.MembershipModel();
        this.portfoliolistmodel = new App.PortfolioListModel();
        this.membershipmodel.bind('change', this.fixup, this);
        this.portfoliolistmodel.bind('change', this.fixup, this);
    },
    render: function() {
        this.csvmodel = new App.CsvModel();
        this.$el.empty();
        App.MainRenderer(this.$el);
        App.PortVizMenu($('#portvizmenu'));
        this.renderviz();
        // make bindings
        var membershipBinding = {};
        _.each(_.keys(this.membershipmodel.toJSON()), function(x) {
            membershipBinding[x] = '#bind_' + x;
        });
        var portfolioListBinding = {};
        _.each(_.keys(this.portfoliolistmodel.toJSON()), function(x) {
            portfolioListBinding[x] = '#bind_' + x ;
        });
        this.membershipModelBinder.bind(
            this.membershipmodel,
            this.el,
            membershipBinding
        );
        this.portfolioListModelBinder.bind(
            this.portfoliolistmodel,
            this.el,
            portfolioListBinding);
        this.uploadModelBinder.bind(this.csvmodel, this.$('#uploaders'));
        // turn on the tooltips
        $('[rel=tooltip]').tooltip({html:true});
    },
    renderviz: function() {
        App.PortVizViz($('#portvizviz'), this.currenttab, this.membershipmodel, this.portfoliolistmodel);
    },
    events: {
        'click #uploadit':     'uploadit',
        'click #revuploadit':  'revuploadit',
        'click .viztab':       'viztab'
    },
    fixup: function() {
        //console.log('fixup')
        this.renderviz(); // update membership => render again with the bound data
    },
    viztab: function(x) {
        this.currenttab = x.target.id.substring(1);
        this.renderviz();
    },
    uploadit: function() {
        console.log('raw data: ' + JSON.stringify(this.csvmodel.toJSON()));
        var csvtext = this.csvmodel.get('csvtext');
        // TODO: oops, d3 has a csv parser too, duh.  use that one?
        var jsondata = csvToJson(csvtext);
        console.log('parsed data: ' + JSON.stringify(jsondata));

        App.projSumList.reset(jsondata);
        App.PortVizMenu($('#portvizmenu'));
        App.PortVizViz($('#portvizviz'), this.currenttab, this.membershipmodel, this.portfoliolistmodel);
    },
    revuploadit: function() {
        console.log('raw revenue data: ' + JSON.stringify(this.csvmodel.toJSON()));
        var csvrevtext = this.csvmodel.get('csvrevtext');
        // TODO: oops, d3 has a csv parser too, duh.  use that one?
        var jsondata = csvToJson(csvrevtext);
        console.log('parsed revenue data: ' + JSON.stringify(jsondata));

        App.projRevList.reset(jsondata);
        App.PortVizMenu($('#portvizmenu'));
        App.PortVizViz($('#portvizviz'), this.currenttab, this.membershipmodel, this.portfoliolistmodel);
    },
    remove: function() {
        this.membershipModelBinder.unbind();
        this.uploadModelBinder.unbind();
        this.$el.empty();
    }
});


