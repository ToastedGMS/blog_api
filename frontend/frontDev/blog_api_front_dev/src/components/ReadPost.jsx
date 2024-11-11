import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function ReadPost() {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loadComments, setLoadComments] = useState(true);

	const readPost = async () => {
		try {
			const readPostResponse = await fetch(
				`http://localhost:3000/posts?postId=${id}`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
					},
				}
			);

			if (readPostResponse.ok) {
				const data = await readPostResponse.json();
				if (data.posts && data.posts.length > 0) {
					setPost(data.posts[0]);
				} else {
					console.error('No post found');
				}
			} else {
				console.error('Error loading post');
			}
		} catch (error) {
			console.error('Error getting post:', error);
		} finally {
			setLoading(false);
		}
	};

	const readComments = async () => {
		try {
			const readCommentsResponse = await fetch(
				`http://localhost:3000/posts/${id}/comments`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
					},
				}
			);

			if (readCommentsResponse.ok) {
				const data = await readCommentsResponse.json();
				if (data.comments) {
					setComments(data.comments);
					console.log(data.comments);
				} else {
					console.error('No comments found');
				}
			} else {
				console.error('Error loading comments');
			}
		} catch (error) {
			console.error('Error getting comments:', error);
		} finally {
			setLoadComments(false);
		}
	};

	useEffect(() => {
		readPost();
		readComments();
	}, [id]);

	if (loading) return <div>Loading post...</div>;
	if (!post) return <div>Post not found</div>;

	return (
		<>
			<div key={id}>
				<h2>{post.title}</h2>
				<p>{post.content}</p>
				<p>Posted on: {post.date}</p>
				<p>Likes: {post.likes}</p>
				<p>Dislikes: {post.dislikes}</p>
			</div>
			<div>
				<h3>Comments</h3>
				{loadComments ? (
					<div>Loading comments...</div>
				) : comments && comments.length > 0 ? (
					comments.map((comment) => (
						<div key={comment.id}>
							<p>
								<strong>Author ID:</strong> {comment.authorId}
							</p>
							<p>
								<strong>Content:</strong> {comment.content}
							</p>
							<p>
								<strong>Date:</strong>{' '}
								{new Date(comment.date).toLocaleDateString()}
							</p>
							<p>
								<strong>Likes:</strong> {comment.likes}
							</p>
							<p>
								<strong>Dislikes:</strong> {comment.dislikes}
							</p>
							<p>
								<strong>Edited:</strong> {comment.edited ? 'Yes' : 'No'}
							</p>
						</div>
					))
				) : (
					<div>No comments found</div>
				)}
			</div>
			<Link to={'/dev/home'}>Return</Link> <br />
			<Link to={'/dev/logout'}>Logout</Link>
		</>
	);
}
