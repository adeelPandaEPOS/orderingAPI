var jsonServer = require('json-server')
var path = require('path')
var express = require('express')

// create express server
var server = jsonServer.create()

// create router object | db.json doesn't need any data
var router = jsonServer.router('db.json')

// set default middlewares like logger
server.use(jsonServer.defaults())

server.use('/static', express.static(path.join(__dirname, 'public')));

// wrap the json reponse inside a standard object (status, message, data)
server.use((req, res, next) => {
    var originalSend = res.send;

    res.send = function(){
        var status = 0;
        var message = "Success";

        var body = JSON.parse(arguments[0]);
        if (Array.isArray (body)) {
            if (body.length == 0) {
                status = 1;
                message = "No items found!";
            }
        } else {
            if (Object.keys(body).length === 0) {
                status = 1;
                message = "Item not found!";
            }
        }
        var response = {status: status, message: message, data: body}
        arguments[0] = JSON.stringify(response)
        
        originalSend.apply(res, arguments);
    };
    next()
})

// add one second delay
server.use((req, res, next) => {
    setTimeout(() => next(), 1000)
})

// echo route to check if server is running
server.get('/echo', (req, res) => {
    res.jsonp(req.query)
})

// avoid post data effecting the json data
server.post('*', function(req,res,next) {
     res.redirect (req.path);
})

// Routes for different sections
server.use('/users', jsonServer.router('users.json'))
server.use('/menu', jsonServer.router('menu.json'))

// set router after custom routes
server.use(router)

// start server
server.listen(8080, () => {
    console.log('JSON Server is running')
})
