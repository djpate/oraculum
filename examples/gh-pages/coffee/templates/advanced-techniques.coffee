define [
  'cs!app'
  'cs!app/libs'
  'text!md/advanced-techniques.md'
  'text!md/factory-aop.md'
  'text!md/behavior-interfaces.md'
], (Dox, stub, args...) ->

  return Dox.get('concatTemplate') args...
