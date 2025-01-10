import { Link } from 'react-router-dom';
import {
    ShoppingBag,
    CheckSquare,
    Package,
    AlertCircle,
    LayoutGrid,
    ClipboardList,
    Users,
    Settings,
    Calendar,
    Box,
    AlertTriangle,
    BarChart2
} from 'lucide-react';

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
            {
                id: 1,
                name: "Cascade Hops",
                quantity: 5,
                threshold: 10,
                lastRestocked: "2024-01-01"
            },
            {
                id: 2,
                name: "Pilsner Malt",
                quantity: 8,
                threshold: 15,
                lastRestocked: "2024-01-05"
            }
        ]
    };

    return (
        <main className="dashboard-container">
            {/* Overview Section */}
            <section className="dashboard-section">
                <div className="welcome-header">
                    <h1>Welcome back, {retailerData.name}</h1>
                </div>

                <div className="retailer-dashboard-stats-container">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <ShoppingBag size={24} />
                        </div>
                        <div className="stat-content">
                            <h2>Pending Orders</h2>
                            <p>{retailerData.pendingOrders}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <CheckSquare size={24} />
                        </div>
                        <div className="stat-content">
                            <h2>Completed Orders</h2>
                            <p>{retailerData.completedOrders}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <Package size={24} />
                        </div>
                        <div className="stat-content">
                            <h2>Total Products</h2>
                            <p>{retailerData.totalProducts}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <AlertCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <h2>Low Stock Alerts</h2>
                            <p className={retailerData.lowStock > 0 ? 'alert' : ''}>
                                {retailerData.lowStock}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="dashboard-section">
                <h2 className="section-title">Quick Actions</h2>
                <div className="action-buttons">
                    <Link to="/retailer/customers" className="action-button retailer-customers-action">
                        <Users size={20} />
                        <span>Customer List</span>
                    </Link>
                    <Link to="/retailer/orders" className="action-button retailer-orders-action">
                        <ClipboardList size={20} />
                        <span>View Orders</span>
                    </Link>

                    <Link to="/retailer/inventory" className="action-button retailer-inventory-action">
                        <LayoutGrid size={20} />
                        <span>Manage Inventory</span>
                    </Link>
                    <Link to="/retailer/profile" className="action-button retailer-profile-action">
                        <Settings size={20} />
                        <span>Store Settings</span>
                    </Link>
                </div>
            </section>

            {/* Recent Orders */}
            <section className="dashboard-section">
                <h2 className="section-title">Recent Orders</h2>
                <div className="orders-list">
                    {retailerData.recentOrders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-info">
                                <div className="order-detail">
                                    <Calendar size={20} />
                                    <span>{order.date}</span>
                                </div>
                                <div className="order-detail">
                                    <Users size={20} />
                                    <span>{order.customer}</span>
                                </div>
                                <div className="order-detail">
                                    <Package size={20} />
                                    <span>{order.items}</span>
                                </div>
                                <div className="order-detail">
                                    <ShoppingBag size={20} />
                                    <span>{order.total}</span>
                                </div>
                                <span className={`status-badge retailer-status-${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="retailer-order-actions">
                                <Link
                                    to={`/retailer/orders/${order.id}`}
                                    className="retailer-view-details-button"
                                >
                                    View Details
                                </Link>
                                <button className="retailer-process-button">
                                    Process Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Low Stock Alerts */}
            <section className="dashboard-section">
                <h2 className="section-title">Low Stock Alerts</h2>
                <div className="orders-list">
                    {retailerData.lowStockItems.map(item => (
                        <div key={item.id} className="order-card">
                            <div className="order-info">
                                <div className="order-detail">
                                    <Box size={20} />
                                    <span>{item.name}</span>
                                </div>
                                <div className="order-detail">
                                    <BarChart2 size={20} />
                                    <span>{item.quantity} units</span>
                                </div>
                                <div className="order-detail">
                                    <AlertTriangle size={20} />
                                    <span>Threshold: {item.threshold}</span>
                                </div>
                                <div className="order-detail">
                                    <Calendar size={20} />
                                    <span>Last Restocked: {item.lastRestocked}</span>
                                </div>
                                <span className="status-badge retailer-status-pending">
                                    Low Stock
                                </span>
                            </div>
                            <div className="retailer-order-actions">
                                <Link
                                    to={`/retailer/inventory/edit/${item.id}`}
                                    className="retailer-restock-button"
                                >
                                    Restock Now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default RetailerDashboard;