import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import RenderComment from './RenderComment';

export default function ThreadComponent() {
	const { id, commentId } = useParams();
	const [commentToRender, setCommentToRender] = useState(null);
	const [replies, setReplies] = useState(null);

	useEffect(() => {
		const fetchCommentAndReplies = async () => {
			try {
				// Fetch the top comment
				const topCommentResponse = await fetch(
					`http://localhost:3000/posts/${id}/comments`
				);
				if (!topCommentResponse.ok)
					throw new Error('Error fetching top comment');
				const topCommentData = await topCommentResponse.json();

				// Check for the specific comment
				const topComment = topCommentData.comments.find(
					(comment) => comment.id === parseInt(commentId, 10)
				);

				if (topComment) {
					setCommentToRender(topComment);

					// Fetch replies for the top comment
					const repliesResponse = await fetch(
						`http://localhost:3000/posts/${id}/comments?repliedCommentId=${topComment.id}`
					);
					if (!repliesResponse.ok) throw new Error('Error fetching replies');
					const repliesData = await repliesResponse.json();

					// Assuming `setReplies` is used to manage the state for replies
					setReplies(repliesData.comments);
					console.log('Replies data', repliesData.comments);
				} else {
					console.error('Comment not found');
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchCommentAndReplies(); // Call the async function
		console.log('Replies:', replies);
	}, [id, commentId]); // Include relevant dependencies

	return (
		<div>
			{commentToRender ? (
				<div key={commentToRender.id}>
					<h2>Comment thread</h2>
					<RenderComment comment={commentToRender} />
					<Outlet />{' '}
				</div>
			) : (
				<h3>Loading comment...</h3>
			)}

			{replies ? (
				replies.map((reply) => (
					<div key={reply.id}>
						<RenderComment comment={reply} isReply={true} />
					</div>
				))
			) : (
				<h3>Loading replies...</h3>
			)}
		</div>
	);
}
