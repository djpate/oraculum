define [
  'cs!app'
  'cs!app/libs'
  'text!md/getting-started.md'
  'text!md/dependencies.md'
  'text!md/oraculum-application.md'
  'text!md/authoring-mixins.md'
], (Dox, stub, args...) ->

  return Dox.get('concatTemplate') args...
