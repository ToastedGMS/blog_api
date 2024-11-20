import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function NewComment() {
	const { id } = useParams();
	const [comment, setComment] = useState('');
	const navigate = useNavigate();

	const postComment = async () => {
		if (!comment.trim()) {
			alert('Comment cannot be empty!');
			return;
		}
		try {
			const response = await fetch(
				`http://localhost:3000/posts/${id}/comments`,
				{
					method: 'POST',
					headers: {
						'Content-type': 'application/json',
						authorization: `Bearer ${localStorage.getItem(
							`user_${sessionStorage.getItem('currentUser')}.AccessToken`
						)}`,
					},
					body: JSON.stringify({
						authorId: parseInt(sessionStorage.getItem('currentUser'), 10),
						postId: id,
						content: comment,
					}),
				}
			);

			if (response.ok) {
				navigate(`/dev/post/${id}`);
			} else {
				console.error(response.status);
				console.error('Error posting comment');
			}
		} catch (error) {
			console.error('Error posting comment:', error);
		}
	};

	return (
		<div>
			<h2>Add a New Comment</h2>
			<textarea
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				placeholder="Write your comment"
			/>
			<button onClick={postComment}>Post Comment</button>
		</div>
	);
}
