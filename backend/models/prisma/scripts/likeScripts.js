async function addLike(prisma, postId, commentId = undefined) {
	try {
		if (commentId !== undefined) {
			const commentToVote = await prisma.comments.findFirst({
				where: { id: commentId },
			});

			if (commentToVote) {
				await prisma.comments.update({
					where: { id: commentToVote.id },
					data: { likes: commentToVote.likes + 1 },
				});
				console.log('Comment liked successfully');
				return true;
			} else {
				console.log('Comment not found');
				return false;
			}
		} else {
			const postToVote = await prisma.posts.findFirst({
				where: { id: postId },
			});

			if (postToVote) {
				await prisma.posts.update({
					where: { id: postToVote.id },
					data: { likes: postToVote.likes + 1 },
				});
				console.log('Post liked successfully');
				return true;
			} else {
				console.log('Post not found');
				return false;
			}
		}
	} catch (error) {
		console.error('Error registering vote:', error);
		throw error;
	}
}

async function rmvLike(prisma, postId, commentId = undefined) {
	try {
		if (commentId !== undefined) {
			const commentToVote = await prisma.comments.findFirst({
				where: { id: commentId },
			});

			if (commentToVote) {
				await prisma.comments.update({
					where: { id: commentToVote.id },
					data: { likes: commentToVote.likes - 1 },
				});
				console.log('Like removed successfully');
				return true;
			} else {
				console.log('Comment not found');
				return false;
			}
		} else {
			const postToVote = await prisma.posts.findFirst({
				where: { id: postId },
			});

			if (postToVote) {
				await prisma.posts.update({
					where: { id: postToVote.id },
					data: { likes: postToVote.likes - 1 },
				});
				console.log('Like removed successfully');
				return true;
			} else {
				console.log('Post not found');
				return false;
			}
		}
	} catch (error) {
		console.error('Error registering vote:', error);
		throw error;
	}
}

async function addDislike(prisma, postId, commentId = undefined) {
	try {
		if (commentId !== undefined) {
			const commentToVote = await prisma.comments.findFirst({
				where: { id: commentId },
			});

			if (commentToVote) {
				await prisma.comments.update({
					where: { id: commentToVote.id },
					data: { dislikes: commentToVote.dislikes + 1 },
				});
				console.log('Comment disliked successfully');
				return true;
			} else {
				console.log('Comment not found');
				return false;
			}
		} else {
			const postToVote = await prisma.posts.findFirst({
				where: { id: postId },
			});

			if (postToVote) {
				await prisma.posts.update({
					where: { id: postToVote.id },
					data: { dislikes: postToVote.dislikes + 1 },
				});
				console.log('Post disliked successfully');
				return true;
			} else {
				console.log('Post not found');
				return false;
			}
		}
	} catch (error) {
		console.error('Error registering vote:', error);
		throw error;
	}
}

async function rmvDislike(prisma, postId, commentId = undefined) {
	try {
		if (commentId !== undefined) {
			const commentToVote = await prisma.comments.findFirst({
				where: { id: commentId },
			});

			if (commentToVote) {
				await prisma.comments.update({
					where: { id: commentToVote.id },
					data: { dislikes: commentToVote.dislikes - 1 },
				});
				console.log('Dislike removed successfully');
				return true;
			} else {
				console.log('Comment not found');
				return false;
			}
		} else {
			const postToVote = await prisma.posts.findFirst({
				where: { id: postId },
			});

			if (postToVote) {
				await prisma.posts.update({
					where: { id: postToVote.id },
					data: { dislikes: postToVote.dislikes - 1 },
				});
				console.log('Dislike removed successfully');
				return true;
			} else {
				console.log('Post not found');
				return false;
			}
		}
	} catch (error) {
		console.error('Error registering vote:', error);
		throw error;
	}
}

module.exports = { addLike, rmvLike, addDislike, rmvDislike };
