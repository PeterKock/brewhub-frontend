import PropTypes from 'prop-types';
import { useState } from 'react';
import OrderDetailsModal from '../orders/OrderDetailsModal';
import { Calendar, Package, User, Store, DollarSign } from 'lucide-react';

const OrderCard = ({ order, role, onStatusChange, onCancel }) => {
    const canCancel = role === 'USER'
        ? order.status === 'PENDING'
        : order.status === 'PENDING';

    const getStatusClass = (status) => {
        const classes = {
            PENDING: 'user-status-pending',
            PROCESSING: 'user-status-processing',
            SHIPPED: 'user-status-shipped',
            DELIVERED: 'user-status-delivered',
            CANCELLED: 'user-status-cancelled'
        };
        return `status-badge ${classes[status]}`;
    };

    const formattedDate = new Date(order.orderDate).toLocaleDateString();
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    return (
        <div className="order-card">
            <div className="order-info">
                <div className="order-detail">
                    <Calendar size={20} />
                    <span>{formattedDate}</span>
                </div>
                {role === 'USER' ? (
                    <div className="order-detail">
                        <Store size={20} />
                        <span>{order.retailerName}</span>
                    </div>
                ) : (
                    <div className="order-detail">
                        <User size={20} />
                        <span>{order.customerName}</span>
                    </div>
                )}
                <div className="order-detail">
                    <Package size={20} />
                    <span>{order.items?.length || 0} items</span>
                </div>
                <div className="order-detail">
                    <DollarSign size={20} />
                    <span>€{order.totalPrice.toFixed(2)}</span>
                </div>
                <span className={getStatusClass(order.status)}>
                    {order.status}
                </span>
            </div>
            <div className="order-actions">
                {role === 'RETAILER' && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => onStatusChange(order.id, e.target.value)}
                    >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                    </select>
                )}
                {canCancel && (
                    <button
                        onClick={() => onCancel(order.id)}
                        className="cancel-button"
                        aria-label="Cancel order"
                    >
                        Cancel Order
                    </button>
                )}
                <button
                    className="view-details-button"
                    onClick={() => setIsDetailsModalOpen(true)}
                    aria-label="View order details"
                >
                    View Details
                </button>
            </div>

            <OrderDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                order={order}
                role={role}
            />
        </div>
    );
};

OrderCard.propTypes = {
    order: PropTypes.shape({
        id: PropTypes.number.isRequired,
        orderDate: PropTypes.string.isRequired,  // Changed from date
        status: PropTypes.oneOf(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({  // Added items array
            id: PropTypes.number.isRequired,
            quantity: PropTypes.number.isRequired,
            ingredientId: PropTypes.number.isRequired,
            ingredientName: PropTypes.string.isRequired,
            pricePerUnit: PropTypes.number.isRequired,
            totalPrice: PropTypes.number.isRequired,
        })),
        totalPrice: PropTypes.number.isRequired,
        retailerName: PropTypes.string,
        customerName: PropTypes.string
    }).isRequired,
    role: PropTypes.oneOf(['USER', 'RETAILER']).isRequired,
    onStatusChange: PropTypes.func,
    onCancel: PropTypes.func.isRequired
};

export default OrderCard;