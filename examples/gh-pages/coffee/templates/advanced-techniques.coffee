define [
  'oraculum'
  'cs!libs'
  'text!md/advanced-techniques.md'
  'text!md/factory-aop.md'
  'text!md/behavior-interfaces.md'
], (Oraculum, stub, args...) ->

  return Oraculum.get('concatTemplate') args...
