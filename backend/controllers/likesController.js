const { prisma } = require('../models/prisma/prismaClient');
const {
	addLike,
	rmvLike,
	addDislike,
	rmvDislike,
} = require('../models/prisma/scripts/likeScripts');

async function likeComment(req, res) {
	try {
		const { postId, commentId } = req.params;

		const success = await addLike(
			prisma,
			parseInt(postId, 10),
			commentId ? parseInt(commentId, 10) : undefined
		);
		if (success) {
			return res.status(200).json({ message: 'Like added successfully' });
		} else {
			return res.status(404).json({ error: 'Post or Comment not found' });
		}
	} catch (error) {
		console.error('Error adding like:', error);
		res.status(500).json({ error: 'Failed to add like' });
	}
}

async function unlikeComment(req, res) {
	try {
		const { postId, commentId } = req.params;

		const success = await rmvLike(
			prisma,
			parseInt(postId, 10),
			commentId ? parseInt(commentId, 10) : undefined
		);
		if (success) {
			return res.status(200).json({ message: 'Like removed successfully' });
		} else {
			return res.status(404).json({ error: 'Post or Comment not found' });
		}
	} catch (error) {
		console.error('Error removing like:', error);
		res.status(500).json({ error: 'Failed to remove like' });
	}
}

async function dislikeComment(req, res) {
	try {
		const { postId, commentId } = req.params;

		const success = await addDislike(
			prisma,
			parseInt(postId, 10),
			commentId ? parseInt(commentId, 10) : undefined
		);
		if (success) {
			return res.status(200).json({ message: 'Dislike added successfully' });
		} else {
			return res.status(404).json({ error: 'Post or Comment not found' });
		}
	} catch (error) {
		console.error('Error adding dislike:', error);
		res.status(500).json({ error: 'Failed to add dislike' });
	}
}

async function undislikeComment(req, res) {
	try {
		const { postId, commentId } = req.params;

		const success = await rmvDislike(
			prisma,
			parseInt(postId, 10),
			commentId ? parseInt(commentId, 10) : undefined
		);
		if (success) {
			return res.status(200).json({ message: 'Dislike removed successfully' });
		} else {
			return res.status(404).json({ error: 'Post or Comment not found' });
		}
	} catch (error) {
		console.error('Error removing dislike:', error);
		res.status(500).json({ error: 'Failed to remove dislike' });
	}
}

module.exports = {
	likeComment,
	unlikeComment,
	dislikeComment,
	undislikeComment,
};
