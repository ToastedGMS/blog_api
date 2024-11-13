import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, Outlet } from 'react-router-dom';

export default function ReadPost() {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showComments, setShowComments] = useState(false);
	const navigate = useNavigate();

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

	const deletePost = async () => {
		try {
			const confirmDelete = window.confirm(
				'Are you sure you want to delete this post?'
			);
			if (!confirmDelete) return;

			const deletePostResponse = await fetch(
				`http://localhost:3000/posts/${id}`,
				{
					method: 'DELETE',
					headers: {
						'Content-type': 'application/json',
						authorization: `Bearer ${localStorage.getItem(
							`user_${sessionStorage.getItem('currentUser')}.AccessToken`
						)}`,
					},
				}
			);

			if (deletePostResponse.ok) {
				console.log('Post deleted successfully');
				navigate('/dev/home');
			} else {
				console.error('Error deleting post');
				console.log(deletePostResponse.status);
			}
		} catch (error) {
			console.error('Error deleting post:', error);
		}
	};

	const toggleComments = () => {
		setShowComments((prev) => !prev);
		if (!showComments) {
			navigate(`/dev/post/${id}/comments`);
		} else {
			navigate(`/dev/post/${id}`);
		}
	};

	useEffect(() => {
		readPost();
	}, [id]);

	if (loading) return <div>Loading post...</div>;
	if (!post) return <div>Post not found</div>;

	return (
		<>
			<div key={id}>
				<div dangerouslySetInnerHTML={{ __html: post.title }} />
				<div dangerouslySetInnerHTML={{ __html: post.content }} />
				<p>Posted on: {new Date(post.date).toLocaleDateString()}</p>
				<p>Likes: {post.likes}</p>
				<p>Dislikes: {post.dislikes}</p>
			</div>
			<button onClick={toggleComments}>
				{showComments ? 'Hide Comments' : 'Show Comments'}
			</button>
			<Outlet context={{ showComments, setShowComments }} />
			<button onClick={deletePost}>Delete Post</button>
			<Link to={'/dev/home'}>Return</Link> <br />
			<Link to={'/dev/logout'}>Logout</Link>
		</>
	);
}
