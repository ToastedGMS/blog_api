const router = require('express').Router();
const {
	postPost,
	getPost,
	routerDeletePost,
	putPost,
} = require('../controllers/postController');

const {
	postComment,
	getComment,
	putComment,
	routerDeleteComment,
} = require('../controllers/commentController');
const { authenticateToken } = require('../controllers/tokenController');

router.post('/new', authenticateToken, postPost);

router.get('/', getPost);

router.delete('/:postId', authenticateToken, routerDeletePost);

router.put('/:postId', authenticateToken, putPost);

router.post('/:postId/comments', authenticateToken, postComment);

router.get('/:postId/comments', getComment);

router.delete(
	'/:postId/comments/:commentId',
	authenticateToken,
	routerDeleteComment
);

router.put('/:postId/comments/:commentId', authenticateToken, putComment);

module.exports = router;
