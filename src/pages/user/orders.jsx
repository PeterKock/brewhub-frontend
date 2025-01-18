import { useState, useEffect } from 'react';
import { SearchBar } from '../../components/shared/SearchBar';
import CreateOrderModal from '../../components/orders/CreateOrderModal';
import RetailerSelectModal from '../../components/orders/RetailerSelectModal.jsx'
import { orderService } from '../../services/orderService';
import OrderDetailsModal from '../../components/orders/OrderDetailsModal';
import {
    Calendar,
    Store,
    ShoppingCart,
    Plus
} from 'lucide-react';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRetailerId, setSelectedRetailerId] = useState(null);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const data = await orderService.getUserOrders();
            setOrders(data);
            setError('');
        } catch (err) {
            setError('Failed to load orders');
            console.error('Error loading orders:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const fetchOrders = async () => {
            if (!isMounted) return;

            try {
                setIsLoading(true);
                const data = await orderService.getUserOrders();
                if (isMounted) {
                    setOrders(data);
                    setError('');
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load orders');
                    console.error('Error loading orders:', err);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchOrders();  // Use void operator to explicitly ignore the promise

        return () => {
            isMounted = false;
        };
    }, []);

    const handleCreateOrder = async (orderData) => {
        try {
            await orderService.createOrder(orderData);
            await loadOrders(); // Refresh orders list
            setIsModalOpen(false);
            // You might want to add a success message here
        } catch (err) {
            setError('Failed to create order');
            console.error('Error creating order:', err);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await orderService.cancelOrder(orderId);
                await loadOrders(); // Refresh orders list
                // You might want to add a success message here
            } catch (err) {
                setError('Failed to cancel order');
                console.error('Error cancelling order:', err);
            }
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.retailerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const [isRetailerModalOpen, setIsRetailerModalOpen] = useState(false);

    const handleRetailerSelect = (retailer) => {
        setSelectedRetailerId(retailer.id);
        setIsRetailerModalOpen(false);
        setIsModalOpen(true);
    };

    const handleViewDetails = async (orderId) => {
        try {
            setIsLoading(true);
            const orderDetails = await orderService.getUserOrder(orderId);
            setSelectedOrderDetails(orderDetails);
            setIsDetailsModalOpen(true);
            setError('');
        } catch (err) {
            setError('Failed to load order details');
            console.error('Error loading order details:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <main className="dashboard-container">
                <section className="dashboard-section">
                    <div className="loading">Loading orders...</div>
                </section>
            </main>
        );
    }

    return (
        <div className="main-section">
            <main className="dashboard-order-container">
                <section className="dashboard-order-section">
                    <h2 className="section-title">My Orders</h2>

                    {error && <div className="error-message">{error}</div>}

                    <div className="order-filter-bar">
                        <SearchBar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            placeholder="Search orders..."
                        />
                        <select
                            className="filter-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        <button
                            className="filter-select inventory-add-button"
                            onClick={() => setIsRetailerModalOpen(true)}
                        >
                            <Plus size={20}/>
                            New Order
                        </button>
                    </div>

                    <div className="orders-list">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map(order => (
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
                                            <span>€{order.totalPrice}</span>
                                        </div>
                                        <span className={`status-badge user-status-${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                    </div>
                                    <div className="order-actions">
                                        <button
                                            className="view-details-button"
                                            onClick={() => handleViewDetails(order.id)}
                                        >
                                            View Details
                                        </button>
                                        {order.status === 'PENDING' && (
                                            <button
                                                className="cancel-button"
                                                onClick={() => handleCancelOrder(order.id)}
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                {searchTerm || filterStatus !== 'ALL'
                                    ? 'No orders match your search criteria'
                                    : 'You haven\'t placed any orders yet'
                                }
                            </div>
                        )}
                    </div>
                </section>

                <OrderDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    order={selectedOrderDetails}
                    role="USER"
                />

                <RetailerSelectModal
                    isOpen={isRetailerModalOpen}
                    onClose={() => setIsRetailerModalOpen(false)}
                    onSelect={handleRetailerSelect}
                />

                <CreateOrderModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateOrder}
                    retailerId={selectedRetailerId}
                />
            </main>
        </div>
    );
};

export default UserOrders;