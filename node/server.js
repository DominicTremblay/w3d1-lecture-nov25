const http = require('http');
const port = process.env.port || 3001;
const fs = require('fs');
const path = require('path');
const todos = require('./db/todos');
const { uid } = require('./utils/util');


const renderHTML = function (filename, cb) {

  console.log(__dirname);


  // __dirname gives the current directory where server.js is located
  // path.join, will add 'views' and the filename to the current directory

  const filePath = path.join(__dirname, 'views', filename);


  fs.readFile(filePath, 'utf-8', cb);

};

const getBody = function (req, cb) {

  let body = '';

  req.on('data', function (part) {
    body += part;
  });

  req.on('end', function () {

    cb(body);

  });

  req.on('error', function (err) {
    console.log(err);
  })


}



// Create a http server with a request handler
const server = http.createServer((req, res) => {

  // es6 destructuring
  // const {headers, method, url} = req;

  const headers = req.headers;
  const method = req.method;
  const url = req.url;

  const route = `${method} ${url}`;


  // Routes Handler
  switch (route) {
    case 'GET /':
      console.log(`Received a request for ${route}`);

      // calling renderHTML to read the content of the file
      renderHTML('index.html', function (err, data) {

        if (err) {
          throw new Error(`Error loading ${err.message}`);
        }

        res.statusCode = 200;
        res.write(data);
        res.end();

      });

      break;

    case 'GET /todos':

      res.statusCode = 200;
      res.write(JSON.stringify(todos));
      res.end();
      break;

    case 'POST /todos':

      //extract the request body content
      getBody(req, function (body) {

        const todoInput = JSON.parse(body);

        const type = todoInput.type;
        const description = todoInput.description;

        // Create a new todo object

        const newTodo = {
          id: uid(),
          type: type,
          description: description
        };


        // add the new todo to the array of todos
        todos.push(newTodo);

        // send back a response
        res.statusCode = 201;
        res.write("The todo has been added");
        res.end();

      });



      break;

    default:
      renderHTML('404.html', function (err, data) {

        if (err) {
          throw new Error(`Error loading ${err.message}`);
        }

        res.statusCode = 404;
        res.write(data);
        res.end();

      })

  }





});

// have the server listens for requests

server.listen(port, () => console.log(`Server is listening on port ${port}`));