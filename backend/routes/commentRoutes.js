const router = require('express').Router();
const {
	postComment,
	getComment,
	putComment,
	routerDeleteComment,
} = require('../controllers/commentController');
const { authenticateToken } = require('../controllers/tokenController');

router.post('/:postId/comments', authenticateToken, postComment);

router.get('/:postId/comments', getComment);

router.delete(
	'/:postId/comments/:commentId',
	authenticateToken,
	routerDeleteComment
);

router.put('/:postId/comments/:commentId', authenticateToken, putComment);

module.exports = router;
