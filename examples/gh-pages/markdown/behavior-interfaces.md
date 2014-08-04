Behavior Interfaces
-------------------
-------------------

Some of the challenges you may encounter while developing a complex application can be distilled and abstracted down to a behavior interface whose implementation strategy can vary from project to project, or even within a single application. A good example of this is sorting and paging.

At their core, sorting and paging are both problems that require a state machine and an interface to interact with that state machine. Once you have a well defined interface for interacting with the state machine, the strategy you implement for sorting and paging can be defined by your API or specific needs.

#### Example: Server-side `collection` sorting
----------------------------------------------

Create a mixin that will automatically send the state of the `sortState` `model` to the server whenever a `collection` is `sync`ed.

```coffeescript
Oraculum.defineMixin 'ServerSortByAttributeDirection.CollectionMixin', {

  mixinOptions:
    # Event the `sync` method so we can hook it
    eventedMethods:
      sync: {}

  mixinitialize: ->
    # Hook the `:before` event of `sync()`
    @on 'sync:before', @_addSortParams, this
    @listenTo @sortState, 'change', @fetch

  # Mutate the `sync` call's options by reference, adding the appropriate
  # sort params (attribute, direction).
  _addSortParams: (method, model, options) ->
    attribute = @sortState.get 'attribute'
    direction = @sortState.get 'direction'
    options.data = _.extend { attribute, direction }, options.data

}, mixins: [
  'EventedMethod.Mixin'
  'SortByAttributeDirectionInterface.CollectionMixin'
]
```

<div class="alert alert-info text-center">
  <h4>Check out the dox</h4>
  There are two client-side sorting implementations available in Oraculum. See:
  <br/>
  <a href="docs/src/models/mixins/sort-by-attribute-direction.coffee.html" target="_blank" rel="external">SortByAttributeDirection.CollectionMixin</a>
  <br/>
  <a href="docs/src/models/mixins/sort-by-multi-attribute-direction.coffee.html" target="_blank" rel="external">SortByMultiAttributeDirection.CollectionMixin</a>
</div>

In all of these examples we're relying on the <a href="docs/src/models/mixins/sort-by-attribute-direction-interface.coffee.html" target="_blank" rel="external">SortByAttributeDirectionInterface.CollectionMixin</a> to provide the `sortState` state machine as well as an interface to modify it, allowing us to simply focus on how to handle changes to its state. In the 'Server-side `collection` sorting' example, we hook the `sync` method to modify its `options` argument before listening for changes on the state machine, and invoking `fetch()`. Fetching the `collection` will send the `sortState`'s attribute/direction properties to the server via query strings, and changing the sort state will result in a new `fetch()`.
