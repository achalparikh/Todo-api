var express = require ('express');
var bodyParser = require ('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;



app.use(bodyParser.json());

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
    var matchedTodo;

    todos.forEach(function(todo) {
        if (todoId === todo.id) {
            matchedTodo = todo;
        }
    });

    if (matchedTodo) {
        res.json(matchedTodo);
    }
    else {
        res.status(404).send();
    }
});

//POST request to create data  POST /todos
app.post('/todos', function(req, res) {
    var body = req.body;

    body.id = todoNextId;
    todoNextId += 1;

    todos.push(body);

    res.send(body);
});

app.listen (PORT, function () {
    console.log('express listening on port ' + PORT);
});