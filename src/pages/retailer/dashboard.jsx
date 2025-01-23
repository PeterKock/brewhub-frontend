import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryService } from '../../services/inventoryService';
import { orderService } from '../../services/orderService';
import OrderDetailsModal from '../../components/orders/OrderDetailsModal';
import './styles/dashboard.css'
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
    const [dashboardData, setDashboardData] = useState({
        name: "",
        pendingOrders: 0,
        completedOrders: 0,
        shippedOrders: 0,
        lowStock: 0
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
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

                // Fetch user information from localStorage
                const user = JSON.parse(localStorage.getItem('user')) || {};
                const userName = user.firstName || 'Retailer';

                // Fetch all data concurrently
                const [stats, recentOrdersData, lowStockData] = await Promise.all([
                    orderService.getRetailerDashboardStats(),
                    orderService.getRetailerRecentOrders(),
                    inventoryService.getLowStockItems()
                ]);

                if (!isMounted) return;

                setDashboardData({
                    name: userName,
                    pendingOrders: stats.pendingOrders || 0,
                    completedOrders: stats.completedOrders || 0,
                    shippedOrders: stats.shippedOrders || 0,
                    lowStock: lowStockData?.length || 0
                });
                setRecentOrders(recentOrdersData || []);
                setLowStockItems(lowStockData || []);
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
            const orderDetails = await orderService.getRetailerOrder(orderId);
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
                    <h1>Welcome back {dashboardData.name}!</h1>
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
                            <Package size={24} />
                        </div>
                        <div className="stat-content">
                            <h2>Shipped Orders</h2>
                            <p>{dashboardData.shippedOrders}</p>
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
                            <AlertCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <h2>Stock Alerts</h2>
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
                    <Link to="/inventory" className="action-button retailer-inventory-action">
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
                                    <span>{new Date(order.orderDate).toLocaleDateString()}</span>
                                </div>
                                <div className="order-detail">
                                    <Users size={20} />
                                    <span>{order.customerName || 'Unknown Customer'}</span>
                                </div>
                                <div className="order-detail">
                                    <Package size={20} />
                                    <span>{order.items?.length || 0} items</span>
                                </div>
                                <div className="order-detail">
                                    <span>€{(order.totalPrice || 0)}</span>
                                </div>
                                <span className={`status-badge retailer-status-${order.status?.toLowerCase()}`}>
                        {order.status || 'Unknown Status'}
                    </span>
                            </div>
                            <div className="retailer-order-actions">
                                <button
                                    onClick={() => handleViewDetails(order.id)}
                                    className="retailer-view-details-button"
                                >
                                    View Details
                                </button>
                                {order.status === 'PENDING' && (
                                    <button
                                        className="retailer-process-button"
                                        onClick={async () => {
                                            try {
                                                await orderService.updateOrderStatus(order.id, 'PROCESSING');
                                                // Reload dashboard data after status update
                                                const [stats, recentOrdersData] = await Promise.all([
                                                    orderService.getRetailerDashboardStats(),
                                                    orderService.getRetailerRecentOrders()
                                                ]);
                                                setDashboardData({
                                                    ...dashboardData,
                                                    pendingOrders: stats.pendingOrders || 0,
                                                    completedOrders: stats.completedOrders || 0
                                                });
                                                setRecentOrders(recentOrdersData || []);
                                                setError(null);
                                            } catch (err) {
                                                console.error('Error processing order:', err);
                                                setError('Failed to process order');
                                            }
                                        }}
                                    >
                                        Process Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Low Stock Alerts */}
            <section className="dashboard-section">
                <h2 className="section-title">Stock Alerts</h2>
                <div className="dashboard-list">
                    {lowStockItems.length > 0 ? (
                        lowStockItems.map(item => (
                            <div key={item.id} className="order-card">
                                <div className="order-info">
                                    <div className="order-detail">
                                        <Box size={20} />
                                        <span>{item.name || 'Unknown Item'}</span>
                                    </div>
                                    <div className="order-detail">
                                        <BarChart2 size={20} />
                                        <span>{Number(item.quantity || 0).toFixed(2)} {item.unit || 'units'}</span>
                                    </div>
                                    <div className="order-detail">
                                        <AlertTriangle size={20} />
                                        <span>Threshold: {Number(item.lowStockThreshold || 0).toFixed(2)} {item.unit || 'units'}</span>
                                    </div>
                                    {item.quantity === 0 ? (
                                        <span className="out-of-stock-badge">
                                <AlertTriangle size={16} />
                                Out of Stock
                            </span>
                                    ) : (
                                        <span className="low-stock-badge">
                                <AlertTriangle size={16} />
                                Low Stock
                            </span>
                                    )}
                                </div>
                                <div className="retailer-order-actions">
                                    <Link
                                        to="/inventory"
                                        state={{ editItemId: item.id }}
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

            <OrderDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                order={selectedOrderDetails}
                role="RETAILER"
            />
        </main>
    );
};

export default RetailerDashboard;