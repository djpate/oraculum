define [
  'oraculum'
  'oraculum/libs'

  'oraculum/views/mixins/attach'
  'oraculum/views/mixins/auto-render'
  'oraculum/views/mixins/html-templating'

  'oraculum/plugins/tabular/views/cells/text'
  'oraculum/plugins/tabular/views/mixins/row'
  'oraculum/plugins/tabular/views/mixins/table'

  'oraculum/models/mixins/auto-fetch'
], (Oraculum) ->
  'use strict'

  _ = Oraculum.get 'underscore'
  Backbone = Oraculum.get 'Backbone'

  columns = Oraculum.get 'Collection', [{
    label: 'Unique Identifier'
    attribute: 'id'
  }, {
    label: 'Actor'
    attribute: 'actor.login'
  }, {
    label: 'Event Type'
    attribute: 'type'
  }, {
    label: 'Repo Name'
    attribute: 'repo.name'
  }]

  Oraculum.extend 'Collection', 'GithubEvent.Collection', {
    url: 'https://api.github.com/users/lookout/events'

    sync: (method, model, options) ->
      Backbone.sync method, model, _.extend {
        dataType: 'jsonp'
      }, options

    parse: (response) ->
      return response.data

  }, {
    singleton: true
    mixins: ['AutoFetch.ModelMixin']
  }

  Oraculum.extend 'Text.Cell', 'GithubEvent.Cell', {
    tagName: 'td'
  }, {
    inheritMixins: true
    mixins: ['VariableWidth.CellMixin']
  }

  # A "row" is our X axis. It is an array of `column`s
  Oraculum.extend 'View', 'GithubEvent.Row', {
    tagName: 'tr'

    mixinOptions:
      list: modelView: 'GithubEvent.Cell'

  }, mixins: ['Row.ViewMixin']

  # A "table" is essentially our Y axis
  Oraculum.extend 'View', 'GithubEvents.Table', {
    tagName: 'table'
    className: 'table table-striped table-hover'

    mixinOptions:
      list:
        modelView: 'GithubEvent.Row'
        listSelector: 'tbody'
      template: '<tbody/>'

  }, mixins: [
    'Table.ViewMixin'
    'Attach.ViewMixin'
    'HTMLTemplating.ViewMixin'
    'AutoRender.ViewMixin'
  ]

  # Kick it off
  Oraculum.get 'GithubEvents.Table',
    columns: columns
    container: '#simple-table'
    collection: 'GithubEvent.Collection'
    # collection: Oraculum.get 'GithubEvent.Collection', JSON.parse data
