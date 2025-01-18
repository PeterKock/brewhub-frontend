import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Calendar, User, Store } from 'lucide-react';
import RatingComponent from '../ratings/RatingComponent';
import { ratingService } from '../../services/ratingService';

const OrderDetailsModal = ({ isOpen, onClose, order, role }) => {
    const [orderRating, setOrderRating] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchOrderRating = async () => {
            if (order && order.status === 'DELIVERED') {
                try {
                    const rating = await ratingService.getOrderRating(order.id);
                    if (isMounted) {
                        setOrderRating(rating);
                    }
                } catch (error) {
                    console.error('Error fetching order rating:', error);
                }
            }
        };

        void fetchOrderRating();

        return () => {
            isMounted = false;
        };
    }, [order]);

    if (!isOpen || !order) return null;

    const formattedDate = new Date(order.orderDate).toLocaleDateString();

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Order Details</h3>
                    <span className={`status-badge user-status-${order.status?.toLowerCase()}`}>
                        {order.status}
                    </span>
                    <button
                        className="modal-close-button"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <X size={24}/>
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
                    </div>

                    <div className="order-items-list">
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
                                    <td>€{item.pricePerUnit}</td>
                                    <td>€{item.totalPrice}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan="3">Total</td>
                                <td>€{order.totalPrice}</td>
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

                    {order.status === 'DELIVERED' && (
                        <div className="rating-section">
                            {role === 'USER' ? (
                                !orderRating ? (
                                    <>
                                        <h4>Rate this Retailer</h4>
                                        <RatingComponent
                                            retailerId={order.retailerId}
                                            orderId={order.id}
                                            onRatingSubmit={() => {
                                                void (async () => {
                                                    const rating = await ratingService.getOrderRating(order.id);
                                                    setOrderRating(rating);
                                                })();
                                            }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h4>Your Rating</h4>
                                        <RatingComponent
                                            retailerId={order.retailerId}
                                            initialRating={orderRating.score}
                                            readOnly
                                        />
                                        {orderRating.comment && (
                                            <p className="rating-comment">{orderRating.comment}</p>
                                        )}
                                    </>
                                )
                            ) : (
                                orderRating && (
                                    <div className="customer-rating">
                                        <h4>Customer Rating</h4>
                                        <RatingComponent
                                            retailerId={order.retailerId}
                                            initialRating={orderRating.score}
                                            readOnly
                                        />
                                        {orderRating.comment && (
                                            <p className="rating-comment">{orderRating.comment}</p>
                                        )}
                                        <p className="rating-customer">by {orderRating.customerName}</p>
                                    </div>
                                )
                            )}
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
        id: PropTypes.number.isRequired,
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