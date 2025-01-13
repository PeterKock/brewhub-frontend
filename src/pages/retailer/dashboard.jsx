import { useState, useEffect } from 'react';
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
import { inventoryService } from '../../services/inventoryService';

const RetailerDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        name: "Brew Supply Co",
        pendingOrders: 3,
        completedOrders: 12,
        totalProducts: 45,
        lowStock: 0
    });

    const [recentOrders] = useState([
        {
            id: 1,
            date: "2025-01-15",
            status: "Pending",
            customer: "John Doe",
            items: "Barley, Hops",
            total: "€75.00"
        },
        {
            id: 2,
            date: "2025-01-14",
            status: "Processing",
            customer: "Jane Smith",
            items: "Yeast, Malt",
            total: "€45.50"
        }
    ]);

    const [lowStockItems, setLowStockItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadLowStockItems = async () => {
            try {
                const items = await inventoryService.getLowStockItems();
                setLowStockItems(items);
                setDashboardData(prevData => ({
                    ...prevData,
                    lowStock: items.length
                }));
                setError(null);
            } catch (err) {
                console.error('Failed to load low stock items:', err);
                setError('Failed to load low stock items');
            } finally {
                setLoading(false);
            }
        };

        loadLowStockItems().catch(err => {
            console.error('Error in loadLowStockItems:', err);
            setError('Failed to load low stock items');
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <main className="dashboard-container">
            {error && <div className="error-message">{error}</div>}

            {/* Overview Section */}
            <section className="dashboard-section">
                <div className="welcome-header">
                    <h1>Welcome back, {dashboardData.name}</h1>
                </div>

                <div className="retailer-dashboard-stats-container">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <ShoppingBag size={24} />
                        </div>
                        <div className="stat-content">
                            <h2>Pending Orders</h2>
                            <p>{dashboardData.pendingOrders}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <CheckSquare size={24} />
                        </div>
                        <div className="stat-content">
                            <h2>Completed Orders</h2>
                            <p>{dashboardData.completedOrders}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <Package size={24} />
                        </div>
                        <div className="stat-content">
                            <h2>Total Products</h2>
                            <p>{dashboardData.totalProducts}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">
                            <AlertCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <h2>Low Stock Alerts</h2>
                            <p className={dashboardData.lowStock > 0 ? 'alert' : ''}>
                                {dashboardData.lowStock}
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
                <div className="dashboard-list">
                    {recentOrders.map(order => (
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
                <div className="dashboard-list">
                    {lowStockItems.length > 0 ? (
                        lowStockItems.map(item => (
                            <div key={item.id} className="order-card">
                                <div className="order-info">
                                    <div className="order-detail">
                                        <Box size={20} />
                                        <span>{item.name}</span>
                                    </div>
                                    <div className="order-detail">
                                        <BarChart2 size={20} />
                                        <span>{Number(item.quantity).toFixed(2)} {item.unit}</span>
                                    </div>
                                    <div className="order-detail">
                                        <AlertTriangle size={20} />
                                        <span>Threshold: {Number(item.lowStockThreshold).toFixed(2)} {item.unit}</span>
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
                        ))
                    ) : (
                        <div className="no-results">No low stock items</div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default RetailerDashboard;