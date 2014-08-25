define [
  'oraculum'
  'oraculum/views/mixins/templating-interface'
], (Oraculum) ->
  'use strict'

  Oraculum.defineMixin 'MarkdownTemplating.ViewMixin', {

    render: ->
      marked = @__factory().get 'marked'
      highlight = @__factory().get 'highlight'
      template = @mixinOptions.template
      template = template.call this if typeof template is 'function'
      @$el.html marked template
      @$('pre code').each (i, el) ->
        highlight.highlightBlock el
      return this

  }, mixins: [
    'TemplatingInterface.ViewMixin'
  ]
