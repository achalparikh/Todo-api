var express = require ('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1,
    description: 'meet for lunch',
    completed: false
}, {
    id: 2,
    description: 'shopping',
    completed: false
}, {
    id: 3, 
    description: 'watch tv',
    completed: true
}];


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

    todos.forEach(function(todo) {
        if (todoId === todo.id) {
            res.json(todo);
        } else 
        res.status(404).send();
    });
});

app.listen (PORT, function () {
    console.log('express listening on port ' + PORT);
});