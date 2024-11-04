const router = require('express').Router();
const { postToken } = require('../controllers/tokenController');

router.post('/refresh', postToken);

module.exports = router;
