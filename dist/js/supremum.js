/*global Backbone:false, portviz:false */
// default money formatter
portviz.fmt = portviz.money.fmt();

portviz.AppRouter = Backbone.Router.extend({
      routes: {
                "@url": "def"
                    },
                        def: function() {
                              }
});

portviz.main = new portviz.view.MainView({
      el: $('body')
});
portviz.main.render();

// do this at the end
$(function(){
      portviz.app = new portviz.AppRouter();
          Backbone.history.start();
});
