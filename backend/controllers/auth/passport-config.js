const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const prisma = require('../..');

function initialize(passport) {
	passport.use(
		new LocalStrategy(async function (username, password, done) {
			const user = await prisma.user.findFirst({ where: { name: username } });
			try {
				if (!user) {
					return done(null, false, console.log('Incorrect Username'));
				}

				const checkPassword = await bcrypt.compare(password, user.password);
				if (!checkPassword) {
					return done(null, false, console.log('Incorrect Password'));
				}

				return done(null, user);
			} catch (error) {
				return done(error);
			}
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await prisma.user.findUnique({ where: { id } });
			done(null, user);
		} catch (error) {
			done(error);
		}
	});
}

module.exports = initialize;
