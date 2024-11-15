import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Homepage() {
	const [posts, setPosts] = useState([]);
	const navigate = useNavigate();

	const fetchPosts = async () => {
		try {
			const fetchPostsResponse = await fetch('http://localhost:3000/posts', {
				method: 'GET',
			});

			if (fetchPostsResponse.ok) {
				const data = await fetchPostsResponse.json();
				setPosts(data.posts);
			} else {
				const data = await fetchPostsResponse.json();
				console.log(data.message);
				setPosts([]);
			}
		} catch (error) {
			console.error('Error fetching posts:', error);
			setPosts([]);
		}
	};
	useEffect(() => {
		fetchPosts();
	}, []);

	return (
		<>
			<div>
				{posts.map((post) => (
					<div
						key={post.id}
						onClick={() => {
							navigate(`/dev/post/${post.id}`);
						}}
						style={{
							cursor: 'pointer',
							opacity: post.isDraft ? '60%' : '100%',
						}}
					>
						<h2>{post.title}</h2>
						<h4>Likes {post.likes}</h4>
						<h4>Dislikes {post.dislikes}</h4>
						<h3>Published: {post.isDraft ? 'No' : 'Yes'}</h3>
					</div>
				))}
			</div>
			<Link to={'/dev/newPost'}>New Post</Link> <br />
			<Link to={'/dev/logout'}>Logout</Link>
		</>
	);
}
