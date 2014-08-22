requirejs.config({
  baseUrl: 'coffee/',

  paths: {
    // RequireJS plugins
    'cs': '../vendor/require-cs-0.4.4',
    'text': '../vendor/require-text-2.0.12',
    'coffee-script': '../vendor/coffee-script-1.7.1.min',

    // FactoryJS
    'Factory': '../vendor/Factory-1.0.0.min',
    'BackboneFactory': '../vendor/BackboneFactory-1.0.0.min',

    // Util libs
    'jquery': '../vendor/jquery-2.1.1.min',
    'backbone': '../vendor/backbone-1.1.2.min',
    'underscore': '../vendor/underscore-1.6.0.min',

    // Bootstrap stuff
    'bootstrap': '../vendor/bootstrap/js/bootstrap',
  },

  shim: {
    bootstrap: {deps: ['jquery']},
    jquery: { exports: 'jQuery' },
    underscore: { exports: '_' },
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    }
  },

  packages: [{
    name: 'oraculum',
    location: '../vendor/oraculum'
  }]

});
