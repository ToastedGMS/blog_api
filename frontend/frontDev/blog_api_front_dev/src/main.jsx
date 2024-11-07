import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './components/App.jsx';
import LoginForm from './components/LoginForm.jsx';
import Logout from './components/Logout.jsx';

const router = createBrowserRouter([
	{ path: '/', element: <App /> },
	{
		path: '/login',
		element: <LoginForm />,
	},
	{
		path: '/logout',
		element: <Logout />,
	},
]);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
