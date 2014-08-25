define [
  'oraculum'
  'cs!libs'
  'text!md/examples.md'
  'text!md/lookout-app-intel-console.md'
], (Oraculum, stub, args...) ->

  return Oraculum.get('concatTemplate') args...
