import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function RenderComment({ comment, isReply = false }) {
	const { id } = useParams();
	const [editingCommentId, setEditingCommentId] = useState(null);
	const [editingContent, setEditingContent] = useState('');
	const [commentToRender, setCommentToRender] = useState(comment);
	const navigate = useNavigate();

	const updateComment = async (commentId) => {
		try {
			const updateCommentResponse = await fetch(
				`http://localhost:3000/posts/${id}/comments`,
				{
					method: 'GET',
					headers: {
						'Content-type': 'application/json',
					},
				}
			);

			if (updateCommentResponse.ok) {
				const data = await updateCommentResponse.json();
				if (data.comments) {
					const rightComment = data.comments.find(
						(comment) => comment.id === commentId
					);
					if (rightComment) {
						setCommentToRender(rightComment);
					} else {
						console.error('Comment not found');
					}
				} else {
					console.error('No comments found');
				}
			} else {
				console.error('Error loading comments');
			}
		} catch (error) {
			console.error('Error getting comment:', error);
		}
	};

	const handleReactionClick = async (isLike, commentId) => {
		try {
			const reactionType = isLike ? 'like' : 'dislike'; //if isLike === true reactionType = like, if false, dislike
			const oppositeReactionType = isLike ? 'dislike' : 'like';

			if (
				localStorage.getItem(
					`user_${sessionStorage.getItem(
						'currentUser'
					)}_${oppositeReactionType}`
				) === `comment_${commentToRender.id}`
			) {
				const removeOppositeReaction = await fetch(
					`http://localhost:3000/posts/${id}/comments/${commentId}/${oppositeReactionType}?postId=${id}`,
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
				`http://localhost:3000/posts/${id}/comments/${commentId}/${reactionType}?postId=${id}`,
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
					`comment_${commentId}`
				);
				await updateComment(commentId);
			} else {
				console.error(reactionResponse.status, reactionResponse.statusText);
			}
		} catch (error) {
			console.error(`Error with button click:`, error);
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
				location.reload();
				console.log('Comment deleted successfully');
			} else {
				console.error('Error deleting comment');
			}
		} catch (error) {
			console.error('Error deleting comment:', error);
		}
	};

	const startEditing = (commentId, content) => {
		setEditingCommentId(commentId);
		setEditingContent(content);
	};

	useEffect(() => {
		console.log('Updated commentToRender:', commentToRender);
	}, [commentToRender]);

	const saveComment = async (commentId) => {
		try {
			const updateResponse = await fetch(
				`http://localhost:3000/posts/${id}/comments/${commentId}`,
				{
					method: 'PUT',
					headers: {
						'Content-type': 'application/json',
						authorization: `Bearer ${localStorage.getItem(
							`user_${sessionStorage.getItem('currentUser')}.AccessToken`
						)}`,
					},
					body: JSON.stringify({
						content: editingContent,
					}),
				}
			);

			if (updateResponse.ok) {
				setEditingCommentId(null);
				setEditingContent('');
				await updateComment(commentId);
				console.log('Comment updated successfully');
			} else {
				console.error('Error updating comment');
			}
		} catch (error) {
			console.error('Error updating comment:', error);
		}
	};

	const cancelEditing = () => {
		setEditingCommentId(null);
		setEditingContent('');
	};

	return (
		<>
			<div>
				{editingCommentId === commentToRender.id ? (
					<div>
						<h4>Edit Comment</h4>
						<textarea
							value={editingContent}
							onChange={(e) => setEditingContent(e.target.value)}
						/>
						<button onClick={() => saveComment(commentToRender.id)}>
							Save
						</button>
						<button onClick={cancelEditing}>Cancel</button>
					</div>
				) : (
					<>
						<p>
							<strong>Author ID:</strong> {commentToRender.authorId}
						</p>
						<p>
							<strong>Content:</strong> {commentToRender.content}
						</p>
						<p>
							<strong>Date:</strong>{' '}
							{new Date(commentToRender.date).toLocaleDateString()}
						</p>
						<p>
							<strong>Likes:</strong> {commentToRender.likes}
						</p>
						<button
							onClick={() => handleReactionClick(true, commentToRender.id)}
							disabled={
								localStorage.getItem(
									`user_${sessionStorage.getItem('currentUser')}_like`
								) === `comment_${commentToRender.id}`
							}
						>
							Like
						</button>

						<p>
							<strong>Dislikes:</strong> {commentToRender.dislikes}
						</p>
						<button
							onClick={() => handleReactionClick(false, commentToRender.id)}
							disabled={
								localStorage.getItem(
									`user_${sessionStorage.getItem('currentUser')}_dislike`
								) === `comment_${commentToRender.id}`
							}
						>
							Dislike
						</button>

						<p>
							<strong>Edited:</strong> {commentToRender.edited ? 'Yes' : 'No'}
						</p>
						<button onClick={() => deleteComment(commentToRender.id)}>
							Delete Comment
						</button>
						<button
							onClick={() =>
								startEditing(commentToRender.id, commentToRender.content)
							}
							style={{
								display:
									commentToRender.authorId.toString() !==
									sessionStorage.getItem('currentUser')
										? 'none'
										: 'inline-block',
							}}
						>
							Edit Comment
						</button>
						<button
							onClick={() => {
								navigate(
									`/dev/post/${id}/comments/${commentToRender.id}/thread/new`
								);
							}}
							style={{ display: isReply ? 'none' : 'inline-block' }}
						>
							Add Reply
						</button>
						<button
							onClick={() => {
								navigate(
									`/dev/post/${id}/comments/${commentToRender.id}/thread`
								);
							}}
							style={{ display: isReply ? 'none' : 'inline-block' }}
						>
							See Full Thread
						</button>
					</>
				)}
				<br />
				<br />
			</div>
		</>
	);
}
