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

module.exports = { makeComment, fetchComments };
