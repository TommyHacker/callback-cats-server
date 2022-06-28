const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

const cron = require('node-cron');

// cron.schedule('* * * * * *', () => {
//   console.log('running a task every second');
// });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DATABASE_URL);

mongoose.connection
	.on('error', (error) => console.log(error))
	.on('open', () => console.log('database live'));

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

const habitsRoutes = require('./routes/habits');

app.use('/habits', habitsRoutes);

app.get('/', (req, res) => {
	try {
		res.json({ success: true, message: 'api success.' });
	} catch (err) {
		res.status(500).json({ success: false, message: 'something went wrong!' });
	}
});

module.exports = app;
