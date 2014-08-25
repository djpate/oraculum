define [
  'oraculum'
  'oraculum/libs'
  'oraculum/mixins/pub-sub'
  'oraculum/mixins/evented'
  'oraculum/mixins/evented-method'
], (Oraculum) ->
  'use strict'

  _ = Oraculum.get 'underscore'

  # This mixin should be mixed into any view whose representation in the DOM
  # can affect the calculated offsets of any other node in the DOM.
  # Its single function is to listen for events that could denote an offset
  # change and invoke a globally debounced method to notify any listener whose
  # implementation relies on DOM sizing calculations that it should
  # recalculate.

  Oraculum.defineMixin 'RefreshOffsets.ViewMixin', {
    mixinOptions:
      eventedMethods:
        render: {}
        remove: {}

    mixinitialize: ->
      # Listen for the render event to complete
      @on 'render:after', @refreshOffsets, this
      @on 'remove:after', @refreshOffsets, this

      # Listen on `addedToParent` in case the view uses `Attach.ViewMixin`
      @on 'addedToParent', @refreshOffsets, this

      # Listen on `visibilityChange` in case the view uses `List.ViewMixin`
      @on 'visibilityChange', @refreshOffsets, this

    # Debouncing the function before assigning it to the mixin allows the same
    # debounced method to be extended onto anything it's mixed into.
    # This limits the implementation's invocation across all mixed instances.
    refreshOffsets: _.debounce (->
      @publishEvent '!refreshOffsets'
    ), 100

  }, mixins: [
    'PubSub.Mixin'
    'Evented.Mixin'
    'EventedMethod.Mixin'
  ]
