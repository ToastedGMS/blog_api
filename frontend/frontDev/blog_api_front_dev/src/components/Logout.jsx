import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from './TokenProvider'; // Import TokenContext

export default function Logout() {
	const [logoutMessage, setLogoutMessage] = useState('Logging user out...');
	const navigate = useNavigate();
	const { setAccessToken } = useContext(TokenContext); // Access the context

	const handleLogout = async () => {
		try {
			const currentUserId = sessionStorage.getItem('currentUser');
			const currentUserEmail = localStorage.getItem(
				`user_${currentUserId}.Email`
			);
			const logoutResponse = await fetch('http://localhost:3000/users/logout', {
				method: 'DELETE',
				headers: {
					'Content-type': 'Application/JSON',
				},
				body: JSON.stringify({ email: currentUserEmail }),
			});

			if (logoutResponse.ok) {
				const data = await logoutResponse.json();
				setLogoutMessage(data.message);

				// Clear context token
				setAccessToken(null); // Clears token from TokenProvider

				// Clear localStorage and sessionStorage
				sessionStorage.removeItem('currentUser');
				localStorage.removeItem(`user_${currentUserId}.AccessToken`);
				localStorage.removeItem(`user_${currentUserId}.RefreshToken`);
				localStorage.removeItem(`user_${currentUserId}.Email`);

				// Redirect to login
				navigate('/dev/login');
			} else {
				const data = await logoutResponse.json();
				console.log(data.message);
				setLogoutMessage('Logout failed');
			}
		} catch (error) {
			console.error('Error during logout:', error);
			setLogoutMessage('An error occurred during logout.');
		}
	};

	useEffect(() => {
		handleLogout();
	}, []);

	return (
		<>
			<h1>{logoutMessage}</h1>
		</>
	);
}
