Dependencies
------------
------------

<div class="text-center alert alert-info" role="alert">
  <h4>Heads up!</h4>
  To make Oraculum available in other environments, we plan to convert it to [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) and provide a [UMD](https://github.com/umdjs/umd) build.
  <br/>
  <br/>
  <a href="https://github.com/lookout/oraculum/issues?milestone=1&state=open" class="btn btn-primary">
    We would love your help!
  </a>
</div>

Oraculum is a library built on Backbone and FactoryJS. To get an Oraculum application off the ground we first need load these libraries and their dependencies. Feel free to use the AMD library of your choice, but the following examples will assume you're using RequireJS. For the sake of brevity, these examples will also assume your project root is '.' and you're using bower for dependency management.

#### Sample bower.json
----------------------
```json
{
  "name": "my_awesome_app",
  "version": "0.0.0",
  "description": "This app is so awesome it will blow your mind",
  "dependencies": {
    "oraculum": "latest"
  }
}
```

Oraculum's only dependency is on FactoryJS. Feel free to take a peek at [Oraculum's bower.json](https://github.com/lookout/oraculum/blob/master/bower.json).

Now that we have all of our dependencies, we need to tell our module loader how to find them.

#### Sample RequireJS Configuration
-----------------------------------
```coffeescript
require.config({
  basePath: 'js/'
  paths:
    Factory: 'bower_components/factoryjs/dist/Factory'
    BackboneFactory: 'bower_components/factoryjs/dist/BackboneFactory'
    underscore: 'bower_components/underscore/underscore'
    backbone: 'bower_components/backbone/backbone'
    jquery: 'bower_components/jquery/dist/jquery'
  shim:
    jquery: exports: 'jQuery'
    underscore: exports: 'underscore'
    backbone:
      deps: ['jquery', 'underscore']
      exports: 'Backbone'
  packages: [{
    name: 'oraculum'
    location: 'bower_components/oraculum/dist'
  }, {
    name: 'MyApp'
    location: 'app'
  }]
})
```
