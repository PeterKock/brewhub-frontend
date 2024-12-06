import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo-container">
                    <img src="src/assets/logo.png" alt="Logo" className="logo" />
                </div>

                <h1 className="brand-name">Brew Hub</h1>

                <div className="menu-container">
                    <button className="hamburger-button" onClick={toggleMenu}>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>

                    <div className={`menu-dropdown ${isMenuOpen ? 'open' : ''}`}>
                        <Link to="/loginpage" className="login-link">Login</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;