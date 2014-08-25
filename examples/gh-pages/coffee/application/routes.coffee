define [
  'oraculum'
  'cs!models/pages'
], (Oraculum) ->
  'use strict'

  Oraculum.define 'routes', ->

    # Grab our pages singleton
    pages = @__factory().get 'Pages.Collection'

    return (match) ->
      pages.each (page) ->
        match "#{page.id}(/)(*section)", 'Index.Controller#index',
          params: {page, pages}

      page = pages.first()
      match '*url', 'Index.Controller#index',
        params: {page, pages}
