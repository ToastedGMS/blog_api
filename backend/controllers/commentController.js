const { prisma } = require('../models/prisma/prismaClient');
const {
	makeComment,
	fetchComments,
	deleteComment,
	updateComment,
} = require('../models/prisma/scripts/commentScripts');

async function postComment(req, res) {
	try {
		const { postId } = req.params;
		const { authorId, content, isReply, repliedCommentId } = req.body;
		const comment = await makeComment(
			prisma,
			authorId,
			parseInt(postId, 10),
			content,
			isReply,
			repliedCommentId
		);

		return res
			.status(200)
			.json({ message: 'Comment posted successfully', comment });
	} catch (error) {
		res.status(500).json({ error: 'Failed to post comment' });
	}
}

async function getComment(req, res) {
	try {
		const { postId } = req.params;
		const { repliedCommentId } = req.query;

		const comments = await fetchComments(prisma, parseInt(postId, 10), {
			repliedCommentId: repliedCommentId
				? parseInt(repliedCommentId, 10)
				: undefined,
		});

		return res
			.status(200)
			.json({ message: 'Comments fetched successfully', comments });
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch comments' });
	}
}
async function routerDeleteComment(req, res) {
	try {
		const { commentId } = req.params;

		const deleted = await deleteComment(prisma, parseInt(commentId, 10));

		if (deleted) {
			res.status(200).json({ message: 'Comment deleted successfully' });
		} else {
			res.status(404).json({ error: 'Comment not found' });
		}
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete comment' });
	}
}

async function putComment(req, res) {
	try {
		const { commentId } = req.params;
		const { content } = req.body;

		const updateParams = {};
		if (content !== undefined) updateParams.content = content;

		const response = await updateComment(
			prisma,
			parseInt(commentId, 10),
			updateParams
		);
		if (response.updatedComment) {
			return res.json({
				message: response.responseMsg,
				post: response.updatedComment,
			});
		} else {
			return res.status(200).json({
				message: response.responseMsg,
				post: response.commentToUpdate,
			});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to update comment' });
	}
}

module.exports = { getComment, postComment, routerDeleteComment, putComment };
