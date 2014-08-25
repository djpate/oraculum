define [
  'oraculum'
  'oraculum/mixins/disposable'
  'oraculum/views/mixins/auto-render'
  'oraculum/views/mixins/region-attach'
  'oraculum/views/mixins/static-classes'
  'oraculum/views/mixins/html-templating'
  'oraculum/views/mixins/remove-disposed'

  'cs!views/mixins/refresh-offsets'
], (Oraculum) ->
  'use strict'

  Oraculum.extend 'View', 'HTML.View', {

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
