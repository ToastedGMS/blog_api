async function createPost(
	prisma,
	authorId,
	title,
	content,
	tags,
	date = new Date()
) {
	try {
		const newPost = await prisma.posts.create({
			data: {
				authorId,
				title,
				content,
				tags,
				date,
			},
		});

		return newPost;
	} catch (error) {
		console.error('Error creating post on db:', error);
		throw error;
	}
}

async function fetchPosts(prisma, { userId, tags } = {}) {
	//consider adding pagination and sorting options
	try {
		const query = {
			where: {},
		};

		if (userId) {
			query.where.authorId = userId;
		}

		if (tags && tags.length > 0) {
			query.where.tags = {
				hasSome: tags,
			};
		}

		return prisma.posts.findMany(query);
	} catch (error) {
		console.error('Error fetching posts:', error);
		throw error;
	}
}

async function deletePost(prisma, postId) {
	try {
		const postToDelete = await prisma.posts.findFirst({
			where: { id: postId },
		});

		if (postToDelete) {
			await prisma.posts.delete({
				where: { id: postToDelete.id },
			});
			console.log('Post removed successfully');
			return true;
		} else {
			console.log('Post not found');
			return false;
		}
	} catch (error) {
		console.error('Error removing post from database', error);
		throw error;
	}
}

async function updatePost(prisma, postId, { title, content, tags } = {}) {
	try {
		const postToUpdate = await prisma.posts.findFirst({
			where: { id: postId },
		});

		if (!postToUpdate) {
			console.log('Post not found');
			return null;
		}

		const dataToUpdate = {};
		if (title !== undefined) dataToUpdate.title = title;
		if (content !== undefined) dataToUpdate.content = content;
		if (tags !== undefined) dataToUpdate.tags = tags;
		dataToUpdate.edited = true;

		if (Object.keys(dataToUpdate).length > 0) {
			const updatedPost = await prisma.posts.update({
				where: { id: postToUpdate.id },
				data: dataToUpdate,
			});
			const responseMsg = 'Post updated successfully:';
			return { responseMsg, updatedPost };
		} else {
			const responseMsg = 'No fields to update';
			return { responseMsg, postToUpdate };
		}
	} catch (error) {
		console.error('Error updating post:', error);
		throw error;
	}
}

module.exports = { createPost, fetchPosts, deletePost, updatePost };
