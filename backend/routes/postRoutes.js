const router = require('express').Router();
const {
	postPost,
	getPost,
	routerDeletePost,
	putPost,
	routerTogglePublish,
} = require('../controllers/postController');
const { authenticateToken } = require('../controllers/tokenController');

router.post('/', authenticateToken, postPost);

router.get('/', getPost);

router.delete('/:postId', authenticateToken, routerDeletePost);

router.put('/:postId', authenticateToken, putPost);

router.put('/:postId/publish', authenticateToken, routerTogglePublish);

module.exports = router;
