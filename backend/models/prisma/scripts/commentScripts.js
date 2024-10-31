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

module.exports = { makeComment };
