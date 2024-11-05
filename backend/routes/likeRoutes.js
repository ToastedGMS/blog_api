const router = require('express').Router();
const {
	likeComment,
	unlikeComment,
	dislikeComment,
	undislikeComment,
} = require('../controllers/likesController'); // or the appropriate controller if separated for posts and comments
const { authenticateToken } = require('../controllers/tokenController');

router.post('/:postId/like', authenticateToken, likeComment);
router.post(
	'/:postId/comments/:commentId/like',
	authenticateToken,
	likeComment
);

router.delete('/:postId/like', authenticateToken, unlikeComment);
router.delete(
	'/:postId/comments/:commentId/like',
	authenticateToken,
	unlikeComment
);

router.post('/:postId/dislike', authenticateToken, dislikeComment);
router.post(
	'/:postId/comments/:commentId/dislike',
	authenticateToken,
	dislikeComment
);

router.delete('/:postId/dislike', authenticateToken, undislikeComment);
router.delete(
	'/:postId/comments/:commentId/dislike',
	authenticateToken,
	undislikeComment
);

module.exports = router;
