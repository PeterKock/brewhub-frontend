import PropTypes from 'prop-types';
import { X, Calendar, User, Store } from 'lucide-react';
import RatingComponent from '../ratings/RatingComponent';

const OrderDetailsModal = ({ isOpen, onClose, order, role }) => {
    if (!isOpen || !order) return null;

    const formattedDate = new Date(order.orderDate).toLocaleDateString();

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Order Details</h3>
                    <button
                        className="modal-close-button"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-form">
                    <div className="order-details-header">
                        <div className="order-detail">
                            <Calendar size={20} />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="order-detail">
                            {role === 'USER' ? (
                                <>
                                    <Store size={20} />
                                    <span>{order.retailerName}</span>
                                    {order.retailerRating && (
                                        <RatingComponent
                                            retailerId={order.retailerId}
                                            initialRating={order.retailerRating}
                                            readOnly
                                        />
                                    )}
                                </>
                            ) : (
                                <>
                                    <User size={20} />
                                    <span>{order.customerName}</span>
                                </>
                            )}
                        </div>
                        <span className={`status-badge user-status-${order.status?.toLowerCase()}`}>
                            {order.status}
                        </span>
                    </div>

                    <div className="order-items-list">
                        <h4>Order Items</h4>
                        <table className="order-items-table">
                            <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Price/Unit</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {order.items?.map(item => (
                                <tr key={item.id}>
                                    <td>{item.ingredientName}</td>
                                    <td>{item.quantity} {item.unit}</td>
                                    <td>€{item.pricePerUnit.toFixed(2)}</td>
                                    <td>€{item.totalPrice.toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan="3">Total</td>
                                <td>€{order.totalPrice.toFixed(2)}</td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>

                    {order.notes && (
                        <div className="order-notes">
                            <h4>Notes</h4>
                            <p>{order.notes}</p>
                        </div>
                    )}

                    {role === 'USER' && order.status === 'DELIVERED' && (
                        <div className="rating-section">
                            <h4>Rate this Retailer</h4>
                            <RatingComponent
                                retailerId={order.retailerId}
                                onRatingSubmit={() => {
                                    // Optionally refresh the order details or show a success message
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

OrderDetailsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    order: PropTypes.shape({
        orderDate: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        retailerName: PropTypes.string,
        customerName: PropTypes.string,
        retailerId: PropTypes.number,
        retailerRating: PropTypes.number,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            ingredientName: PropTypes.string.isRequired,
            quantity: PropTypes.number.isRequired,
            unit: PropTypes.string.isRequired,
            pricePerUnit: PropTypes.number.isRequired,
            totalPrice: PropTypes.number.isRequired
        })).isRequired,
        totalPrice: PropTypes.number.isRequired,
        notes: PropTypes.string
    }),
    role: PropTypes.oneOf(['USER', 'RETAILER']).isRequired
};

export default OrderDetailsModal;