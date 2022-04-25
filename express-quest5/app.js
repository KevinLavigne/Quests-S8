// Setup the environement variables form a .env file
require('dotenv').config();
const connection = require('./db-config');
// Import expres
const express = require('express');

// We store all express methods in a variable called app
const app = express();

// If an environment variable named PORT exists, we take it in order to let the user change the port without chaning the source code. Otherwise we give a default value of 3000
const port = process.env.PORT ?? 3000;

connection.connect((err) => {
	if (err) {
		console.error('error connecting: ' + err.stack);
	} else {
		console.log('connected to database with threadId :' + connection.threadId);
	}
});

app.use(express.json());

app.get('/', (req, res) => {
	res.send(`Welcome!`);
});
// We listen to incoming request on the port defined above

app.post('/api/movies', (req, res) => {
	const { title, director, year, color, duration } = req.body;
	connection.query(
		'INSERT INTO movies (title, director, year, color, duration) VALUES (?,?,?,?,?)',
		[title, director, year, color, duration],
		(err, result) => {
			if (err) {
				res.status(500).send('Error saving the movie');
			} else {
				res.status(200).send('Movie successfuly saved');
			}
		}
	);
});
app.get('/api/movies', (req, res) => {
	connection.query('SELECT * FROM movies', (err, result) => {
		//do something when mysql is done executing the query
		if (err) {
			res.status(500).send('Error retrieving data from database');
		} else {
			res.status(200).json(result);
		}
	});
});

/* l24 => l33 ===
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

app.put('/api/movies/:movieId', (req, res) => {
	const { movieId } = req.params;
	const userPropsToUpdate = req.body;
	connection.query(
		'UPDATE movies SET ? WHERE id = ?',
		[userPropsToUpdate, movieId],
		(err) => {
			if (err) {
				console.log(err);
				res.status(500).send('Error updating a movie');
			} else {
				res.status(200).send('movie updated successfully 🎉');
			}
		}
	);
});

app.post('/api/users', (req, res) => {
	const { firstname, lastname, email } = req.body;
	connection.query(
		'INSERT INTO users (firstname, lastname, email) VALUES (?,?,?)',
		[firstname, lastname, email],
		(err, result) => {
			if (err) {
				res.status(500).send('Error saving the user');
			} else {
				res.status(200).send('User successfuly saved');
			}
		}
	);
});

app.get('/api/users', (req, res) => {
	connection.query('SELECT * FROM users', (err, result) => {
		//do something when mysql is done executing the query
		if (err) {
			res.status(500).send('Error retrieving data from database');
		} else {
			res.status(200).json(result);
		}
	});
});


// Cette route va mettre à jour un utilisateur en BdD
app.put('/api/users/:userId', (req, res) => {
	// On récupère l'id depuis les paramètres de la requête
	const { userId } = req.params;
	// On récupère les nouvelles valeurs depuis le corps de notre requête
	const userPropsToUpdate = req.body;
	// On envoie une requête UPDATE à notre BdD
	connection.query(
		'UPDATE users SET ? WHERE id = ?',
		[userPropsToUpdate, userId],
		(err) => {
			// Une fois la requête exécutée, on peut répondre à la requête HTTP
			if (err) {
				console.log(err);
				res.status(500).send('Error updating a user');
			} else {
				res.status(200).send('User updated successfully 🎉');
			}
		}
	);
});

app.listen(port, (err) => {
	if (err) {
		console.error('Something bad happened');
	} else {
		console.log(`Server is listening on ${port}`);
	}
});
