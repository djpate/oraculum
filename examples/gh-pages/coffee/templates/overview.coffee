define [
  'cs!app'
  'cs!app/libs'
  'text!md/overview.md'
  'text!md/architecture.md'
  'text!md/factoryjs-composition.md'
  'text!md/oraculum-application-components.md'
  'text!md/oraculum-behaviors.md'
], (Dox, stub, args...) ->

  return Dox.get('concatTemplate') args...
