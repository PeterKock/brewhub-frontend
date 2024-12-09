import { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerGuides from "../pages/customer/guides.jsx";
import CustomerRecipes from "../pages/customer/recipes.jsx";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo-container">
                    <Link to="/">
                        <img src="src/assets/logo.png" alt="Logo" className="logo" />
                    </Link>
                </div>
                    <Link to="/">
                        <h1 className="brand-name">Brew Hub</h1>
                    </Link>
                <div className="menu-container">
                    <Link to="/login" className="login-link">Login</Link>
                    <button className="hamburger-button" onClick={toggleMenu}>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>

                    <div className={`menu-dropdown ${isMenuOpen ? 'open' : ''}`}>
                        <Link to="/customer/recipes" className="CustomerRecipes">Recipes</Link>
                        <Link to="/customer/guides" className="CustomerGuides">Guides</Link>
                        <Link to="/community" className="community">Community</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;