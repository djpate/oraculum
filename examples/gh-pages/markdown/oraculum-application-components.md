Oraculum Application Components
-------------------------------
-------------------------------

<a href="examples/gh-pages/images/Oraculum%20Application%20Components.jpg" class="thumbnail pull-right col-sm-4 col-md-3 text-center" target="_blank">
  <img src="examples/gh-pages/images/Oraculum%20Application%20Components.jpg" alt="Oraculum Application Components"/>
  <small>Oraculum Application Components</small>
</a>

Oraculum's core application `definition`s and `mixin`s are ported from concepts in Chaplin. Like Chaplin, Oraculum provides the following classes:

  * Application
  * Controller
  * Dispatcher
  * Composer
    * Composition
  * Router (improved)
    * Route
  * History (improved)

The application lifecycle is the same between Chaplin and Oraculum. The only significant difference is Oraculum's use of FactoryJS to resolve classes and inject behaviors. Because of this, the `mixin`s used in Oraculum's core application components are available to any `definition` that wants to use them. This includes `mixin`s for publishing/subscribing to a global event bus, making objects disposable in a memory-safe way, freezing objects after construction, and several others.

<small class="pull-right">
  To learn more about Chaplin, check out [ChaplinJS.org](http://chaplinjs.org/)
</small>

<div class="clearfix"></div>
