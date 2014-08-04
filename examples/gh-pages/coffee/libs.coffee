define [
  'cs!app'
  'marked'
  'highlight'
  'oraculum/libs'
], (Dox, marked, highlight) ->
  'use strict'

  Dox.define 'marked', (-> marked), singleton: true
  Dox.define 'highlight', (-> highlight), singleton: true

  # Add some custom util functions
  Dox.define 'concatTemplate', (-> concatTemplate = (args...) ->
    return args.join '\n\n<div class="clearfix"></div>\n\n\n'
  ), singleton: true
