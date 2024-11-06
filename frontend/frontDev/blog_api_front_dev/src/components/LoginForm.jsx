import React from 'react';
import '../styles/LoginForm.css';

function LoginForm() {
	return (
		<>
			<h1>Login</h1>
			<form action="http://localhost:3000/users/login" method="post">
				<label htmlFor="email">Email:</label>
				<input type="email" name="email" id="email" />

				<label htmlFor="password">Password: </label>
				<input type="password" name="password" id="password" />

				<button type="submit">Log in</button>
			</form>
		</>
	);
}

export default LoginForm;
