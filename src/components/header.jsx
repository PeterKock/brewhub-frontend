import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

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
        const loadMenuItems = async () => {
            if (isAuthenticated === null) {
                return;
            }

            try {
                if (isAuthenticated) {
                    const token = localStorage.getItem('token');
                    const userStr = localStorage.getItem('user');
                    const user = userStr ? JSON.parse(userStr) : null;

                    if (!token || !user) {
                        console.error('Missing auth data');
                        setDefaultMenuItems();
                        return;
                    }

                    const response = await fetch('http://localhost:8080/api/public/navigation', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        console.error('Navigation fetch failed');
                        setFallbackMenuItems();
                        return;
                    }

                    const data = await response.json();
                    if (data?.items) {
                        setMenuItems(data.items);
                    } else {
                        setFallbackMenuItems();
                    }
                } else {
                    setDefaultMenuItems();
                }
            } catch (error) {
                console.error('Error loading menu items:', error);
                setFallbackMenuItems();
            }
        };

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
                if (user.role === 'RETAILER') {
                    setMenuItems([
                        { label: 'Dashboard', path: '/retailer/dashboard' },
                        { label: 'Inventory', path: '/retailer/inventory' },
                        { label: 'Orders', path: '/retailer/orders' },
                        { label: 'Community', path: '/community' }
                    ]);
                } else if (user.role === 'MODERATOR') {
                    setMenuItems([
                        { label: 'Dashboard', path: '/moderator/dashboard' },
                        { label: 'Community', path: '/community' }
                    ]);
                } else {
                    setMenuItems([
                        { label: 'Dashboard', path: '/user/dashboard' },
                        { label: 'Orders', path: '/user/orders' },
                        { label: 'Community', path: '/community' },
                        { label: 'Recipes', path: '/user/recipes' },
                        { label: 'Guides', path: '/user/guides' }
                    ]);
                }
            } catch (error) {
                console.error('Error parsing cached user data:', error);
                setDefaultMenuItems();
            }
        };

        loadMenuItems().catch(error => {
            console.error('Failed to load menu items:', error);
            setDefaultMenuItems();
        });
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
                    {isAuthenticated !== null && (
                        isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="login-link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Sign out
                            </button>
                        ) : (
                            <Link to="/login" className="login-link">Sign in</Link>
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