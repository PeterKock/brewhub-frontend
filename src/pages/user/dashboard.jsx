import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import {
    ShoppingCart,
    Book,
    Heart,
    Coffee,
    Mail,
    MapPin,
    Calendar,
    Store
} from 'lucide-react';

const UserDashboard = () => {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        location: "",
        totalOrders: 0,
        favoriteRetailers: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadDashboardData = async () => {
            if (!isMounted) return;

            try {
                setLoading(true);
                setError(null);

                // Fetch dashboard data
                const [stats, recentOrders] = await Promise.all([
                    orderService.getUserDashboardStats(),
                    orderService.getUserRecentOrders()
                ]);

                if (!isMounted) return;

                // Get user info from localStorage
                const user = JSON.parse(localStorage.getItem('user')) || {};

                setUserData({
                    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Guest',
                    email: user.email || 'No email provided',
                    location: user.location || 'Location not set',
                    totalOrders: stats.totalOrders || 0,
                    favoriteRetailers: stats.favoriteRetailers || 0,
                    recentOrders: recentOrders || []
                });
            } catch (err) {
                if (!isMounted) return;
                console.error('Failed to load dashboard data:', err);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        void loadDashboardData(); // Use void operator to explicitly ignore the promise
        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <main className="dashboard-container">
                <div className="loading">Loading dashboard...</div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="dashboard-container">
                <div className="error-message">{error}</div>
            </main>
        );
    }

    return (
        <main className="dashboard-container">
            {/* Overview Section */}
            <section className="dashboard-section">
                <div className="welcome-header">
                    <h1>Welcome back, {userData.name}</h1>
                </div>

                <div className="user-dashboard-stats-container">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <ShoppingCart size={24}/>
                        </div>
                        <div className="stat-content">
                            <h2>Total Orders</h2>
                            <p>{userData.totalOrders}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <Store size={24}/>
                        </div>
                        <div className="stat-content">
                            <h2>Favorite Retailers</h2>
                            <p>{userData.favoriteRetailers}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="dashboard-section">
                <h2 className="section-title">Quick Actions</h2>
                <div className="action-buttons">
                    <Link to="/user/recipes" className="action-button user-recipes-action">
                        <Coffee size={20} />
                        <span>Browse Recipes</span>
                    </Link>
                    <Link to="/user/guides" className="action-button user-guides-action">
                        <Book size={20} />
                        <span>Brewing Guides</span>
                    </Link>
                    <Link to="/user/orders" className="action-button user-orders-action">
                        <ShoppingCart size={20} />
                        <span>New Order</span>
                    </Link>
                    <Link to="/user/favorites" className="action-button user-favorites-action">
                        <Heart size={20} />
                        <span>Favorites</span>
                    </Link>
                </div>
            </section>

            {/* Recent Orders */}
            <section className="dashboard-section">
                <h2 className="section-title">Recent Orders</h2>
                <div className="dashboard-list">
                    {userData.recentOrders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-info">
                                <div className="order-detail">
                                    <Calendar size={20} />
                                    {/*<span>{new Date(order.date).toLocaleDateString()}</span>*/}
                                </div>
                                <div className="order-detail">
                                    <Store size={20} />
                                    <span>{order.retailerName || 'Unknown Retailer'}</span>
                                </div>
                                <span className={`status-badge user-status-${order.status?.toLowerCase()}`}>
                                    {order.status || 'Unknown Status'}
                                </span>
                            </div>
                            <Link
                                to={`/user/orders/${order.id}`}
                                className="user-view-order-button"
                                aria-label={`View details for order from ${order.retailerName || 'Unknown Retailer'}`}
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Profile Summary */}
            <section className="dashboard-section">
                <h2 className="section-title">Profile Summary</h2>
                <div className="user-profile-card">
                    <div className="user-profile-info">
                        <div className="user-profile-detail">
                            <Mail size={20} />
                            <span>{userData.email}</span>
                        </div>
                        <div className="user-profile-detail">
                            <MapPin size={20} />
                            <span>{userData.location}</span>
                        </div>
                    </div>
                    <Link
                        to="/user/profile"
                        className="user-edit-profile-button"
                        aria-label="Edit your profile"
                    >
                        Edit Profile
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default UserDashboard;