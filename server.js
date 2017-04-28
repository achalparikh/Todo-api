var express = require ('express');
var bodyParser = require ('body-parser');
var app = express();
var _ = require('underscore');


var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.send('Todo APP API');
});

//GET, get all todos, '/todos'
app.get('/todos', function (req, res){
    res.json(todos);
});

//GET, get one todo, '/todos/:id'
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if (matchedTodo) {
        res.json(matchedTodo);
    }
    else {
        res.status(404).send();
    }
});

//POST /todos/ (add todo to the todos array)
app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        res.status(400).send();
    } else {

        body.description = body.description.trim();
        body.id = todoNextId;
        todoNextId += 1;
        todos.push(body);
        res.send(body);
    }
});

//DELETE /todos/:id (delete todo by id)
app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id);

    var matchedTodo = _.findWhere(todos, {id: todoId});

    if (matchedTodo) {
        console.log(matchedTodo);
        res.json(matchedTodo);
        todos = _.without(todos, matchedTodo);
    } else {
        res.status(404).send();
    }
}); 

//PUT /todos/:id (update todo by id)
app.put('/todos/:id', function (req, res) {

    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};
    var todoId = parseInt(req.params.id);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    //if no todo is found, quit
    if (!matchedTodo) {
        console.log("WHAT WHY");
        return res.status(404).send();
    }

    //verify the completed attribute in the request

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        res.status(400).send();
    }

    //verify the description attribute in the request

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        res.status(400).send();
    }

    _.extend(matchedTodo, validAttributes);
    res.send(matchedTodo);

});




//Event listener 

app.listen (PORT, function () {
    console.log('express listening on port ' + PORT);
});