var jsonServer = require('json-server')

// create express server
var server = jsonServer.create()

// create router object | db.json doesn't need any data
var router = jsonServer.router('db.json')

// set default middlewares like logger
server.use(jsonServer.defaults())

// wrap the json reponse inside a standard object (status, message, data)
server.use((req, res, next) => {
    var originalSend = res.send;

    res.send = function(){
        var response = {status:0, message:"Success", data: JSON.parse(arguments[0])}
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

// Routes for different sections
server.use('/users', jsonServer.router('users.json'))
server.use('/menu', jsonServer.router('menu.json'))

// set router after custom routes
server.use(router)

// start server
server.listen(8080, () => {
    console.log('JSON Server is running')
})