import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './components/App.jsx';
import LoginForm from './components/LoginForm.jsx';

const router = createBrowserRouter([
	{ path: '/', element: <App /> },
	{
		path: '/login',
		element: <LoginForm />,
	},
]);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
