import PropTypes from 'prop-types';
import { Calendar, Package, User, Store, DollarSign } from 'lucide-react';

const OrderCard = ({ order, role, onStatusChange, onCancel }) => {
    const canCancel = role === 'USER'
        ? order.status !== 'SHIPPED' && order.status !== 'COMPLETED'
        : true;

    const getStatusClass = (status) => {
        const classes = {
            PENDING: 'user-status-pending',
            PROCESSING: 'user-status-processing',
            SHIPPED: 'user-status-shipped',
            COMPLETED: 'user-status-delivered',
            CANCELLED: 'user-status-cancelled'
        };
        return `status-badge ${classes[status]}`;
    };

    return (
        <div className="order-card">
            <div className="order-info">
                <div className="order-detail">
                    <Calendar size={20} />
                    <span>{order.date}</span>
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
                    <span>{order.beerType}</span>
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
                {role === 'RETAILER' && order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                    <select
                        className="status-select"
                        value={order.status}
                        onChange={(e) => onStatusChange(order.id, e.target.value)}
                    >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="COMPLETED">Completed</option>
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
                    aria-label="View order details"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

OrderCard.propTypes = {
    order: PropTypes.shape({
        id: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        status: PropTypes.oneOf(['PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED']).isRequired,
        beerType: PropTypes.string.isRequired,
        totalPrice: PropTypes.number.isRequired,
        retailerName: PropTypes.string,
        customerName: PropTypes.string
    }).isRequired,
    role: PropTypes.oneOf(['USER', 'RETAILER']).isRequired,
    onStatusChange: PropTypes.func,
    onCancel: PropTypes.func.isRequired
};

export default OrderCard;