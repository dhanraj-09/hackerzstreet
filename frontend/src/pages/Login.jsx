import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import greenBg from '../assets/wmremove-transformed.jpeg.jpg';

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const toggleMode = (e) => {
        e.preventDefault();
        setIsSignUp(!isSignUp);
    };

    const handleGoogleSuccess = async (tokenResponse) => {
        const accessToken = tokenResponse.access_token;
        try {
            // Fetch user info from Google
            const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` },
            }).then(res => res.json());

            // Here you would typically:
            // 1. Send this data to your backend
            // 2. Create/Login user in your system
            // 3. Store the token/user data in your app's state
            console.log('Google User Info:', userInfo);

            // For now, let's just log the user in and redirect
            localStorage.setItem('user', JSON.stringify(userInfo));
            navigate('/'); // Redirect to home page
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const handleGoogleError = () => {
        console.error('Google Sign In was unsuccessful.');
    };

    const login = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: handleGoogleError,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle regular email/password login here
        console.log('Regular login submitted');
    };

    return (
        <div className="login-container">
            <div className="login-main">
                <img
                    src={greenBg}
                    alt="Background"
                    className="background-image"
                />
                <div className="background-overlay"></div>
                <div className="login-form-container">
                    <h1 className="login-title">
                        {isSignUp ? 'Create Account' : 'Get started'}
                    </h1>
                    <p className="login-subtitle">
                        {isSignUp ? 'Already have an account?' : 'Create an account?'}{' '}
                        <a href="#" onClick={toggleMode} className="login-link">
                            {isSignUp ? 'Sign in' : 'Sign up'}
                        </a>
                    </p>
                    <form onSubmit={handleSubmit}>
                        {isSignUp && (
                            <div className="form-group">
                                <label className="form-label">Username</label>
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    className="form-input"
                                />
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                className="form-input"
                            />
                        </div>
                        {isSignUp && (
                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm your password"
                                    className="form-input"
                                />
                            </div>
                        )}
                        <div className="divider">
                            <span className="divider-text">or</span>
                        </div>
                        <button
                            type="button"
                            className="google-button"
                            onClick={() => login()}
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="google-icon" />
                            {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
                        </button>
                        <button type="submit" className="submit-button">
                            {isSignUp ? 'Sign Up' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;