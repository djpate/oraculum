requirejs.config({
  baseUrl: 'examples/gh-pages/coffee',

  paths: {

    // RequireJS plugins
    'cs': '../../../bower_components/require-cs/cs',
    'text': '../../../bower_components/requirejs-text/text',
    'coffee-script': '../../../bower_components/coffee-script/extras/coffee-script',

    // FactoryJS
    'Factory': '../../../bower_components/factoryjs/dist/Factory.min',
    'BackboneFactory': '../../../bower_components/factoryjs/dist/BackboneFactory.min',

    // Util libs
    'jquery': '../../../bower_components/jquery/dist/jquery.min',
    'backbone': '../../../bower_components/backbone/backbone',
    'underscore': '../../../bower_components/underscore/underscore',

    // Directories
    'md': '../markdown',
    'bootstrap': '../../../bower_components/bootstrap-css/js/bootstrap',

    // Markdown
    'marked': '../../../bower_components/marked/lib/marked',
    'highlight': '../../../bower_components/highlightjs/highlight.pack'
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
    location: '../../../dist'
  }],

  callback: function () {
    require(['jquery'], function($) {
      $(function() {
        require(['cs!index']);
      });
    });
  }
});
