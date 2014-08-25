define [
  'oraculum'
  'cs!libs'
  'text!../../../../README.md'
  'text!md/how-to-get-it.md'
], (Oraculum, stub, args...) ->

  return Oraculum.get('concatTemplate') args...
