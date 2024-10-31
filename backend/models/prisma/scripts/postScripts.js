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

		console.log('Post created:', newPost);
		return newPost;
	} catch (error) {
		console.error('Error creating post on db:', error);
		throw error;
	}
}

async function fetchPosts({ userId, tags, prisma } = {}) {
	//consider adding pagination and sorting options
	try {
		const query = {
			where: {},
		};

		if (!userId && !tags) {
			console.error('Error fetching posts: No query parameters provided.');
			return posts;
		}

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
module.exports = { createPost, fetchPosts };
