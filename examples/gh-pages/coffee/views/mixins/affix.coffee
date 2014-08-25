define [
  'oraculum'
  'oraculum/libs'
  'oraculum/mixins/pub-sub'
  'oraculum/mixins/evented'
  'oraculum/mixins/evented-method'
  'bootstrap'
], (Oraculum) ->
  'use strict'

  _ = Oraculum.get 'underscore'

  Oraculum.defineMixin 'Affix.ViewMixin', {

    mixinOptions:
      eventedMethods:
        render: {}
      affix:
        offset: null
        selector: null
        strategy: 'parent'

    mixconfig: ({affix}, options = {}) ->
      {affixOffset, affixSelector, affixPosition, affixStrategy} = options
      affix.offset = affixOffset if affixOffset?
      affix.selector = affixSelector if affixSelector?
      affix.strategy = affixStrategy if affixStrategy?

    mixinitialize: ->
      @on 'render:after', @affix, this
      @on 'addedToParent', @recalculate, this
      @subscribeEvent '!refreshOffsets', @recalculate

    affix: ->
      offset = @_calculateOffset()
      $target = @_getTarget()
      $target.affix {offset}

    recalculate: ->
      $target = @_getTarget()
      return unless affix = $target.data()?['bs.affix']
      offset = @_calculateOffset()
      affix.options =  _.extend {}, affix.options, {offset}
      _.defer => $target.affix 'checkPosition'

    _getTarget: ->
      selector = @mixinOptions.affix.selector
      return if selector then @$ selector else @$el

    _calculateOffset: ->
      strategy = @mixinOptions.affix.strategy
      $target = @_getTarget()[strategy]()
      if offset = $target.offset()
        top = switch strategy
          when 'parent' then offset.top
          when 'prev' then offset.top + $target.outerHeight()
          else 0
      return _.extend {top: 0}, {top}, @mixinOptions.affix.offset

  }, mixins: [
    'PubSub.Mixin'
    'Evented.Mixin'
    'EventedMethod.Mixin'
  ]
