
require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.DATABASE_URL;
const db = mongoose.connection;

mongoose
	.connect(mongoURI)
	.then((conn) => {
		console.log('✅ mongo connection made!!')
		console.log(
			`Connected to MongoDB Atlas on ${conn.connections[0].name} database.`
		);
	})
	.catch((err) => {
		console.error(err);
	});

module.exports = mongoose;