const {
	postUser,
	loginUser,
	logoutUser,
} = require('../controllers/userController');

const router = require('express').Router();

router.post('/new', postUser);

router.post('/login', loginUser);

router.delete('/logout', logoutUser);

module.exports = router;
