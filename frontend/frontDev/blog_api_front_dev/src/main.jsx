import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './components/App.jsx';
import LoginForm from './components/LoginForm.jsx';
import Logout from './components/Logout.jsx';
import Homepage from './components/Homepage.jsx';
import NewPost from './components/NewPost.jsx';
import ReadPost from './components/ReadPost.jsx';
import CommentSection from './components/CommentSection.jsx';
import NewComment from './components/NewComment.jsx';
import PostUpdate from './components/PostUpdate.jsx';

const router = createBrowserRouter([
	{ path: '/dev', element: <App /> },
	{
		path: '/dev/login',
		element: <LoginForm />,
	},
	{
		path: '/dev/logout',
		element: <Logout />,
	},
	{
		path: '/dev/home',
		element: <Homepage />,
	},
	{
		path: '/dev/newPost',
		element: <NewPost />,
	},
	{
		path: '/dev/post/:id',
		element: <ReadPost />,
		children: [
			{
				path: 'comments',
				element: <CommentSection />,
				children: [{ path: 'new', element: <NewComment /> }],
			},
		],
	},
	{
		path: '/dev/post/:id/update',
		element: <PostUpdate />,
	},
]);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
