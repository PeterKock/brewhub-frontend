import { useState } from 'react';
import { Link } from 'react-router-dom';
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
    const [userData] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        location: "Amsterdam, NL",
        totalOrders: 5,
        favoriteRetailers: 3,
        recentOrders: [
            { id: 1, date: "2025-01-05", status: "Delivered", retailer: "Brew Supply Co" },
            { id: 2, date: "2025-01-15", status: "Processing", retailer: "Malt Masters" }
        ]
    });

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
                                    <span>{order.date}</span>
                                </div>
                                <div className="order-detail">
                                    <Store size={20} />
                                    <span>{order.retailer}</span>
                                </div>
                                <span className={`status-badge user-status-${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>
                            <Link
                                to={`/user/orders/${order.id}`}
                                className="user-view-order-button"
                                aria-label={`View details for order from ${order.retailer}`}
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