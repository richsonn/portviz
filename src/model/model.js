/*global App:false, Backbone:false, portviz:false, ui:false, _:false */
// TODO: namespace this differently.

// project summary
App.ProjectSummaryModel = Backbone.Model.extend({});
App.ProjectSummaries = Backbone.Collection.extend({
    model: App.ProjectSummaryModel
});
App.projSumList = new App.ProjectSummaries();
App.projSumList.reset(portviz.sampledata.proj);

// revenue per project
App.ProjectRevenueModel = Backbone.Model.extend({});
App.ProjectRevenues = Backbone.Collection.extend({
    model: App.ProjectRevenueModel
});
App.projRevList = new App.ProjectRevenues();
App.projRevList.reset(portviz.sampledata.rev);


// revenue target.  maybe doesn't need to be a collection
App.RevenueTargetModel = Backbone.Model.extend({});
App.RevenueTargets = Backbone.Collection.extend({
    model: App.RevenueTargetModel
});
App.revTargetList = new App.RevenueTargets();
App.revTargetList.reset(portviz.sampledata.revtarget);



// budget.  maybe doesn't need to be a collection
App.BudgetModel = Backbone.Model.extend({});
App.Budgets = Backbone.Collection.extend({
    model: App.BudgetModel
});
App.budgetList = new App.Budgets();
App.budgetList.reset(portviz.sampledata.budget);


// costs.  maybe doesn't need to be a collection
App.CostModel = Backbone.Model.extend({});
App.Costs = Backbone.Collection.extend({
    model: App.CostModel
});
App.costList = new App.Costs();
App.costList.reset(portviz.sampledata.costs);


App.CsvModel = Backbone.Model.extend({
    defaults: {
        'csvtext': 'project name, attr name 1, attr name 2\nFoo, val A, val B\nBar, val C, val D',
        'csvrevtext': 'project name, 2012, 2013\nFoo, 100, 200\nBar, 150, 220'
    }
});


/*
 * UI binds to a singleton of this.
 */
App.PortfolioListModel = Backbone.Model.extend({
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
App.MembershipModel = Backbone.Model.extend({
    defaults: function() {
        var port_proj = {};
        _.each(ui.portconf, function(port) {
            var shuffled = _.shuffle(App.projnames());
            var choose = _.random(App.projnames().length);
            var chosen = _.first(shuffled, choose);
            _.each(App.projnames(), function(projname) {
                port_proj[port.id + '_' + projname] = _.contains(chosen, projname);
            });
        });
        return port_proj;
    }
});


// set of all portfolios.  some may be identical,
// so it's an array.
App.portfolios = [];

// to compare portfolios to each other, there's a
// membership vector, i guess.
App.visiblePortfolios = [];

// TODO: per-portfolio, configurable, or datasource.
App.revenueTarget = 50000;
App.budget = 50000;
