define [
  'oraculum'
  'oraculum/views/mixins/list'
  'oraculum/views/mixins/auto-render'
  'oraculum/views/mixins/region-attach'
  'oraculum/views/mixins/static-classes'
  'oraculum/views/mixins/html-templating'
], (Oraculum) ->
  'use strict'

  Oraculum.extend 'View', 'NavItem.View', {
    tagName: 'li'

    initialize: ->
      @_updateActive()

    mixinOptions:
      staticClasses: ['nav-item-view']
      listen:
        'change:active model': '_updateActive'
      template: -> """
        <a href="##{@model.id}">
          #{@model.get 'name'}
        </a>
      """

    _updateActive: ->
      @$el.toggleClass 'active', Boolean @model.get 'active'

  }, mixins: [
    'Listener.Mixin'
    'StaticClasses.ViewMixin'
    'HTMLTemplating.ViewMixin'
  ]

  Oraculum.extend 'View', 'Navbar.View', {
    tagName: 'ul'
    className: 'nav nav-tabs'

    mixinOptions:
      staticClasses: ['navbar-view']
      list:
        modelView: 'NavItem.View'

  }, {
    singleton: true
    mixins: [
      'List.ViewMixin'
      'RegionAttach.ViewMixin'
      'StaticClasses.ViewMixin'
      'AutoRender.ViewMixin'
    ]
  }
