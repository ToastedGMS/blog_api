const { prisma } = require('../models/prisma/prismaClient');
const jwt = require('jsonwebtoken');

const {
	checkToken,
	removeToken,
	saveRefreshToken,
} = require('../models/prisma/scripts/authScripts');
function generateToken(email) {
	try {
		const accessToken = jwt.sign(
			{ email: email },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '600s' } // 10min if you're not Einstein
		);

		const refreshToken = jwt.sign(
			{ email: email },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		saveRefreshToken(refreshToken, email, prisma);

		return { email: email, accessToken, refreshToken };
	} catch (error) {
		console.error('Error generating access token:', error);
		throw error;
	}
}

function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
		if (error) {
			return res.status(403).json({ error: 'Access Denied' });
		}
		req.user = user;
		next();
	});
}

async function postToken(req, res) {
	const { refreshToken, email } = req.body;

	if (!refreshToken || (await checkToken(refreshToken, prisma)) === false) {
		return res.status(401).json({ error: 'Invalid refresh token' });
	}

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, user) => {
			if (err) {
				return res.status(403).json({ error: 'Invalid refresh token' });
			}

			await removeToken(email, prisma);
			const token = generateToken(email);

			res.json({ accessToken: token.accessToken, email: email });
		}
	);
}

module.exports = { authenticateToken, generateToken, postToken };
