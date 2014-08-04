define [
  'cs!app'
  'cs!app/libs'

  'cs!app/models/pages'
  'cs!app/views/html'
  'cs!app/views/navbar'
  'cs!app/views/sidebar'

  'oraculum/application/controller'
], (Dox) ->
  'use strict'

  _ = Dox.get 'underscore'

  Dox.extend 'Controller', 'Index.Controller', {

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
      selector = "[id=\"#{page.id}/#{section}\"]"
      _.defer => @publishEvent '!scrollTo', selector, 500

  }, inheritMixins: true
