define [
  'oraculum'
  'marked'
  'highlight'
  'oraculum/libs'
], (Oraculum, marked, highlight) ->
  'use strict'

  Oraculum.define 'marked', (-> marked), singleton: true
  Oraculum.define 'highlight', (-> highlight), singleton: true

  # Add some custom util functions
  Oraculum.define 'concatTemplate', (-> concatTemplate = (args...) ->
    return args.join '\n\n<div class="clearfix"></div>\n\n\n'
  ), singleton: true
