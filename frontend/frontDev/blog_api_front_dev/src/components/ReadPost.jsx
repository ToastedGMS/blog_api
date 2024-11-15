import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, Outlet } from 'react-router-dom';

export default function ReadPost() {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showComments, setShowComments] = useState(false);
	const [likeBtnMethod, setLikeBtnMethod] = useState('POST');
	const [dislikeBtnMethod, setDislikeBtnMethod] = useState('POST');
	const [publishStatus, setPublishStatus] = useState(null);
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

	const handleReactionClick = async (isLike) => {
		try {
			const reactionType = isLike ? 'like' : 'dislike';
			const oppositeReactionMethod = isLike ? dislikeBtnMethod : likeBtnMethod;
			const currentMethod = isLike ? likeBtnMethod : dislikeBtnMethod;
			const setCurrentMethod = isLike ? setLikeBtnMethod : setDislikeBtnMethod;
			const setOppositeMethod = isLike ? setDislikeBtnMethod : setLikeBtnMethod;

			if (oppositeReactionMethod === 'DELETE') {
				await handleReactionClick(!isLike);
			}

			const reactionResponse = await fetch(
				`http://localhost:3000/posts/${id}/${reactionType}?postId=${id}`,
				{
					method: currentMethod,
					headers: {
						'Content-type': 'application/json',
						authorization: `Bearer ${localStorage.getItem(
							`user_${sessionStorage.getItem('currentUser')}.AccessToken`
						)}`,
					},
				}
			);

			if (reactionResponse.ok) {
				if (currentMethod === 'POST') {
					setCurrentMethod('DELETE');
					setOppositeMethod('POST');
					console.log(`Post ${id} ${reactionType}d`);
				} else {
					setCurrentMethod('POST');
					console.log(`Post ${id} un${reactionType}d`);
				}
			} else {
				console.error(reactionResponse.status, reactionResponse.statusText);
			}
		} catch (error) {
			console.error(`Error with ${reactionType} button click:`, error);
		}
	};

	const handlePublish = async (isDraft, id) => {
		try {
			const publishResponse = await fetch(
				`http://localhost:3000/posts/${id}/publish`,
				{
					method: 'PUT',
					headers: {
						'Content-type': 'application/json',
						authorization: `Bearer ${localStorage.getItem(
							`user_${sessionStorage.getItem('currentUser')}.AccessToken`
						)}`,
					},
				}
			);

			if (publishResponse.ok) {
				setPublishStatus(!isDraft);
			} else {
				console.error(publishResponse.status, publishResponse.statusText);
			}
		} catch (error) {
			console.error('Error toggling publish status:', error);
		}
	};

	useEffect(() => {
		readPost();
	}, [id, likeBtnMethod, dislikeBtnMethod, publishStatus]);

	if (loading) return <div>Loading post...</div>;
	if (!post) return <div>Post not found</div>;

	return (
		<>
			<div key={id}>
				<div dangerouslySetInnerHTML={{ __html: post.title }} />
				<div dangerouslySetInnerHTML={{ __html: post.content }} />
				<p>Posted on: {new Date(post.date).toLocaleDateString()}</p>
				<p>Likes: {post.likes}</p>{' '}
				<button onClick={() => handleReactionClick(true)}>Like</button>
				<p>Dislikes: {post.dislikes}</p>{' '}
				<button onClick={() => handleReactionClick(false)}>Dislike</button>
			</div>{' '}
			<br />
			<br />
			<button onClick={toggleComments}>
				{showComments ? 'Hide Comments' : 'Show Comments'}
			</button>
			<Outlet context={{ showComments, setShowComments }} />
			<button onClick={deletePost}>Delete Post</button>
			<button
				onClick={() => handlePublish(post.isDraft ? true : false, post.id)}
			>
				{post.isDraft ? 'Publish' : 'Unpublish'}
			</button>
			<Link to={'/dev/home'}>Return</Link> <br />
			<Link to={'/dev/logout'}>Logout</Link>
		</>
	);
}
