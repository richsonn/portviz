/*jshint indent:2 */
/*global Backbone:false, portviz: false, _:false */
portviz.view = {};
(function () {
  /*
   * so far we just have one view, so one file
   */
  this.MainView = Backbone.View.extend({
    currenttab: 0,
    portconf: undefined,
    membershipmodel: undefined,
    membershipModelBinder: undefined,
    portfoliolistmodel: undefined,
    portfolioListModelBinder: undefined,
    initialize: function () {

      // TODO: pull this out
      this.portconf = portviz.client.pharma.portconf;

      this.membershipModelBinder = new Backbone.ModelBinder();
      this.membershipmodel = portviz.client.pharma.membershipmodel();
      this.membershipmodel.bind('change', this.fixup, this);

      this.portfolioListModelBinder = new Backbone.ModelBinder();
      this.portfoliolistmodel = portviz.client.pharma.portfoliolistmodel();
      this.portfoliolistmodel.bind('change', this.fixup, this);
    },
    render: function () {
      this.$el.empty();
      portviz.ui.MainRenderer(this.$el);
      portviz.ui.PortVizMenu($('#portvizmenu'));
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
      portviz.ui.PortVizViz($('#portvizviz'), this.currenttab, this.membershipmodel, this.portconf, this.portfoliolistmodel);
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


}).apply(portviz.view);
