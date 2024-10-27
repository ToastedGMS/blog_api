//server related imports
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;
const initializePassport = require('./controllers/auth/passport-config');

const app = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'keyboard cat',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: true },
	})
);

//initialize passport
initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

//routes
app.get('/', (req, res) => {
	res.json('Hello World');
});

app.post(
	'/login',
	passport.authenticate('local', { failureRedirect: '/login' }),
	function (req, res) {
		res.json({ message: 'User Logged in', user: req.user });
	}
);

app.get('/logout', (req, res) => {
	req.logOut(function (err) {
		if (err) {
			return next(err);
		}
		res.json({ message: 'user logged out' });
	});
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
