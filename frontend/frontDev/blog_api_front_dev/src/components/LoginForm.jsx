import React, { useState } from 'react';
import '../styles/LoginForm.css';

function LoginForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

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
					`${data.user.email}.AccessToken`,
					data.accessToken
				);
				localStorage.setItem(
					`${data.user.email}.RefreshToken`,
					data.refreshToken
				);
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
