#> coffee server.coffee
express = require 'express'
server = express()
server.use express.static __dirname
server.listen 8080
