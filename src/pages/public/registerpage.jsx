import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

export default function RegisterPage({ onRegister }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'customer',
        location: '',
        acceptTerms: false
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

        // Validation
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            setError('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Password validation
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        // Password match validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Location validation for retailers
        if (formData.role === 'retailer' && !formData.location.trim()) {
            setError('Please enter your city');
            return;
        }

        // Terms acceptance validation
        if (!formData.acceptTerms) {
            setError('Please accept the terms and conditions');
            return;
        }

        // Clear any existing errors
        setError('');

        try {
            await onRegister(formData);
            navigate('/');
        } catch (error) {
            setError('Registration failed. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className="page register-page">
            <div className="login-box">
                <div className="login-header">
                    <h2>Create Account</h2>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Enter your first name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Enter your last name"
                        />
                    </div>

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
                            autoComplete="new-password"
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your password"
                            minLength="8"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm your password"
                            minLength="8"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="customer">User</option>
                            <option value="retailer">Business</option>
                        </select>
                    </div>

                    {formData.role === 'retailer' && (
                        <div className="form-group">
                            <label htmlFor="location">Business Location</label>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Enter city"
                                required
                            />
                        </div>
                    )}

                    <div className="form-options">
                        <div className="remember-me">
                            <input
                                id="acceptTerms"
                                name="acceptTerms"
                                type="checkbox"
                                checked={formData.acceptTerms}
                                onChange={handleInputChange}
                                required
                            />
                            <label htmlFor="acceptTerms">
                                I accept the <a href="/terms">terms and conditions</a>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="login-button">
                        Create Account
                    </button>

                    <div className="signup-link">
                        <span>Already have an account? </span>
                        <a href="/login">Sign in</a>
                    </div>
                </form>
            </div>
        </div>
    );
}

RegisterPage.propTypes = {
    onRegister: PropTypes.func.isRequired
};