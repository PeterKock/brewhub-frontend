import { useState, useEffect } from 'react';
import OrderCard from '../../components/shared/OrderCard';
import { SearchBar } from '../../components/shared/SearchBar';
import { orderService } from '../../services/orderService';
import OrderDetailsModal from '../../components/orders/OrderDetailsModal';

const RetailerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const data = await orderService.getRetailerOrders();
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
                const data = await orderService.getRetailerOrders();
                if (isMounted) {
                    setOrders(data);
                    setError('');
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Error loading orders:', err);
                    setError('Failed to load orders. Please try again later.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchOrders();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            await loadOrders(); // Refresh the orders list
        } catch (err) {
            setError('Failed to update order status');
            console.error('Error updating order status:', err);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await orderService.updateOrderStatus(orderId, 'CANCELLED');
                await loadOrders(); // Refresh the orders list
            } catch (err) {
                setError('Failed to cancel order');
                console.error('Error cancelling order:', err);
            }
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.category && order.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.name && order.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleViewDetails = async (orderId) => {
        try {
            setIsLoading(true);
            const orderDetails = await orderService.getRetailerOrder(orderId);
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

    return (
        <div className="main-section">
            <main className="dashboard-order-container">
                <section className="dashboard-order-section">
                    <h2 className="section-title">Manage Orders</h2>

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
                    </div>

                    {isLoading ? (
                        <div className="loading">Loading orders...</div>
                    ) : (
                        <div className="orders-list">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        role="RETAILER"
                                        onStatusChange={handleStatusChange}
                                        onCancel={handleCancelOrder}
                                        onViewDetails={() => handleViewDetails(order.id)}
                                    />
                                ))
                            ) : (
                                <div className="no-results">
                                    {searchTerm || filterStatus !== 'ALL'
                                        ? 'No orders match your search criteria'
                                        : 'No orders received yet'
                                    }
                                </div>
                            )}
                        </div>
                    )}
                </section>

                <OrderDetailsModal
                    isOpen={isDetailsModalOpen}
                    onClose={() => setIsDetailsModalOpen(false)}
                    order={selectedOrderDetails}
                    role="RETAILER"
                />
            </main>
        </div>
    );
};

export default RetailerOrders;