async function makeComment(
	prisma,
	authorId,
	postId,
	content,
	isReply = false,
	repliedCommentId = undefined,
	date = new Date()
) {
	try {
		const newComment = await prisma.comments.create({
			data: { authorId, postId, content, date, isReply, repliedCommentId },
		});

		return newComment;
	} catch (error) {
		console.error('Error making comment on db:', error);
		throw error;
	}
}

async function fetchComments(
	prisma,
	postId,
	{ repliedCommentId, skip = 0, take = 10, orderBy = { date: 'asc' } } = {}
) {
	try {
		const query = {
			where: {
				postId,
			},
			skip,
			take,
			orderBy,
		};

		if (!repliedCommentId) {
			query.where.repliedCommentId = null;
		} else {
			query.where.repliedCommentId = repliedCommentId;
		}

		return await prisma.comments.findMany(query);
	} catch (error) {
		console.error('Error fetching comments:', error);
		throw error;
	}
}

async function deleteComment(prisma, commentId) {
	try {
		const commentToDelete = await prisma.comments.findFirst({
			where: { id: commentId },
		});

		if (commentToDelete) {
			await prisma.comments.delete({
				where: { id: commentToDelete.id },
			});
			console.log('Comment removed successfully');
			return true;
		} else {
			console.log('Comment not found');
			return false;
		}
	} catch (error) {
		console.error('Error removing comment from database', error);
		throw error;
	}
}

async function updateComment(prisma, commentId, { content } = {}) {
	try {
		const commentToUpdate = await prisma.comments.findFirst({
			where: { id: commentId },
		});

		if (!commentToUpdate) {
			console.log('Comment not found');
			return null;
		}

		const dataToUpdate = {};
		if (content !== undefined) dataToUpdate.content = content;
		dataToUpdate.edited = true;

		if (Object.keys(dataToUpdate).length > 0) {
			const updatedComment = await prisma.comments.update({
				where: { id: commentToUpdate.id },
				data: dataToUpdate,
			});
			const responseMsg = 'Comment updated successfully:';
			return { responseMsg, updatedComment };
		} else {
			const responseMsg = 'No fields to update';
			return { responseMsg, commentToUpdate };
		}
	} catch (error) {
		console.error('Error updating comment:', error);
		throw error;
	}
}

module.exports = { makeComment, fetchComments, deleteComment, updateComment };
