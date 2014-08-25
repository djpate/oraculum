define [
  'oraculum'
  'oraculum/libs'
  'oraculum/application/controller'

  'cs!models/pages'
  'cs!views/html'
  'cs!views/navbar'
  'cs!views/sidebar'
], (Oraculum) ->
  'use strict'

  _ = Oraculum.get 'underscore'

  Oraculum.extend 'Controller', 'Index.Controller', {

    index: ({page, pages, section}) ->
      pages.invoke 'unset', 'active'
      page.set 'active', true
      @reuse 'navbar', 'Navbar.View',
        region: 'navbar'
        collection: pages
      @reuse 'sidebar', 'Sidebar.View',
        region: 'sidebar'
        collection: page.get 'sections'
        scrollspy: target: '#sidebar'
      @reuse 'info', 'HTML.View',
        region: 'info'
        template: page.get 'template'
      return unless section
      selector = "[id='#{page.id}/#{section}']"
      _.defer => @publishEvent '!scrollTo', selector, 500

  }, inheritMixins: true
