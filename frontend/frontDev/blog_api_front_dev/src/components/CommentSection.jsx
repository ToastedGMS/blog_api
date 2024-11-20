import React, { useEffect, useState } from 'react';
import { Outlet, useParams, Link, useNavigate } from 'react-router-dom';
import RenderComment from './RenderComment';

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
					comments.map((comment) => {
						return (
							<div key={comment.id}>
								<RenderComment comment={comment} />{' '}
							</div>
						);
					})
				) : (
					<div>No comments found</div>
				)}
			</div>
		</>
	);
}
