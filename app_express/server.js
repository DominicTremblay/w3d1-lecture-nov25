const express = require('express');
const port = process.env.port || 3001;
const todos = require('./db/todos');
const { uid } = require('./utils/util');
const bodyParser = require('body-parser');

const app = express();

// Static files are served from the public folder
app.use(express.static('public'));

app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/todos', (req, res) => {
  res.render('todos', { todos: todos });
});

app.post('/todos', (req, res) => {

  // extract the body of the request

  const type = req.body.type;
  const description = req.body.description;


  // create a new todo object

  const newTodo = {
    id: uid(),
    type,
    description
  };


  // add the new todo to the list

  todos.push(newTodo);

  // send back a response

  res
    .status(201)
    .send('Todo has been added')

});

app.listen(port, () => console.log(`express is listening on port ${port}`));