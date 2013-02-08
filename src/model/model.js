/*global Backbone:false, portviz:false */

// non-client-specific models

portviz.model = {};
(function() {
  
/*
 * UI binds to a singleton of this.
 * {port_id: boolean, ...}
 */
this.PortfolioListModel = Backbone.Model.extend({ });

/*
 * UI binds to a singleton of this.
 * {portname_projname: boolean, ...}.
 */
this.MembershipModel = Backbone.Model.extend({ });

}).apply(portviz.model);

