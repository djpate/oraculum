define [
  'oraculum'
  'cs!libs'
  'text!md/overview.md'
  'text!md/architecture.md'
  'text!md/factoryjs-composition.md'
  'text!md/oraculum-application-components.md'
  'text!md/oraculum-behaviors.md'
], (Oraculum, stub, args...) ->

  return Oraculum.get('concatTemplate') args...
