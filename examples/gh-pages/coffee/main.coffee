define [
  'Factory'
  'oraculum'
], (Factory, Oraculum) ->
  'use strict'

  # Create our "Dox" app factory
  # Point to Oraculum as the base factory
  Dox = new Factory (-> Oraculum), baseTags: ['Dox']

  # Mirror all of Oraculum's definitions and mixins
  Dox.mirror Oraculum

  # Return the new factory for use
  return window.Dox = Dox
