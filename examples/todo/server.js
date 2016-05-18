import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';


const APP_PORT = 3000;
var TODO_ID = 0;
const DATA_TODOS = [
  {
    id: ++TODO_ID,
    text: 'My First Todo',
    complete: false
  }
];

var compiler = webpack({
  entry: path.resolve(__dirname, 'js', 'app.js'),
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        test: /\.js$/
      }
    ]
  },
  resolve: {
    root: [path.resolve(__dirname, 'js')]
  },
  output: {filename: 'app.js', path: '/'}
});

var app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  publicPath: '/js/',
  stats: {colors: true}
});

var router = express.Router();

router.use(express.static('public'));
router.use(bodyParser.json());

router.param('todo_id', function(req, res, next, id) {
  var i, todo;

  for (i=0; i<DATA_TODOS.length; i++) {
    todo = DATA_TODOS[i];
    if (todo.id == id) {
      req.param_todo = {
        item: todo,
        index: i
      };
      next();
    }
  }

  res.status(404).end();
});

router.get('/todos', function(req, res, next) {
  res.json(DATA_TODOS);
});

router.post('/todos', function(req, res, next) {
  setTimeout(function() {
    DATA_TODOS.push({id: ++TODO_ID, text: req.body.text});
    res.status(201).json(DATA_TODOS);
  }, 3000);
});

router.put('/todos', function(req, res, next) {
  var i, todo;

  for (i=0; i<DATA_TODOS.length; i++) {
    todo = DATA_TODOS[i];
    todo.complete = req.body.complete;
  }
  res.status(201).json(DATA_TODOS);
});

router.delete('/todos/completed', function(req, res, next) {
  var i, todo;

  for (i=0; i<DATA_TODOS.length; i++) {
    todo = DATA_TODOS[i];
    if (todo.complete) {
      DATA_TODOS.splice(i, 1);
      i--;
    }
  }
  res.status(201).json(DATA_TODOS);
});

router.put('/todos/:todo_id', function(req, res, next) {
  if (typeof(req.body.complete) !== 'undefined') {
    req.param_todo.item.complete = req.body.complete;
  }
  if (typeof(req.body.text) !== 'undefined') {
    req.param_todo.item.text = req.body.text;
  }
  res.status(204).end();
});

router.delete('/todos/:todo_id', function(req, res, next) {
  DATA_TODOS.splice(req.param_todo.index, 1);
  res.status(204).end();
});

// Serve static resources
app.use('/', router);
app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
