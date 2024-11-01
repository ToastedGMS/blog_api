//server related imports
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {
	addUserToDatabase,
	saveRefreshToken,
	checkToken,
	removeToken,
} = require('./models/prisma/scripts/authScripts');
const {
	createPost,
	fetchPosts,
	deletePost,
	updatePost,
} = require('./models/prisma/scripts/postScripts');
const {
	makeComment,
	fetchComments,
	deleteComment,
} = require('./models/prisma/scripts/commentScripts');

const app = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.post('/users/new', async (req, res) => {
	const { email, password, name } = req.body;

	if (!email || !password || !name) {
		return res
			.status(400)
			.json({ error: 'Email, password, and name are required' });
	}

	try {
		const user = await addUserToDatabase(email, password, name, prisma);
		res.json({ user });
	} catch (error) {
		console.error('Error registering user:', error);
		res.status(500).json({ error: error.message });
	}
});

app.post('/users/login', async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: 'Email and password are required.' });
	}
	const user = await prisma.user.findUnique({ where: { email: email } });
	try {
		if (!user) {
			return res.status(401).json({ error: 'Invalid Credentials' });
		}

		const checkPassword = await bcrypt.compare(password, user.password);
		if (!checkPassword) {
			return res.status(401).json({ error: 'Invalid Credentials' });
		}

		const token = generateToken(email);

		res.json({
			message: 'User Logged in',
			user,
			accessToken: token.accessToken,
			refreshToken: token.refreshToken,
		});
	} catch (err) {
		console.error('Error during login:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.post('/tokens/refresh', async (req, res) => {
	const { refreshToken, email } = req.body;

	if (!refreshToken || (await checkToken(refreshToken, prisma)) === false) {
		return res.status(401).json({ error: 'Invalid refresh token' });
	}

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, user) => {
			if (err) {
				return res.status(403).json({ error: 'Invalid refresh token' });
			}

			await removeToken(email, prisma);
			const token = generateToken(email);

			res.json({ accessToken: token.accessToken, email: email });
		}
	);
});

app.delete('/users/logout', async (req, res) => {
	const { email } = req.body;

	try {
		await removeToken(email, prisma);
		res.json({ message: 'Logged out successfully' });
	} catch (error) {
		console.error('Error logging out:', error);
		res.status(500).json({ error: 'Failed to log out' });
	}
});

app.post('/posts/new', authenticateToken, async (req, res) => {
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
});

app.get('/posts', async (req, res) => {
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
});

app.delete('/posts/:postId', authenticateToken, async (req, res) => {
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
});

app.put('/posts/:postId', authenticateToken, async (req, res) => {
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
});

app.post('/posts/:postId/comments', authenticateToken, async (req, res) => {
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
});

app.get('/posts/:postId/comments', async (req, res) => {
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
});

app.delete(
	'/posts/:postId/comments/:commentId',
	authenticateToken,
	async (req, res) => {
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
);

function generateToken(email) {
	try {
		const accessToken = jwt.sign(
			{ email: email },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: '600s' } // 10min if you're not Einstein
		);

		const refreshToken = jwt.sign(
			{ email: email },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: '1d' }
		);

		saveRefreshToken(refreshToken, email, prisma);

		return { email: email, accessToken, refreshToken };
	} catch (error) {
		console.error('Error generating access token:', error);
		throw error;
	}
}

function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
		if (error) {
			return res.status(403).json({ error: 'Access Denied' });
		}
		req.user = user;
		next();
	});
}
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
