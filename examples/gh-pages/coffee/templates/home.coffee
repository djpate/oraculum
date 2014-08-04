define [
  'cs!app'
  'cs!app/libs'
  'text!README.md'
  'text!md/how-to-get-it.md'
], (Dox, stub, args...) ->

  return Dox.get('concatTemplate') args...
