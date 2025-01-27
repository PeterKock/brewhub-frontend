import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './styles/header.css';

const Header = ({ isAuthenticated, onLogout }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const loadMenuItems = () => {
            const setDefaultMenuItems = () => {
                setMenuItems([
                    { label: 'Recipes', path: '/recipes' },
                    { label: 'Guides', path: '/guides' }
                ]);
            };

            const setFallbackMenuItems = () => {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    setDefaultMenuItems();
                    return;
                }

                try {
                    const user = JSON.parse(userStr);
                    if (user.role === 'USER') {
                        setMenuItems([
                            { label: 'Dashboard', path: '/user/dashboard' },
                            { label: 'Orders', path: '/user/orders' },
                            { label: 'Community', path: '/community' },
                            { label: 'Recipes', path: '/recipes' },
                            { label: 'Guides', path: '/guides' }
                        ]);
                    } else if (user.role === 'RETAILER') {
                        setMenuItems([
                            { label: 'Dashboard', path: '/retailer/dashboard' },
                            { label: 'Inventory', path: '/inventory' },
                            { label: 'Orders', path: '/retailer/orders' },
                            { label: 'Community', path: '/community' },
                            { label: 'Recipes', path: '/recipes' },
                            { label: 'Guides', path: '/guides' }
                        ]);
                    } else if (user.role === 'MODERATOR') {
                        setMenuItems([
                            { label: 'Dashboard', path: '/moderator/dashboard' },
                            { label: 'Community', path: '/community' },
                            { label: 'Recipes', path: '/recipes' },
                            { label: 'Guides', path: '/guides' }
                        ]);
                    } else {
                        setDefaultMenuItems();
                    }
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    setDefaultMenuItems();
                }
            };

            if (!isAuthenticated) {
                setDefaultMenuItems();
            } else {
                setFallbackMenuItems();
            }
        };

        loadMenuItems();
    }, [isAuthenticated]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        setIsMenuOpen(false);
        onLogout();
    };

    const handleMenuItemClick = () => {
        setIsMenuOpen(false);
    };

    if (menuItems.length === 0) {
        return null;
    }

    return (
        <header className="header">
            <div className="header-content">
                <div className="center-container">
                    <Link to="/">
                        <h1 className="brand-name">Brew Hub</h1>
                    </Link>
                    <div className="logo-container">
                        <Link to="/">
                            <img src="/src/assets/logo.png" alt="Logo" className="logo" />
                        </Link>
                    </div>
                </div>
                <nav className="menu-container" ref={menuRef} role="navigation">
                    {isAuthenticated !== null && (
                        isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="login-link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" className="login-link">Login</Link>
                        )
                    )}
                    <button
                        className="hamburger-button"
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-label="Menu"
                    >
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>

                    <div className={`menu-dropdown ${isMenuOpen ? 'open' : ''}`}>
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                onClick={handleMenuItemClick}
                            >
                                {item.label}
                            </Link>
                        ))}
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