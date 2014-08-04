<!--
  Definition overrides, when and how to use them
-->

Object-level aspect oriented programming with FactoryJS
-------------------------------------------------------
-------------------------------------------------------

FactoryJS was designed with AOP in mind. It will emit events for various operations, allowing you to hook into those operations and make modifications at runtime. In this section we'll be looking specifically at FactoryJS' `onTag` event hook, which fires once for each tag of a `definition` when an instance of that `definition` is constructed.

<div class="text-center alert alert-info" role="alert">
  <h4>Understanding "tags"</h4>
  FactoryJS tracks the names of `definitions` when they are `define`d `extend`ed. Extending a `View` with the name `Some.View` will result in a `View` and a `Some.View` tag event being emitted by the factory.
</div>

#### Example: Using `onTag` to inject behavior at runtime
---------------------------------------------------------

FactoryJS' `onTag` event gives us access to an instance immediately after it has been fully composed and constructed. This allows us to modify it at runtime trivially with an event callback.

```coffeescript
makeEventedMethod = Oraculum.get 'makeEventedMethod'
Oraculum.onTag 'View', (instance) ->

  # Manually hook the 'render' method of all instances `View`
  makeEventedMethod instance, 'render'

  # Add listeners to our new hooks to track the render time
  instance.on 'render:before', -> console.time "#{instance.__type()}::render"
  instance.on 'render:after', -> console.timeEnd "#{instance.__type()}::render"

```

#### Example: Using `onTag` for loosely coupled aggregator pattern
------------------------------------------------------------------
We can also use this feature to implement complex design patterns without tightly coupling objects together. For example, here's an implementation of aggregator pattern.

```coffeescript
Oraculum.onTag 'SomeAggregator.Collection', (aggregator) ->
  Oraculum.onTag 'Some.Model', (model) ->
    aggregator.add model
```
