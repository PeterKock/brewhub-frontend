import { useState } from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    // State declaration with initial mock data
    const [userData] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        location: "Amsterdam, NL",
        totalOrders: 5,
        favoriteRetailers: 3,
        recentOrders: [
            { id: 1, date: "2024-01-05", status: "Delivered", retailer: "Brew Supply Co" },
            { id: 2, date: "2024-01-15", status: "Processing", retailer: "Malt Masters" }
        ]
    });

    //Overview Section
    return (
        <div className="dashboard-container">
            {/* Overview Section */}
            <section className="dashboard-section overview">
                <div className="welcome-header">
                    <h2>Welcome back, {userData.name}</h2>
                </div>

                <div className="stats-container">
                    <div className="stat-card">
                        <h3>Total Orders</h3>
                        <p>{userData.totalOrders}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Favorite Retailers</h3>
                        <p>{userData.favoriteRetailers}</p>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="dashboard-section quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                    <Link to="/user/recipes" className="action-button">
                        Browse Recipes
                    </Link>
                    <Link to="/user/orders" className="action-button">
                        New Order
                    </Link>
                    <Link to="/user/guides" className="action-button">
                        Brewing Guides
                    </Link>
                    <Link to="/user/favorites" className="action-button">
                        Favorites
                    </Link>
                </div>
            </section>

            {/* Recent Orders */}
            <section className="dashboard-section recent-orders">
                <h3>Recent Orders</h3>
                <div className="orders-list">
                    {userData.recentOrders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-info">
                                <p className="order-date">{order.date}</p>
                                <p className="order-retailer">{order.retailer}</p>
                                <span className={`order-status status-${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>
                            <Link to={`/user/orders/${order.id}`} className="view-order-button">
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Profile Summary */}
            <section className="dashboard-section profile-summary">
                <h3>Profile Summary</h3>
                <div className="profile-card">
                    <div className="profile-info">
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Location:</strong> {userData.location}</p>
                    </div>
                    <Link to="/user/profile" className="edit-profile-button">
                        Edit Profile
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default UserDashboard;