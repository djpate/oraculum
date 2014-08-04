Oraculum Application
--------------------
--------------------

If you're already familiar with Chaplin, building an application will look familiar to you. Aside from the implementation details in the underlying classes, and the named `definition` resolution, structuring an application in Oraculum almost exactly the same as Chaplin 1.1.x. However, just like in Chaplin, these components are completely optional and aren't required to use Oraculum.

#### Example: Oraculum `Application`
------------------------------------
```coffeescript
# Create a routes function to handle our routing
routes = (match) ->
  # The matching syntax is the same as Chaplin's however, the route spec
  # syntax is different.
  # This is because we can reference objects by name in the factory.
  match '*url', 'Index.Controller#main'

# Remember that route spec we used in our routes file?
# Let's create a controller that matches it.
# @see https://github.com/chaplinjs/chaplin/blob/masterdocs/chaplin.controller.md
Oraculum.extend 'Controller', 'Index.Controller', {

  # Methods of `Controller`s mapped to `Route`s are referred to as `Action`s.
  # This is our 'main' `action`.
  main: ->
    alert 'Main doesn\'t actually do anything!'

}, inheritMixins: true

# Just like in Chaplin, we need a layout.
# A layout is just a view that uses `Layout.ViewMixin`
Oraculum.extend 'View', 'Custom.Layout', {
  # The Layout is essentially the top-level view of your application.
  # Most of the time, your layout is going to be attached to document.body
  el: document.body

  mixinOptions:
    # Layout.Mixin automatically adds RegionPublisher.ViewMixin
    # Allowing us to create new "regions"
    # @see views/mixins/region-publisher
    regions:
      # A common task for a layout is to publish named regions.
      example: '#example'

}, mixins: [
  # @see views/mixins/layout.coffee
  'Layout.ViewMixin'
]

# Finally, we can stitch it all together in our `Application`
# @see application/index.coffee
Oraculum.get 'Application',
  layout: 'Custom.Layout' # The factory will resolve this for you
  routes: routes
```

Defining `Model`s, `Collection`s and `View`s
--------------------------------------------
--------------------------------------------

With our application structure in place, we can start to define our custom components. Let's start with a simple `model`/`collection`. The context is unimportant for now, so we'll call them "Item.Model" and "Item.Collection".

#### Example: Item.Model, Item.Collection
-----------------------------------------
```coffeescript
# Extend the provided `Model`, and name our new `definition` Item.Model
Oraculum.extend 'Model', 'Item.Model', {
  urlRoot: '/api/items' # GET /api/items/:id

}, mixins: [
  'Disposable.Mixin' # Make these instances disposable
  'SyncMachine.ModelMixin' # Make these instances emit sync events
  'XHRDebounce.ModelMixin' # Make these instances debounce requests
]

# Extend the provided `Collection`, and name our new `definition` Item.Collection
Oraculum.extend 'Collection', 'Item.Collection', {
  url: '/api/items' # GET /api/items
  model: 'Item.Model' # Use Item.Model as our default model

}, mixins: [
  'Disposable.CollectionMixin' # Make these instances dispose its models
  'SyncMachine.ModelMixin' # Make these instances emit sync events
  'XHRDebounce.ModelMixin' # Make these instances debounce requests
]
```

Now that we have a custom `model`/`collection`, let's define a view to display their data.

#### Example: Item.View, ItemList.View
--------------------------------------
```coffeescript
# Extend the provided `View`, and name our new `definition` Item.View
Oraculum.extend 'View', 'Item.View', {
  tagName: 'li' # Use <li/> as our tag

  mixinOptions:
    staticClasses: ['item-view'] # Force the css class '.item-view'
    # Bind the `name` attribute of `@model` to this <span/> node.
    # @see views/mixins/dom-property-binding.coffee
    template: '<span data-prop="model" data-prop-attr="name"/>'

}, mixins: [
  'Disposable.Mixin' # Make these instances disposable
  'StaticClasses.ViewMixin' # Make these instances force a css class
  'HTMLTemplating.ViewMixin' # Make these instances render an html template
  'DOMPropertyBinding.ViewMixin' # Make these instances bind data their dom
]

# Extend the provided `View`, and name our new `definition` ItemList.View
Oraculum.extend 'View', 'ItemList.View', {
  tagName: 'ul' # Use <ul/> as our tag

  mixinOptions:
    staticClasses: ['item-list-view'] # Force the css class '.item-list-view'
    # Tell `List.ViewMixin` to use `Item.View` to render models in @collection
    list:
      modelView: 'Item.View'

}, mixins: [
  'Disposable.Mixin' # Make these instances disposable
  'List.ViewMixin' # Make these instances render views for items in @collection
  'RegionAttach.ViewMixin' # Make these instances attach to regions
  'StaticClasses.ViewMixin' # Make these instances force a css class
  'AutoRender.ViewMixin' # Make these instances automatically invoke render()
]
```

<div class="alert alert-success text-center">
  <h4>Best practices</h4>
  Any mixin that automatically performs a behavior or invokes a method should generally come last in the `mixin` stack. A good example is `AutoRender.ViewMixin`, which will cause `:before` and `:after` events on `render` not to fire if it is executed before `EventedMethod.Mixin`.
</div>

Now that we have all of the components we need to actually get our data and render it, let's modify our routes file and `controller` to wire it all together.

#### Example: Adding a new `Route`/`Controller` `Action`
--------------------------------------------------------
```coffeescript
# Modified code from Example: Oraculum Application

routes = (match) ->
  # Add our new '/items' route before our catchall
  match 'items', 'Index.Controller#items'
  match '*url', 'Index.Controller#main'

Oraculum.extend 'Controller', 'Index.Controller', {

  # Create our new 'items' `action`.
  items: ->
    # Get an instance of Item.Collection and export it to the controller so
    # it will get cleaned up/disposed automatically with the controller.
    @collection = @__factory().get 'Item.Collection'
    # Compose an instance of ItemList.View and pass it our collection.
    @reuse 'item-list', 'ItemList.View',
      region: 'example' # Use the 'example' region in our layout.
      collection: @collection
    # Finally, fetch the collection's data.
    @collection.fetch()

}, inheritMixins: true
```
