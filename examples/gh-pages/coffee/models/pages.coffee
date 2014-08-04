define [
  'cs!app'

  'cs!app/templates/home'
  'cs!app/templates/overview'
  'cs!app/templates/getting-started'
  'cs!app/templates/advanced-techniques'
  'cs!app/templates/examples'

  'cs!app/libs'
  'cs!app/controllers/index'
], (Dox, home, overview, gettingStarted, advancedTechniques, examples) ->
  'use strict'

  # Dynamically generate our sections based on our markdown
  $ = Dox.get 'jQuery'
  _ = Dox.get 'underscore'
  marked = Dox.get 'marked'

  Dox.extend 'Model', 'Pages.Model', {

    parse: (resp) ->
      $template = $('<div/>').append marked resp.markdown
      $template.find(':header[id]').each (i, el) ->
        id = [resp.id]
        id.push el.id if el.id
        el.id = id.join '/'
      resp.template = $template.html()

      sections = _.map $template.find(':header[id]'), (el) ->
        return { id: el.id, name: el.innerText }
      resp.sections = @__factory().get 'Collection', sections
      return resp
  }

  # Create a singleton collection that will store all our available pages
  Dox.extend 'Collection', 'Pages.Collection', {
    model: 'Pages.Model'
  }, singleton: true

  # Hydrate the singleton with our available pages
  Dox.get 'Pages.Collection', [
    {
      id: 'home'
      name: 'Home'
      markdown: home
    }, {
      id: 'overview'
      name: 'Overview'
      markdown: overview
    }, {
      id: 'getting-started'
      name: 'Getting Started'
      markdown: gettingStarted
    }, {
      id: 'advanced-techniques'
      name: 'Advanced Techniques'
      markdown: advancedTechniques
    }#, {
    #   id: 'examples'
    #   name: 'Examples'
    #   markdown: examples
    # }
  ], parse: true
