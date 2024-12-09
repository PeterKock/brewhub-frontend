import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Header = ({ isAuthenticated, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    const handleMenuItemClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo-container">
                    <Link to="/">
                        <img src="/src/assets/logo.png" alt="Logo" className="logo" />
                    </Link>
                </div>
                <Link to="/">
                    <h1 className="brand-name">Brew Hub</h1>
                </Link>
                <nav className="menu-container" role="navigation">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="login-link"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="login-link">Login</Link>
                    )}
                    <button className="hamburger-button" onClick={toggleMenu}>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>

                    <div className={`menu-dropdown ${isMenuOpen ? 'open' : ''}`}>
                        <Link to="/user/recipes" className="UserRecipes" onClick={handleMenuItemClick}>Recipes</Link>
                        <Link to="/user/guides" className="UserGuides" onClick={handleMenuItemClick}>Guides</Link>
                        <Link to="/user/community" className="UserCommunity" onClick={handleMenuItemClick}>Community</Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};

Header.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired
};

export default Header;