define [
  'cs!app'
  'cs!app/libs'

  'oraculum/mixins/pub-sub'
  'oraculum/mixins/listener'
  'oraculum/mixins/disposable'

  'oraculum/views/mixins/list'
  'oraculum/views/mixins/auto-render'
  'oraculum/views/mixins/region-attach'
  'oraculum/views/mixins/static-classes'
  'oraculum/views/mixins/html-templating'
  'oraculum/views/mixins/remove-disposed'

  'cs!app/views/mixins/affix'
  'cs!app/views/mixins/scroll-spy'
], (Dox) ->
  'use strict'

  $ = Dox.get 'jQuery'
  marked = Dox.get 'marked'

  Dox.extend 'View', 'SidebarItem.View', {
    tagName: 'li'

    mixinOptions:
      staticClasses: ['sidebar-item-view']
      template: -> """
        <a href="##{@model.id}">
          #{@model.get 'name'}
        </a>
      """

  }, mixins: [
    'Disposable.Mixin'
    'HTMLTemplating.ViewMixin'
  ]

  Dox.extend 'View', 'Sidebar.View', {

    events:
      'click [href="#top"]': '_scrollTop'

    mixinOptions:
      staticClasses: ['sidebar-view']
      scrollspy:
        target: '.sidebar-view'
      list:
        modelView: 'SidebarItem.View'
        listSelector: 'ul.nav'
      template: '''
        <ul class="nav"/>
        <a href="#top" class="btn btn-default btn-sm" rel="external">
          ^ Top
        </a>
      '''

    _scrollTop: (e) ->
      e.preventDefault()
      e.stopPropagation()
      @publishEvent '!scrollTo', '#top', 500
      return false

  }, mixins: [
    'PubSub.Mixin'
    'Disposable.Mixin'
    'EventedMethod.Mixin'
    'List.ViewMixin'
    'Affix.ViewMixin'
    'RegionAttach.ViewMixin'
    'StaticClasses.ViewMixin'
    'RemoveDisposed.ViewMixin'
    'HTMLTemplating.ViewMixin'
    'ScrollspyTarget.ViewMixin'
    'AutoRender.ViewMixin'
  ]
