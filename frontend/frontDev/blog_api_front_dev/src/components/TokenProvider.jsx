import React, { createContext, useState, useEffect } from 'react';

export const TokenContext = createContext();

const TokenProvider = ({ children }) => {
	const [accessToken, setAccessToken] = useState(null);
	const [expiryTime, setExpiryTime] = useState(null);

	const initializeToken = (token, expiresInSeconds) => {
		setAccessToken(token);
		const now = new Date();
		setExpiryTime(new Date(now.getTime() + expiresInSeconds * 1000)); // Set expiry time
	};

	const refreshAccessToken = async () => {
		try {
			const refreshToken = localStorage.getItem(
				`user_${sessionStorage.getItem('currentUser')}.RefreshToken`
			);
			const email = localStorage.getItem(
				`user_${sessionStorage.getItem('currentUser')}.Email`
			);

			const response = await fetch(`http://localhost:3000/tokens/refresh`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					refreshToken,
					email,
				}),
			});

			const data = await response.json();

			if (data.accessToken) {
				localStorage.setItem(
					`user_${sessionStorage.getItem('currentUser')}.AccessToken`,
					data.accessToken
				);
				initializeToken(data.accessToken, 600); // Assume 10-minute tokens
			} else {
				console.warn('No access token received in the response'); // Log if no access token
			}

			if (data.refreshToken) {
				localStorage.setItem(
					`user_${sessionStorage.getItem('currentUser')}.RefreshToken`,
					data.refreshToken
				);
			}
		} catch (error) {
			console.error('Error refreshing token:', error); // Log error
		}
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (expiryTime) {
				const now = new Date();
				const timeRemaining = expiryTime - now;

				if (timeRemaining <= 60 * 1000 && timeRemaining > 0) {
					refreshAccessToken();
				}
			}
		}, 60 * 1000); // Check every minute

		return () => clearInterval(interval); // Cleanup
	}, [expiryTime]);

	return (
		<TokenContext.Provider
			value={{
				accessToken,
				initializeToken,
				refreshAccessToken,
				setAccessToken,
			}}
		>
			{children}
		</TokenContext.Provider>
	);
};

export default TokenProvider;
