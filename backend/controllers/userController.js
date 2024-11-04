const { generateToken } = require('../controllers/tokenController');
const bcrypt = require('bcryptjs');

const { prisma } = require('../models/prisma/prismaClient');

const {
	addUserToDatabase,
	removeToken,
} = require('../models/prisma/scripts/authScripts');

async function postUser(req, res) {
	const { email, password, name } = req.body;

	if (!email || !password || !name) {
		return res
			.status(400)
			.json({ error: 'Email, password, and name are required' });
	}

	try {
		const user = await addUserToDatabase(email, password, name, prisma);
		res.json({ user });
	} catch (error) {
		console.error('Error registering user:', error);
		res.status(500).json({ error: error.message });
	}
}

async function loginUser(req, res) {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: 'Email and password are required.' });
	}
	const user = await prisma.user.findUnique({ where: { email: email } });
	try {
		if (!user) {
			return res.status(401).json({ error: 'Invalid Credentials' });
		}

		const checkPassword = await bcrypt.compare(password, user.password);
		if (!checkPassword) {
			return res.status(401).json({ error: 'Invalid Credentials' });
		}

		const token = generateToken(email);

		res.json({
			message: 'User Logged in',
			user,
			accessToken: token.accessToken,
			refreshToken: token.refreshToken,
		});
	} catch (err) {
		console.error('Error during login:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

async function logoutUser(req, res) {
	const { email } = req.body;

	try {
		await removeToken(email, prisma);
		res.json({ message: 'Logged out successfully' });
	} catch (error) {
		console.error('Error logging out:', error);
		res.status(500).json({ error: 'Failed to log out' });
	}
}

module.exports = { postUser, loginUser, logoutUser };
