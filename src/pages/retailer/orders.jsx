import { useState, useEffect } from 'react';
import OrderCard from '../../components/shared/OrderCard';
import { SearchBar } from '../../components/shared/SearchBar';

const RetailerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    // Mock data - replace with actual API call
    useEffect(() => {
        setOrders([
            {
                id: 1,
                date: "2024-01-15",
                customerName: "John Doe",
                beerType: "IPA",
                status: "PENDING",
                totalPrice: 75.00
            },
            {
                id: 2,
                date: "2024-01-14",
                customerName: "Jane Smith",
                beerType: "Stout",
                status: "PROCESSING",
                totalPrice: 45.50
            },
            {
                id: 3,
                date: "2024-01-10",
                customerName: "Mike Johnson",
                beerType: "Pale Ale",
                status: "COMPLETED",
                totalPrice: 62.25
            }
        ]);
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        // Add API call here
        console.log('Changing order status:', orderId, newStatus);
    };

    const handleCancelOrder = async (orderId) => {
        // Add API call here
        console.log('Cancelling order:', orderId);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.beerType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
                <main className="dashboard-container">
                    <section className="dashboard-section">
                        <h2 className="section-title">Manage Orders</h2>

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
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        <div className="orders-list">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        role="RETAILER"
                                        onStatusChange={handleStatusChange}
                                        onCancel={handleCancelOrder}
                                    />
                                ))
                            ) : (
                                <div className="no-results">No orders found</div>
                            )}
                </div>
            </section>
        </main>
    );
};

export default RetailerOrders;