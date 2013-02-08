/*jshint indent:2 */
/*global App:false, Backbone:false, portviz: false, ui: false, _:false */
/*
 * so far we just have one view, so one file
 */
App.MainView = Backbone.View.extend({
  currenttab: 0,
  membershipmodel: undefined,
  membershipModelBinder: undefined,
  portfoliolistmodel: undefined,
  portfolioListModelBinder: undefined,
  initialize: function () {
    this.membershipModelBinder = new Backbone.ModelBinder();
    var defaultMemberships = function () {
      var port_proj = {};
      // TODO: client-specific
      var pn = portviz.client.pharma.projnames();
      _.each(ui.portconf, function (port) {
        var shuffled = _.shuffle(pn);
        var choose = _.random(shuffled.length);
        var chosen = _.first(shuffled, choose);
        _.each(pn, function (p) {
          port_proj[port.id + '_' + p] = _.contains(chosen, p);
        });
      });
      return port_proj;
    };
    this.membershipmodel = new portviz.model.MembershipModel(defaultMemberships());
    this.membershipmodel.bind('change', this.fixup, this);

    this.portfolioListModelBinder = new Backbone.ModelBinder();
    var defaultPorts = function () {
      var byport = {};
      _.each(ui.portconf, function (port) { byport[port.id] = true; });
      return byport;
    };
    this.portfoliolistmodel = new portviz.model.PortfolioListModel(defaultPorts());
    this.portfoliolistmodel.bind('change', this.fixup, this);
  },
  render: function () {
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


