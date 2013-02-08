/*global App:false, Backbone:false, portviz:false */
// default money formatter
portviz.fmt = portviz.money.fmt();

App.AppRouter = Backbone.Router.extend({
      routes: {
                "@url": "def"
                    },
                        def: function() {
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
