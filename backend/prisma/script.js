const bcrypt = require('bcryptjs');
const { prisma } = require('../index');

async function addUserToDatabase(email, password, name) {
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

module.exports = { addUserToDatabase };
