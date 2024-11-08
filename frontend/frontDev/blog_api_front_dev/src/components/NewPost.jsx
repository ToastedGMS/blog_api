import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function NewPost() {
	const editorRef = useRef(null);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');

	const handleSavePost = async () => {
		const editorContent = editorRef.current.getContent();
		setContent(editorContent);

		try {
			const response = await fetch('http://localhost:3000/posts', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					authorization: `Bearer ${localStorage.getItem(
						`user_${sessionStorage.getItem('currentUser')}.AccessToken`
					)}`,
				},
				body: JSON.stringify({
					email: localStorage.getItem(
						`user_${sessionStorage.getItem('currentUser')}.Email`
					),
					title: title,
					content: content,
					tags: ['tag1', 'tag2'],
					authorId: sessionStorage.getItem('currentUser'),
				}),
			});

			const data = await response.json();

			if (response.ok) {
				console.log(data);
			} else {
				console.error('Error creating post');
			}
		} catch (error) {
			console.error('Error during post creation:', error);
		}
	};

	return (
		<div>
			<h1>Create New Post</h1>
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
					initialValue="<p>This is the initial content of the editor.</p>"
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
				<button onClick={handleSavePost}>Save Post</button>
			</div>
		</div>
	);
}
