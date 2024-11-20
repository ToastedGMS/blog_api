import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, Outlet } from 'react-router-dom';

export default function ReadPost() {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [showComments, setShowComments] = useState(false);
	const [publishStatus, setPublishStatus] = useState(null);
	const [update, setUpdate] = useState(0);
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

	const handleReactionClick = async (isLike, id) => {
		try {
			const reactionType = isLike ? 'like' : 'dislike'; //if isLike === true reactionType = like, if false, dislike
			const oppositeReactionType = isLike ? 'dislike' : 'like';

			if (
				localStorage.getItem(
					`user_${sessionStorage.getItem(
						'currentUser'
					)}_${oppositeReactionType}`
				) === `post_${id}`
			) {
				const removeOppositeReaction = await fetch(
					`http://localhost:3000/posts/${id}/${oppositeReactionType}?postId=${id}`,
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

				localStorage.removeItem(
					`user_${sessionStorage.getItem(
						'currentUser'
					)}_${oppositeReactionType}`
				);
			}

			const reactionResponse = await fetch(
				`http://localhost:3000/posts/${id}/${reactionType}?postId=${id}`,
				{
					method: 'POST',
					headers: {
						'Content-type': 'application/json',
						authorization: `Bearer ${localStorage.getItem(
							`user_${sessionStorage.getItem('currentUser')}.AccessToken`
						)}`,
					},
				}
			);

			if (reactionResponse.ok) {
				localStorage.setItem(
					`user_${sessionStorage.getItem('currentUser')}_${reactionType}`,
					`post_${id}`
				);
				setUpdate(update + 1);
			} else {
				console.error(reactionResponse.status, reactionResponse.statusText);
			}
		} catch (error) {
			console.error(`Error with button click:`, error);
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
	}, [id, publishStatus, update]);

	if (loading) return <div>Loading post...</div>;
	if (!post) return <div>Post not found</div>;

	return (
		<>
			<div key={id}>
				<div dangerouslySetInnerHTML={{ __html: post.title }} />
				<div dangerouslySetInnerHTML={{ __html: post.content }} />
				<p>Posted on: {new Date(post.date).toLocaleDateString()}</p>
				<p>Likes: {post.likes}</p>{' '}
				<button
					onClick={() => handleReactionClick(true, id)}
					disabled={
						localStorage.getItem(
							`user_${sessionStorage.getItem('currentUser')}_like`
						) === `post_${id}`
					}
				>
					Like
				</button>{' '}
				<p>Dislikes: {post.dislikes}</p>{' '}
				<button
					onClick={() => handleReactionClick(false, id)}
					disabled={
						localStorage.getItem(
							`user_${sessionStorage.getItem('currentUser')}_dislike`
						) === `post_${id}`
					}
				>
					Dislike
				</button>{' '}
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
			<button
				onClick={() => {
					navigate(`/dev/post/${id}/update`);
				}}
			>
				Edit
			</button>
			<Link to={'/dev/home'}>Return</Link> <br />
			<Link to={'/dev/logout'}>Logout</Link>
		</>
	);
}
