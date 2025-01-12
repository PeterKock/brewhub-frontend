import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Header = ({ isAuthenticated, onLogout }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

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
        if (isAuthenticated) {
            fetch('http://localhost:8080/api/public/navigation', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Navigation data:', data);
                    setMenuItems(data.items || []);
                })
                .catch(error => {
                    console.error('Error fetching navigation:', error);
                    setMenuItems([
                        { label: 'Dashboard', path: '/user/dashboard' },
                        { label: 'Community', path: '/user/community' },
                        { label: 'Recipes', path: '/user/recipes' },
                        { label: 'Guides', path: '/user/guides' }
                    ]);
                });
        } else {
            // Set default menu items for non-authenticated users
            setMenuItems([
                { label: 'Community', path: '/user/community' },
                { label: 'Recipes', path: '/user/recipes' },
                { label: 'Guides', path: '/user/guides' }
            ]);
        }
    }, [isAuthenticated]);

    const toggleMenu = () => {
        console.log('Menu toggled, isMenuOpen before:', isMenuOpen);
        console.log('Current menuItems:', menuItems);
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
                <nav className="menu-container" ref={menuRef} role="navigation">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="login-link"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            Sign out
                        </button>
                    ) : (
                        <Link to="/login" className="login-link">Sign in</Link>
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