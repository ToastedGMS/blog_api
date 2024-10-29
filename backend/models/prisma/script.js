const bcrypt = require('bcryptjs');

async function addUserToDatabase(email, password, name, prisma) {
	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		const newUser = await prisma.user.create({
			data: { email, password: hashedPassword, name },
		});

		return newUser;
	} catch (error) {
		console.error('Error adding user to database', error);
		throw error;
	}
}

async function saveRefreshToken(token, email, prisma) {
	try {
		const newToken = await prisma.refreshTokens.create({
			data: { token, userEmail: email },
		});

		return newToken;
	} catch (error) {
		console.error('Error adding token to database', error);
		throw error;
	}
}

async function checkToken(refreshToken, prisma) {
	try {
		const token = await prisma.refreshTokens.findFirst({
			where: { token: refreshToken },
		});

		return token !== null;
	} catch (error) {
		console.error('Error checking token in database', error);
		throw error;
	}
}

async function removeToken(email, prisma) {
	try {
		console.log(`Attempting to remove token for email: ${email}`);

		const tokenToDelete = await prisma.refreshTokens.findFirst({
			where: { userEmail: email },
		});

		if (tokenToDelete) {
			await prisma.refreshTokens.delete({
				where: { id: tokenToDelete.id },
			});
			console.log('Token removed successfully');
		} else {
			console.log('Token not found');
		}
	} catch (error) {
		console.error('Error removing token from database', error);
		throw error;
	}
}

module.exports = {
	addUserToDatabase,
	saveRefreshToken,
	checkToken,
	removeToken,
};
