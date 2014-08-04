Authoring `Mixin`s
----------------
----------------
A `mixin` is an object that will be extended onto an instance of a `definition`. `Mixin`s don't alter, mutate, or modify underlying prototypes, but instead dynamically enhance the behavior of existing objects in memory. Because of this, all `mixin`s are offered an opportunity to initialize their behavior immediately after they're applied to an instance via the `mixconfig` and `mixinitialize` methods. Creating new mixins is as simple as creating an object, giving it a name, and telling Oraculum that it exists via the `defineMixin` method.

#### Example: Creating a simple mixin
-------------------------------------
```coffeescript
Oraculum.defineMixin 'Quack.Mixin', {

  quack: -> alert 'Quack!'

}
```

This `mixin` can be applied to any available `definition` in Oraculum to provide the `quack()` method when the object is created. I'm unsure why you would need a quack method, but hey, I'm not judging.

<div class="alert alert-warning text-center">
  <h4>Warning!</h4>
  `Mixin`s are applied _after_ an instance is constructed.
  Any members provided by a `mixin` _will not be accessible from the object's constructor._
</div>

The goal of Oraculum is to provide behaviors that solve the majority of common
challenges faced when building a single page application, but there will inevitably be application or domain-specific challenges that are not covered. When you discover these, feel free to author your own custom `mixin`s to solve them. Authoring `mixin`s for Oraculum is easy to do, and when done correctly can often be contributed back to the open source community.

<small class="pull-right">
  `Mixin`s are a feature of FactoryJS. To learn more about FactoryJS, check out [The Lookout Hackers blog](http://hackers.lookout.com/2014/03/factoryjs/)
</small>

<div class="clearfix"></div>

#### Aspect Oriented Programming
--------------------------------

The first thing to know before you start writing your own `mixin`s and `definition`s is how Oraculum approchaes inheritance. JavaScript provides no native inheritance mechanism. Any prior experience you may have with the concept of inheritance in JavaScript is based on iterating over an object and copying members from that object to another. This approach can enable similar behavior to classical inheritance, but lacks many features of classical inheritance, such as referencing parent members, calling super() on a method, interfaces, abstract classes, etc. Again, many libraries, and even CoffeeScript, attempt to emulate these behaviors, but in most cases this approach tends to lead to very tightly coupled behavior with frequent mutation of object prototypes.

Instead of relying on faux classical inheritance for modifying an object's prototype, Oraculum provides two utilities: `makeEventedMethod`, and `makeMiddlewareMethod`. These utilities create a wrapped version of a target function that emit `:before` and `:after` events on a target event emitter.
Oraculum also provides this functionality as a `mixin` via <a href="docs/src/mixins/evented-method.coffee.html" rel="external" target="_blank">EventedMethod.Mixin</a> and <a href="docs/src/mixins/middleware-method.coffee.html" rel="external" target="_blank">MiddlewareMethod.Mixin</a>, which allow methods to be wrapped immediately after an object is constructed.

`makeEventedMethod` and `makeMiddlewareMethod` are how Oraculum provides shallow composition over deep inheritance, and they form the heart of Oraculum's AOP-based logic decoupling.

#### Example: Hooking instance methods
--------------------------------------
```coffeescript
# Create a `definition` that uses <a href="docs/src/mixins/evented-method.coffee.html" rel="external" target="_blank">EventedMethod.Mixin</a>
Oraculum.extend 'View', 'Alert.View', {

  mixinOptions:
    # Configure the <a href="docs/src/mixins/evented-method.coffee.html" rel="external" target="_blank">EventedMethod.Mixin</a> to wrap the render method.
    eventedMethods:
      render: {}

  # Add event listeners to the method's new hooks.
  initialize: ->
    @on 'render:before', -> alert 'Alert.View::render started'
    @on 'render:after', -> alert 'Alert.View::render completed'

}, mixins: [
  'EventedMethod.Mixin'
]

# Create a new instance of our view and invoke render.
view = Oraculum.get 'Alert.View'
view.render()
```

This even works with targeting methods provided by other `mixin`s, provided those `mixin`s are injected before <a href="docs/src/mixins/evented-method.coffee.html" rel="external" target="_blank">EventedMethod.Mixin</a>.

#### Example: Hooking `mixin` methods
-------------------------------------
```coffeescript
Oraculum.defineMixin 'Some.Mixin',

  # Create a new to extend onto an instance.
  someMethod: -> alert 'Some Method'

# Create a `definition` that uses our new `mixin`.
Oraculum.extend 'View', 'Some.View', {

  mixinOptions:
    # Configure the <a href="docs/src/mixins/evented-method.coffee.html" rel="external" target="_blank">EventedMethod.Mixin</a> to wrap our provided method.
    eventedMethods:
      someMethod: {}

  # Add event listeners to the method's new hooks.
  initialize: ->
    @on 'someMethod:before', -> alert 'Some.View::someMethod started'
    @on 'someMethod:after', -> alert 'Some.View::someMethod completed'

}, mixins: [
  'Some.Mixin'
  'EventedMethod.Mixin'
]

# Create a new instance of our view and invoke the method.
view = Oraculum.get 'Some.View'
view.someMethod()
```

And just in case you weren't sold yet, you can even hook methods of other `mixin`s from within a `mixin`.

#### Example: Chaining `mixin` methods
--------------------------------------
```coffeescript
Oraculum.defineMixin 'SomeOther.Mixin', {

  mixinOptions:
    # Configure the <a href="docs/src/mixins/evented-method.coffee.html" rel="external" target="_blank">EventedMethod.Mixin</a> to wrap our provided method.
    eventedMethods:
      someMethod: {}

  # Add event listeners to the method's new hooks.
  mixinitialize: ->
    @on 'someMethod:before', -> alert 'SomeOther.Mixin::someMethod started'
    @on 'someMethod:after', -> alert 'SomeOther.Mixin::someMethod completed'

}, mixins: [
  'Some.Mixin'
  'EventedMethod.Mixin'
]

# Create a `definition` that uses our new `mixin` chain.
Oraculum.extend 'View', 'SomeOther.View', {}, mixins: [
  'SomeOther.Mixin'
]

# Create a new instance of our view and invoke the method.
view = Oraculum.get 'SomeOther.View'
view.someMethod()
```

<div class="alert alert-info text-center">
  <h4>Heads up!</h4>
  The order in which you specify your `mixin`s is important. In the 'Hooking `mixin` methods example we are careful to use `Some.Mixin` _before_ <a href="docs/src/mixins/evented-method.coffee.html" rel="external" target="_blank">EventedMethod.Mixin</a> so that by the time <a href="docs/src/mixins/evented-method.coffee.html" rel="external" target="_blank">EventedMethod.Mixin</a> gets initialized, all of `Some.Mixin`'s methods are available to hook.
</div>
