import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function NewReply() {
	const { id, commentId } = useParams();
	const [comment, setComment] = useState('');
	const navigate = useNavigate();

	const postReply = async () => {
		if (!comment.trim()) {
			alert('Comment cannot be empty!');
			return;
		}
		try {
			const response = await fetch(
				`http://localhost:3000/posts/${id}/comments/?repliedCommentId=${commentId}`,
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
						isReply: true,
						repliedCommentId: parseInt(commentId, 10),
					}),
				}
			);

			if (response.ok) {
				location.reload();
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
			<h3>Add a New Reply</h3>
			<textarea
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				placeholder="Write your comment"
			/>
			<button onClick={postReply}>Post Comment</button>
		</div>
	);
}