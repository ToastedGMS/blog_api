import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from './TokenProvider';

function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const { initializeToken } = useContext(TokenContext);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch('http://localhost:3000/users/login', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (response.ok) {
				console.log('Login successful');

				localStorage.setItem(
					`user_${data.user.id}.AccessToken`,
					data.accessToken
				);
				localStorage.setItem(
					`user_${data.user.id}.RefreshToken`,
					data.refreshToken
				);
				localStorage.setItem(`user_${data.user.id}.Email`, data.user.email);
				sessionStorage.setItem('currentUser', data.user.id);

				// Initialize token in the context
				initializeToken(data.accessToken, 600); // Pass token and expiry time (600 seconds)

				navigate('/dev/home');
			} else {
				console.error('Login failed:', data);
			}
		} catch (error) {
			console.error('Error during login:', error);
		}
	};

	return (
		<>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="email">Email:</label>
				<input
					type="email"
					name="email"
					id="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>

				<label htmlFor="password">Password:</label>
				<input
					type="password"
					name="password"
					id="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>

				<button>Login</button>
			</form>
		</>
	);
}

export default LoginForm;
