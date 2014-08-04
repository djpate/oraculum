requirejs.config({
  baseUrl: './',

  paths: {
    // RequireJS plugins
    'cs': 'examples/gh-pages/vendor/require-cs-0.4.4',
    'text': 'examples/gh-pages/vendor/require-text-2.0.12',
    'coffee-script': 'examples/gh-pages/vendor/coffee-script-1.7.1.min',

    // FactoryJS
    'Factory': 'examples/gh-pages/vendor/Factory-1.0.0.min',
    'BackboneFactory': 'examples/gh-pages/vendor/BackboneFactory-1.0.0.min',

    // Util libs
    'jquery': 'examples/gh-pages/vendor/jquery-2.1.1.min',
    'backbone': 'examples/gh-pages/vendor/backbone-1.1.2.min',
    'underscore': 'examples/gh-pages/vendor/underscore-1.6.0.min',

    // Bootstrap stuff
    'bootstrap': 'examples/gh-pages/vendor/bootstrap/js/bootstrap',

    // Markdown
    'marked': 'examples/gh-pages/vendor/marked-0.3.2.min',
    'highlight': 'examples/gh-pages/vendor/highlight/highlight.pack'
  },

  shim: {
    bootstrap: {deps: ['jquery']},

    marked: { exports: 'marked' },
    highlight: { exports: 'hljs' },

    jquery: { exports: 'jQuery' },
    underscore: { exports: '_' },
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    }
  },

  packages: [{
    name: 'oraculum',
    location: 'dist'
  }, {
    name: 'app',
    location: 'examples/gh-pages/coffee'
  }, {
    name: 'md',
    location: 'examples/gh-pages/markdown'
  }],

  callback: function () {
    require(['jquery'], function($) {
      $(function() {
        require(['cs!app/index'])
      });
    });
  }
});
