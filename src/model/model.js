/*global Backbone:false, portviz:false, ui:false, _:false */
// TODO: namespace this differently.

portviz.client = {};
portviz.client.pharma = {};
(function() {

// has instance dimensions
var ProjectSummaryModel = Backbone.Model.extend({
    phase: function() { return this.get('Stage'); },
    therapeuticArea: function() { return this.get('TA'); },
    projectName: function() { return this.get('Project'); }
});

// has aggregate dimensions
var ProjectSummaries = Backbone.Collection.extend({
    model: ProjectSummaryModel,
    // hardcoded for ordering
    phases: function() { return [ 'Preclinical', 'Phase 1', 'Phase 2', 'Phase 3', 'NDA', 'Market' ]; },
    therapeuticAreas: function() { return _.uniq(this.pluck('TA')).sort(); }
});

this.projSumList = new ProjectSummaries();
this.projSumList.reset(portviz.sampledata.proj);

this.projnames = function() { return this.projSumList.pluck('Project'); };

// wrap a single model instance, for instance property access
var bingoInstanceWrapper = function(m) {
  var my = {
    x: function() { return m.phase(); },
    y: function() { return m.therapeuticArea(); },
    label: function() { return m.projectName(); },
    key: function() { return m.projectName().replace(/[^A-Za-z0-9]/g,'_'); }
  };
  return my;
};

// wrap a single collection instance, for collection property access
this.bingoWrapper = function(c) {
  var my = {
    filter: function(f) {
      return _.filter(c.map(function(m) { return bingoInstanceWrapper(m);}), f);
    },
    x: function() { return c.phases(); },
    y: function() { return c.therapeuticAreas(); }
  };
  return my;
};

// revenue per project
var ProjectRevenueModel = Backbone.Model.extend({});
var ProjectRevenues = Backbone.Collection.extend({
    model: ProjectRevenueModel
});
this.projRevList = new ProjectRevenues();
this.projRevList.reset(portviz.sampledata.rev);

// revenue target.
var RevenueTargetModel = Backbone.Model.extend({});
var RevenueTargets = Backbone.Collection.extend({
    model: RevenueTargetModel
});
this.revTargetList = new RevenueTargets();
this.revTargetList.reset(portviz.sampledata.revtarget);

// budget.
var BudgetModel = Backbone.Model.extend({});
var Budgets = Backbone.Collection.extend({
    model: BudgetModel
});
this.budgetList = new Budgets();
this.budgetList.reset(portviz.sampledata.budget);

// costs.
var CostModel = Backbone.Model.extend({});
var Costs = Backbone.Collection.extend({
    model: CostModel
});
this.costList = new Costs();
this.costList.reset(portviz.sampledata.costs);





}).apply(portviz.client.pharma);






// non-client-specific models

portviz.model = {};
(function() {
  
/*
 * UI binds to a singleton of this.
 */
this.PortfolioListModel = Backbone.Model.extend({
    defaults: function() {
        var byport = {};
        _.each(ui.portconf, function(port) { byport[port.id] = true; });
        return byport;
    }
});



// a flat model is easier to bind.
// a hierarchical model is easier to mutate (add a port), more OO-ish
// what to do?
// for now, flat: {portname_projname: boolean, ...}.
this.MembershipModel = Backbone.Model.extend({ });



}).apply(portviz.model);






