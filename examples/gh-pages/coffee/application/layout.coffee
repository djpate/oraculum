define [
  'oraculum'
  'oraculum/libs'
  'oraculum/mixins/pub-sub'
  'oraculum/mixins/listener'
  'oraculum/views/mixins/layout'

  'cs!views/mixins/scroll-spy'

  'bootstrap'
], (Oraculum) ->
  'use strict'

  $ = Oraculum.get 'jQuery'

  Oraculum.extend 'View', 'Oraculum.Layout', {
    el: document.body

    events:
      'click [data-collapse-target]': '_collapse'

    mixinOptions:
      layout:
        scrollTo: false
      regions:
        info: '#info'
        navbar: '#navbar'
        sidebar: '#sidebar'
      listen:
        '!refreshOffsets mediator': '_refreshPlugins'

    initialize: ->
      @addWindowEvents()

    addWindowEvents: ->
      $(window, document).on 'resize', _.debounce (=>
        @publishEvent '!refreshOffsets'
      ), 100

    _refreshPlugins: ->
      highlight = @__factory().get 'highlight'
      @$('pre code').each (i, el) -> highlight.highlightBlock el

    _collapse: (e) ->
      $clickTarget = @$ e.target
      $collapseTarget = @$ $clickTarget.attr 'data-collapse-target'
      $collapseTarget.collapse 'toggle'

  }, mixins: [
    'PubSub.Mixin'
    'Listener.Mixin'
    'Layout.ViewMixin'
    'ScrollspyViewport.ViewMixin'
  ]
