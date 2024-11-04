const { prisma } = require('../models/prisma/prismaClient');
const {
	createPost,
	fetchPosts,
	deletePost,
	updatePost,
} = require('../models/prisma/scripts/postScripts');

async function postPost(req, res) {
	try {
		const { authorId, title, content, tags } = req.body;

		if (!authorId || !title || !content || !tags) {
			const errorMessage = 'Missing parameters for post creation';
			console.error(errorMessage);
			return res.status(400).json({ error: errorMessage });
		}

		const newPost = await createPost(
			prisma,
			parseInt(authorId, 10),
			title,
			content,
			tags
		);

		res.json({ message: 'Post created successfully!', post: newPost });
	} catch (error) {
		res.sendStatus(500);
	}
}

async function getPost(req, res) {
	try {
		const { userId, tags } = req.query;

		const parsedUserId = userId ? parseInt(userId, 10) : undefined;

		const parsedTags = tags ? tags.split(',') : [];

		const posts = await fetchPosts(prisma, {
			userId: parsedUserId,
			tags: parsedTags,
		});
		res.json({ posts: posts });
	} catch (error) {
		res.sendStatus(500);
	}
}

async function routerDeletePost(req, res) {
	try {
		const { postId } = req.params;

		const deleted = await deletePost(prisma, parseInt(postId, 10));

		if (deleted) {
			res.status(200).json({ message: 'Post deleted successfully' });
		} else {
			res.status(404).json({ error: 'Post not found' });
		}
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete post' });
	}
}

async function putPost(req, res) {
	try {
		const { postId } = req.params;
		const { title, content, tags } = req.body;

		const updateParams = {};
		if (title !== undefined) updateParams.title = title;
		if (content !== undefined) updateParams.content = content;
		if (tags !== undefined) updateParams.tags = tags;

		const response = await updatePost(
			prisma,
			parseInt(postId, 10),
			updateParams
		);
		if (response.updatedPost) {
			return res.json({
				message: response.responseMsg,
				post: response.updatedPost,
			});
		} else {
			return res
				.status(200)
				.json({ message: response.responseMsg, post: response.postToUpdate });
		}
	} catch (error) {
		res.status(500).json({ error: 'Failed to update post' });
	}
}

module.exports = { getPost, postPost, routerDeletePost, putPost };
