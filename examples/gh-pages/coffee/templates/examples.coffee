define [
  'cs!app'
  'cs!app/libs'
  'text!md/examples.md'
  'text!md/lookout-app-intel-console.md'
], (Dox, stub, args...) ->

  return Dox.get('concatTemplate') args...
