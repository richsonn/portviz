/*global portviz:false, _:false */
/*
 * cases: describes particular analysis cases,
 * e.g. portfolios to look at.
 */
(function() {

var self = this;

// TODO: make this a backbone-bound collection
// TODO: use the name here, and make the type name a subhead or something
// index is used for color. TODO: something smarter.
this.portconf = [
    {index: 0, id: 'p1', type: 'portvizmanual', name: 'Option One'},
    {index: 1, id: 'p2', type: 'portvizmanual', name: 'Option Two'},
    {index: 2, id: 'p3', type: 'portvizmanual', name: 'Option Three'},
    {index: 3, id: 'p4', type: 'portvizmanual', name: 'Option Four'},
    {index: 4, id: 'p5', type: 'portvizmanual', name: 'Option Five'},
    {index: 5, id: 'p6', type: 'portvizmanual', name: 'Option Six'}
];

var defaultMemberships = function () {
  var port_proj = {};
  var pn = _.map(
    portviz.client.pharma.projnames(),
    function (p) {return p.replace(/[^A-Za-z0-9]/g,'_');}
  );
  _.each(self.portconf, function (port) {
    var shuffled = _.shuffle(pn);
    var choose = _.random(shuffled.length);
    var chosen = _.first(shuffled, choose);
    _.each(pn, function (p) {
      port_proj[port.id + '_' + p] = _.contains(chosen, p);
    });
  });
  return port_proj;
};

// {portid_projid:bool}
this.membershipmodel = function () {
  return new portviz.model.MembershipModel(defaultMemberships());
};

var defaultPorts = function () {
  var byport = {};
  _.each(self.portconf, function (port) { byport[port.id] = true; });
  return byport;
};

// {portid:bool}
this.portfoliolistmodel = function () {
  return new portviz.model.PortfolioListModel(defaultPorts());
};

}).apply(portviz.client.pharma);
