define [
  'cs!app'
  'cs!app/libs'
  'cs!app/application/routes'
  'cs!app/application/layout'
  'oraculum/application/index'
], (Dox) ->
  'use strict'

  Dox.get 'Application',
    layout: 'Dox.Layout'
    routes: Dox.get 'routes'
    pushState: false

  $ = Dox.get 'jQuery'
  $('#github-is-slow').remove()
