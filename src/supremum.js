/*global App:false, Backbone:false, money:false */
// default money formatter
var fmt = money.fmt();

// TODO: make the margins somehow aware of large-label issues
App.margins = {top: 40, right: 40, bottom: 60, left: 150};

App.AppRouter = Backbone.Router.extend({
      routes: {
                "@url": "def"
                    },
                        def: function(url) {
                              }
});

App.main = new App.MainView({
      el: $('body')
});
App.main.render();

// do this at the end
$(function(){
      App.app = new App.AppRouter();
          Backbone.history.start();
});
