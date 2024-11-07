import React, { useEffect, useState } from 'react';

export default function Logout() {
	const [logoutMessage, setLogoutMessage] = useState('Logging user out...');

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
				sessionStorage.removeItem('currentUser');
				localStorage.removeItem(`user_${currentUserId}.AccessToken`);
				localStorage.removeItem(`user_${currentUserId}.RefreshToken`);
				localStorage.removeItem(`user_${currentUserId}.Email`);
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
