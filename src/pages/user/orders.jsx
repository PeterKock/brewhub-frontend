import { useState, useEffect } from 'react';
import OrderCard from '../../components/shared/OrderCard';
import { SearchBar } from '../../components/shared/SearchBar';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    // Mock data - replace with actual API call
    useEffect(() => {
        setOrders([
            {
                id: 1,
                date: "2025-01-15",
                retailerName: "Brew Supply Co",
                beerType: "IPA",
                status: "PENDING",
                totalPrice: 75.00
            },
            {
                id: 2,
                date: "2025-01-14",
                retailerName: "Malt Masters",
                beerType: "Stout",
                status: "PROCESSING",
                totalPrice: 45.50
            }
        ]);
    }, []);

    const handleCancelOrder = async (orderId) => {
        // Add API call here
        console.log('Cancelling order:', orderId);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.retailerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.beerType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <main className="dashboard-order-container">
            <section className="dashboard-order-section">
                <h2 className="section-title">My Orders</h2>

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
                                role="USER"
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

export default UserOrders;