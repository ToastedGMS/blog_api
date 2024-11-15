import { Editor } from '@tinymce/tinymce-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function PostUpdate() {
	const { id } = useParams();
	const editorRef = useRef(null);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [post, setPost] = useState(null);
	const navigate = useNavigate();

	const getPost = async () => {
		try {
			const getPost = await fetch(`http://localhost:3000/posts?postId=${id}`, {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
				},
			});

			if (getPost.ok) {
				const data = await getPost.json();
				if (data.posts && data.posts.length > 0) {
					const fetchedPost = data.posts[0];
					setPost(fetchedPost);
					setTitle(fetchedPost.title);
					setContent(fetchedPost.content);
				} else {
					console.error('No post found');
				}
			} else {
				console.error('Error loading post');
			}
		} catch (error) {
			console.error('Error getting post:', error);
		}
	};

	const handleEditPost = async () => {
		const editorContent = editorRef.current.getContent();

		try {
			const response = await fetch(`http://localhost:3000/posts/${id}`, {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json',
					authorization: `Bearer ${localStorage.getItem(
						`user_${sessionStorage.getItem('currentUser')}.AccessToken`
					)}`,
				},
				body: JSON.stringify({
					title: title,
					content: editorContent,
					tags: ['tag1', 'tag2'],
				}),
			});

			const data = await response.json();

			if (response.ok) {
				console.log(data);
				navigate('/dev/home');
			} else {
				console.log(response.status);
				console.error('Error editing post');
			}
		} catch (error) {
			console.error('Error during post edit:', error);
		}
	};

	useEffect(() => {
		getPost();
	}, [id]);

	return (
		<div>
			{post ? (
				<>
					<h1>Edit Post</h1>
					<div>
						<label htmlFor="title">Title</label>
						<input
							type="text"
							id="title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Enter post title"
						/>
					</div>
					<div>
						<Editor
							apiKey="08dponf3geqba0ktjribs9iaaddlodqxs3dins90fx393xt2" // Make sure to replace with your actual API key
							onInit={(evt, editor) => (editorRef.current = editor)}
							initialValue={content}
							init={{
								height: 500,
								menubar: false,
								plugins: [
									'advlist',
									'autolink',
									'lists',
									'link',
									'image',
									'charmap',
									'preview',
									'anchor',
									'searchreplace',
									'visualblocks',
									'code',
									'fullscreen',
									'insertdatetime',
									'media',
									'table',
									'code',
									'help',
									'wordcount',
								],
								toolbar:
									'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
								content_style:
									'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
							}}
						/>
					</div>
					<div>
						<button onClick={handleEditPost}>Save Post</button>
					</div>
				</>
			) : (
				<h1>Loading...</h1>
			)}
		</div>
	);
}
