define [
  'oraculum'
  'oraculum/libs'
  'oraculum/application/index'

  'cs!application/routes'
  'cs!application/layout'
], (Oraculum) ->
  'use strict'

  Oraculum.get 'Application',
    layout: 'Oraculum.Layout'
    routes: Oraculum.get 'routes'
    pushState: false

  $ = Oraculum.get 'jQuery'
  $('#github-is-slow').remove()
