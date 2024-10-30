async function fetchPosts({ userId, tags } = {}) {
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
