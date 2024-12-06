const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>Information</h4>
                    <ul>
                        <li><a href="/aboutus">About Us</a></li>
                        <li><a href="/jobs">Jobs</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/recipes">Recipes</a></li>
                        <li><a href="/guide">Brewing Guide</a></li>
                        <li><a href="/community">Community</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Social Media</h4>
                    <div className="social-links">
                        <a href="#" aria-label="Facebook">FB</a>
                        <a href="#" aria-label="Twitter">TW</a>
                        <a href="#" aria-label="Instagram">IG</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {currentYear} Brew Hub. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;