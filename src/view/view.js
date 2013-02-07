/*jshint indent:2 */
/*global App:false, Backbone:false, _:false */
/*
 * so far we just have one view, so one file
 */
App.MainView = Backbone.View.extend({
  currenttab: 0,
  membershipmodel: undefined,
  portfoliolistmodel: undefined,
  csvmodel: undefined,
  membershipModelBinder: undefined,
  portfolioListModelBinder: undefined,
  initialize: function () {
    this.membershipModelBinder = new Backbone.ModelBinder();
    this.portfolioListModelBinder = new Backbone.ModelBinder();
    this.membershipmodel = new App.MembershipModel();
    this.portfoliolistmodel = new App.PortfolioListModel();
    this.membershipmodel.bind('change', this.fixup, this);
    this.portfoliolistmodel.bind('change', this.fixup, this);
  },
  render: function () {
    this.csvmodel = new App.CsvModel();
    this.$el.empty();
    App.MainRenderer(this.$el);
    App.PortVizMenu($('#portvizmenu'));
    this.renderviz();
    // make bindings
    var membershipBinding = {};
    _.each(_.keys(this.membershipmodel.toJSON()), function (x) {
        membershipBinding[x] = '#bind_' + x;
      });
    var portfolioListBinding = {};
    _.each(_.keys(this.portfoliolistmodel.toJSON()), function (x) {
        portfolioListBinding[x] = '#bind_' + x;
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
  },
  renderviz: function () {
    App.PortVizViz($('#portvizviz'), this.currenttab, this.membershipmodel, this.portfoliolistmodel);
  },
  events: {
    'click .viztab':       'viztab'
  },
  fixup: function () {
    this.renderviz(); // update membership => render again with the bound data
  },
  viztab: function (x) {
    this.currenttab = x.target.id.substring(1);
    this.renderviz();
  },
  remove: function () {
    this.membershipModelBinder.unbind();
    this.$el.empty();
  }
});


