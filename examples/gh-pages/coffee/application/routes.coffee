define [
  'cs!app'
  'cs!app/models/pages'
], (Dox) ->
  'use strict'

  Dox.define 'routes', ->

    # Grab our pages singleton
    pages = @__factory().get 'Pages.Collection'

    return (match) ->
      pages.each (page) ->
        match "#{page.id}(/)(*section)", 'Index.Controller#index',
          params: {page, pages}

      page = pages.first()
      match '*url', 'Index.Controller#index',
        params: {page, pages}
