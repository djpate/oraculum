define [
  'cs!app'
  'cs!app/libs'
  'oraculum/mixins/pub-sub'
  'oraculum/mixins/evented'
  'oraculum/mixins/evented-method'
  'bootstrap'
], (Dox) ->
  'use strict'

  _ = Dox.get 'underscore'

  # This mixin should be mixed into the view that represents the element of the
  # scrolling viewport that contains the content with the relevant IDs
  # In most cases, this will be a Layout.
  Dox.defineMixin 'ScrollspyViewport.ViewMixin', {
    mixinOptions:
      scrollspy:
        selector: null

    mixinitialize: ->
      @subscribeEvent '!scrollspy', @scrollspy
      @subscribeEvent '!refreshOffsets', @recalculate

    scrollspy: ->
      selector = @mixinOptions.scrollspy.selector
      $target = if selector? then @$ selector else @$el
      $target.scrollspy arguments...

    recalculate: ->
      selector = @mixinOptions.scrollspy.selector
      $target = if selector? then @$ selector else @$el
      return unless $target.data().scrollspy
      _.defer -> $target.scrollspy 'refresh'

  }, mixins: [
    'PubSub.Mixin'
  ]

  # This mixin should be mixed into the view that will contain the
  # `.nav > li > a` elements that the scrollspy plugin will manipulate.
  Dox.defineMixin 'ScrollspyTarget.ViewMixin', {
    mixinOptions:
      eventedMethods:
        render: {}
      # The current implementation of bootstrap.scrollspy requires that the
      # elements to be marked as ".active" match `.nav > li > a`. However,
      # we can control the parent scope of where the plugin looks for matching
      # elements by specifying the `target` option.
      scrollspy:
        target: ''

    mixconfig: (mixinOptions, {scrollspy} = {}) ->
      mixinOptions.scrollspy = _.extend mixinOptions.scrollspy, scrollspy

    mixinitialize: ->
      @on 'render:after', => @scrollspyTarget()

    scrollspyTarget: (options) ->
      @publishEvent '!scrollspy', _.extend {}, @mixinOptions.scrollspy, options

  }, mixins: [
    'PubSub.Mixin'
    'Evented.Mixin'
    'EventedMethod.Mixin'
  ]
