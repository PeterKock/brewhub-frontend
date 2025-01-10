import { Link } from 'react-router-dom';

const RetailerDashboard = () => {
    const retailerData = {
        name: "Brew Supply Co",
        pendingOrders: 3,
        completedOrders: 12,
        totalProducts: 45,
        lowStock: 5,
        recentOrders: [
            {
                id: 1,
                date: "2024-01-15",
                status: "Pending",
                customer: "John Doe",
                items: "Barley, Hops",
                total: "€75.00"
            },
            {
                id: 2,
                date: "2024-01-14",
                status: "Processing",
                customer: "Jane Smith",
                items: "Yeast, Malt",
                total: "€45.50"
            }
        ],
        lowStockItems: [
            { id: 1, name: "Cascade Hops", quantity: 5, threshold: 10 },
            { id: 2, name: "Pilsner Malt", quantity: 8, threshold: 15 }
        ]
    };

    return (
        <div className="retailer-dashboard-container">
            {/* Overview Section */}
            <section className="retailer-dashboard-section overview">
                <div className="welcome-header">
                    <h2>Welcome back, {retailerData.name}</h2>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Pending Orders</h3>
                        <p>{retailerData.pendingOrders}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Completed Orders</h3>
                        <p>{retailerData.completedOrders}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Products</h3>
                        <p>{retailerData.totalProducts}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Low Stock Alerts</h3>
                        <p className={retailerData.lowStock > 0 ? 'alert' : ''}>
                            {retailerData.lowStock}
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="dashboard-section">
                <h3>Quick Actions</h3>
                <div className="quick-actions-grid">
                    <Link to="/retailer/inventory" className="action-button">
                        Manage Inventory
                    </Link>
                    <Link to="/retailer/orders" className="action-button">
                        View Orders
                    </Link>
                    <Link to="/retailer/customers" className="action-button">
                        Customer List
                    </Link>
                    <Link to="/retailer/profile" className="action-button">
                        Store Settings
                    </Link>
                </div>
            </section>

            {/* Recent Orders */}
            <section className="dashboard-section">
                <h3>Recent Orders</h3>
                <div className="orders-list">
                    {retailerData.recentOrders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-info">
                                <div className="order-details">
                                    <p className="order-date">{order.date}</p>
                                    <p className="order-customer">{order.customer}</p>
                                    <p className="order-items">{order.items}</p>
                                    <p className="order-total">{order.total}</p>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                            <div className="order-actions">
                                <Link
                                    to={`/retailer/orders/${order.id}`}
                                    className="view-details-button"
                                >
                                    View Details
                                </Link>
                                <button className="process-button">
                                    Process Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Low Stock Alerts */}
            <section className="dashboard-section">
                <h3>Low Stock Alerts</h3>
                <div className="low-stock-grid">
                    {retailerData.lowStockItems.map(item => (
                        <div key={item.id} className="low-stock-card">
                            <div className="stock-info">
                                <h4>{item.name}</h4>
                                <p>Quantity: {item.quantity}</p>
                                <p>Threshold: {item.threshold}</p>
                            </div>
                            <Link
                                to={`/retailer/inventory/edit/${item.id}`}
                                className="restock-button"
                            >
                                Restock
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default RetailerDashboard;