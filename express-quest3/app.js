// Setup the environement variables form a .env file
require('dotenv').config();
const connection = require('./db-config');
// Import expres
const express = require('express');

// We store all express methods in a variable called app
const app = express();

// If an environment variable named PORT exists, we take it in order to let the user change the port without chaning the source code. Otherwise we give a default value of 3000
const port = process.env.PORT ?? 3000;

app.get('/', (req, res) => {
	res.send(`Welcome!`);
});
// We listen to incoming request on the port defined above
connection.connect((err) => {
	if (err) {
		console.error('error connecting: ' + err.stack);
	} else {
		console.log('connected to database with threadId :' + connection.threadId);
	}
});
app.get('/api/movies', (req, res) => {
	connection.query('SELECT * FROM movies', (err, result) => {
		//do something when mysql is done executing the query
    if (err) {
      res.status(500).send('Error retrieving data from database')
    } else {
      res.status(200).json(result)
    }
	});
});

/* l24 => l33 === l36 => l 45
app.get('/api/movies', (req, res) => {
	connection.promise().query('SELECT * FROM movies')
		//do something when mysql is done executing the query
    .then((result)=> {
    res.status(200).json(result);
  })
  .catch((err) =>{
    res.status(500).send('Error retrieving data from database')
  })
});
*/
app.listen(port, (err) => {
	if (err) {
		console.error('Something bad happened');
	} else {
		console.log(`Server is listening on ${port}`);
	}
});
