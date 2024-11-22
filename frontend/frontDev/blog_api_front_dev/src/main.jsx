import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TokenProvider from './components/TokenProvider.jsx'; // Import TokenProvider
import App from './components/App.jsx';
import LoginForm from './components/LoginForm.jsx';
import Logout from './components/Logout.jsx';
import Homepage from './components/Homepage.jsx';
import NewPost from './components/NewPost.jsx';
import ReadPost from './components/ReadPost.jsx';
import CommentSection from './components/CommentSection.jsx';
import NewComment from './components/NewComment.jsx';
import PostUpdate from './components/PostUpdate.jsx';
import ThreadComponent from './components/ThreadComponent.jsx';
import NewReply from './components/NewReply.jsx';

const router = createBrowserRouter([
	{ path: '/dev', element: <App /> },
	{ path: '/dev/login', element: <LoginForm /> },
	{ path: '/dev/logout', element: <Logout /> },
	{ path: '/dev/home', element: <Homepage /> },
	{ path: '/dev/newPost', element: <NewPost /> },
	{
		path: '/dev/post/:id',
		element: <ReadPost />,
		children: [
			{
				path: 'comments',
				element: <CommentSection />,
				children: [{ path: 'new', element: <NewComment /> }],
			},
			{
				path: 'comments/:commentId/thread',
				element: <ThreadComponent />,
				children: [{ path: 'new', element: <NewReply /> }],
			},
		],
	},
	{ path: '/dev/post/:id/update', element: <PostUpdate /> },
]);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<TokenProvider>
			<RouterProvider router={router} />
		</TokenProvider>
	</StrictMode>
);
