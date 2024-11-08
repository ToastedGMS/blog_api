import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './components/App.jsx';
import LoginForm from './components/LoginForm.jsx';
import Logout from './components/Logout.jsx';
import Homepage from './components/Homepage.jsx';

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
]);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
