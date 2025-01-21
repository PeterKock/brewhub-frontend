import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import OrderDetailsModal from '../../components/orders/OrderDetailsModal';
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
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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

        void loadDashboardData();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleViewDetails = async (orderId) => {
        try {
            setLoading(true);
            const orderDetails = await orderService.getUserOrder(orderId);
            setSelectedOrderDetails(orderDetails);
            setIsDetailsModalOpen(true);
            setError('');
        } catch (err) {
            setError('Failed to load order details');
            console.error('Error loading order details:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="dashboard-container">
                <div className="loading">Loading dashboard...</div>
            </main>
        );
    }

    return (
        <main className="dashboard-container">
            {error && <div className="error-message">{error}</div>}

            {/* Overview Section */}
            <section className="dashboard-section">
                <div className="welcome-header">
                    <h1>Welcome back {userData.name}!</h1>
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
                    <Link to="/recipes" className="action-button user-recipes-action">
                        <Coffee size={20} />
                        <span>Browse Recipes</span>
                    </Link>
                    <Link to="/guides" className="action-button user-guides-action">
                        <Book size={20} />
                        <span>Brewing Guides</span>
                    </Link>
                    <Link to="/user/orders" className="action-button user-orders-action">
                        <ShoppingCart size={20} />
                        <span>Orders</span>
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
                                    <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                                </div>
                                <div className="order-detail">
                                    <Store size={20} />
                                    <span>{order.retailerName}</span>
                                </div>
                                <div className="order-detail">
                                    <ShoppingCart size={20} />
                                    <span>{order.items?.length || 0} items</span>
                                </div>
                                <div className="order-detail">
                                    <span>€{(order.totalPrice || 0)}</span>
                                </div>
                                <span className={`status-badge user-status-${order.status?.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>
                            <button
                                onClick={() => handleViewDetails(order.id)}
                                className="user-view-order-button"
                            >
                                View Details
                            </button>
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

            <OrderDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                order={selectedOrderDetails}
                role="USER"
            />
        </main>
    );
};

export default UserDashboard;