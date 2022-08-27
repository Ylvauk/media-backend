const mongoose = require('./connection');
const seedData = require('./foodTruckSeed.json');
const User = require('./models/User');

User.deleteMany({})
	.then(() => {
		User.insertMany(seedData).then((user) => {
			console.log(user);
			process.exit();
		});
	})
	.catch((err) => console.error(err));