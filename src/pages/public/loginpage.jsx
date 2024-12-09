import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

export default function LoginPage({ onLogin }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Clear any existing errors
        setError('');

        try {
            await onLogin(formData);
            navigate('/');
        } catch (error) {
            setError('Login failed. Please check your credentials.');
            console.error(error);
        }
    };

    return (
        <div className="page login-page">
            <div className="login-box">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            minLength="6"
                        />
                    </div>

                    <div className="form-options">
                        <div className="remember-me">
                            <input
                                id="remember-me"
                                name="rememberMe"
                                type="checkbox"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="remember-me"> Remember me</label>
                        </div>

                        <a href="/forgot-password" className="forgot-password">
                            Forgot your password?
                        </a>
                    </div>

                    <button type="submit" className="login-button">
                        Sign in
                    </button>

                    <div className="signup-link">
                        <span>Do you not have an account? </span>
                        <a href="/register">Sign up</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

LoginPage.propTypes = {
    onLogin: PropTypes.func.isRequired
};