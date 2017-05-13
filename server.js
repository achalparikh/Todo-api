var express = require ('express');
var bodyParser = require ('body-parser');
var app = express();
var _ = require('underscore');
var db  = require ('./db.js');


var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.send('Todo APP API');
});

//GET, get all todos, '/todos'
app.get('/todos', function (req, res){

    var queryParams = req.query;
    var where = {};

    if (queryParams.hasOwnProperty('completed')) {
        if (queryParams.completed === 'true') {
            where.completed = true;
        } else {
            where.completed = false;
        }
    }

    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
        where.description = {
            $like: '%' + queryParams.q + '%'
        };
    }

    db.todo.findAll({where: where}).then(function(foundTodos){
        res.json(foundTodos);
    }, function (e) {
        res.status(500).send();
    })
    
});

//GET, get one todo, '/todos/:id's
app.get('/todos/:id', function(req, res) {

    var todoId = parseInt(req.params.id);
    db.todo.findById(todoId).then(function(todo) {
        if (!!todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function (e) {
        res.status(500).send();
    });

});

//POST /todos/ (add todo to the todos array)
app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }).catch(function(e) {
        console.status(400).toJSON(e);
    });
});

//DELETE /todos/:id (delete todo by id)
app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id);

    db.todo.destroy({
        where: {
            id: todoId
        }
    }).then(function (deletedRows){
        if (deletedRows === 0) {
            res.status(404).send("no todo found");
        } else {
            res.status(204).send();
        }
    }).then(function(e) {
        res.status(500).send();
    })

});
    // var matchedTodo = _.findWhere(todos, {id: todoId});

    // if (matchedTodo) {
    //     console.log(matchedTodo);
    //     console.log("todo deleted");
    //     res.json(matchedTodo);
    //     todos = _.without(todos, matchedTodo);
    // } else {
    //     res.status(404).send();
    // }
//}); 

//PUT /todos/:id (update todo by id)
app.put('/todos/:id', function (req, res) {

    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};
    var todoId = parseInt(req.params.id);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    //if no todo is found, quit
    if (!matchedTodo) {
        console.log("No todo found for updating");
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

//Event Listener
db.sequelize.sync().then(function() {
    app.listen (PORT, function () {
        console.log('express listening on port ' + PORT);
    });
});


