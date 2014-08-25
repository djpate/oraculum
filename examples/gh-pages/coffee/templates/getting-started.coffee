define [
  'oraculum'
  'cs!libs'
  'text!md/getting-started.md'
  'text!md/dependencies.md'
  'text!md/oraculum-application.md'
  'text!md/authoring-mixins.md'
], (Oraculum, stub, args...) ->

  return Oraculum.get('concatTemplate') args...
