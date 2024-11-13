import React, { useEffect, useState } from 'react';
import { Outlet, useParams, Link } from 'react-router-dom';

export default function CommentSection() {
	const { id } = useParams();
	const [comments, setComments] = useState(null);
	const [loadComments, setLoadComments] = useState(true);

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

	const deleteComment = async (commentId) => {
		const confirmDelete = window.confirm(
			'Are you sure you want to delete this comment?'
		);
		if (!confirmDelete) return;

		try {
			const deleteCommentResponse = await fetch(
				`http://localhost:3000/posts/${id}/comments/${commentId}`,
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

			if (deleteCommentResponse.ok) {
				setComments(comments.filter((comment) => comment.id !== commentId));
				console.log('Comment deleted successfully');
			} else {
				console.error('Error deleting comment');
			}
		} catch (error) {
			console.error('Error deleting comment:', error);
		}
	};

	useEffect(() => {
		readComments();
	}, [id]);

	return (
		<>
			<Link to={`/dev/post/${id}/comments/new`}>Add a new comment</Link>
			<Outlet />
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
							<button onClick={() => deleteComment(comment.id)}>
								Delete Comment
							</button>
						</div>
					))
				) : (
					<div>No comments found</div>
				)}
			</div>
		</>
	);
}
