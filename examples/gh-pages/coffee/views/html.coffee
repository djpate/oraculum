define [
  'cs!app'

  'cs!app/views/mixins/refresh-offsets'

  'oraculum/mixins/disposable'
  'oraculum/views/mixins/auto-render'
  'oraculum/views/mixins/region-attach'
  'oraculum/views/mixins/static-classes'
  'oraculum/views/mixins/html-templating'
  'oraculum/views/mixins/remove-disposed'
], (Dox) ->
  'use strict'

  Dox.extend 'View', 'HTML.View', {

    mixinOptions:
      staticClasses: ['html-view']

  }, mixins: [
    'Disposable.Mixin'
    'RegionAttach.ViewMixin'
    'StaticClasses.ViewMixin'
    'HTMLTemplating.ViewMixin'
    'RefreshOffsets.ViewMixin'
    'RemoveDisposed.ViewMixin'
    'AutoRender.ViewMixin'
  ]
