import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ShoppingCart, X } from 'lucide-react';
import { publicService } from '../../services/publicService';

const CreateOrderModal = ({ isOpen, onClose, onSubmit, retailerId }) => {
    const [ingredients, setIngredients] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchIngredients = async () => {
            if (!isOpen || !retailerId) return;

            try {
                setIsLoading(true);
                const data = await publicService.getRetailerIngredients(retailerId);
                if (isMounted) {
                    setIngredients(data);
                    setError('');
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load ingredients');
                    console.error('Error loading ingredients:', err);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchIngredients().catch(err => {
            if (isMounted) {
                console.error('Failed to fetch ingredients:', err);
                setError('Failed to load ingredients. Please try again later.');
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [isOpen, retailerId]);

    const handleQuantityChange = (ingredientId, quantity) => {
        setSelectedItems(prev => {
            const existing = prev.find(item => item.ingredientId === ingredientId);
            if (existing) {
                return prev.map(item =>
                    item.ingredientId === ingredientId
                        ? { ...item, quantity: parseFloat(quantity) || 0 }
                        : item
                );
            }
            return [...prev, { ingredientId, quantity: parseFloat(quantity) || 0 }];
        });
    };

    const calculateTotal = () => {
        return selectedItems.reduce((total, item) => {
            const ingredient = ingredients.find(ing => ing.id === item.ingredientId);
            return total + (ingredient?.price || 0) * (item.quantity || 0);
        }, 0).toFixed(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validItems = selectedItems.filter(item => item.quantity > 0);
        if (validItems.length === 0) {
            setError('Please select at least one item with a quantity greater than 0');
            return;
        }

        const orderData = {
            retailerId,
            items: validItems,
            notes: notes.trim()
        };
        onSubmit(orderData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Create New Order</h3>
                    <button
                        className="modal-close-button"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {error && <div className="error-message">{error}</div>}

                    {isLoading ? (
                        <div className="loading">Loading ingredients...</div>
                    ) : (
                        <>
                            <div className="ingredients-list">
                                {ingredients.map(ingredient => (
                                    <div key={ingredient.id} className="form-group">
                                        <label htmlFor={`quantity-${ingredient.id}`}>
                                            {ingredient.name} ({ingredient.unit})
                                        </label>
                                        <div className="input-group">
                                            <input
                                                id={`quantity-${ingredient.id}`}
                                                type="number"
                                                min="0"
                                                max={ingredient.quantity}
                                                step="0.01"
                                                placeholder={`Available: ${ingredient.quantity} ${ingredient.unit}`}
                                                onChange={(e) => handleQuantityChange(ingredient.id, e.target.value)}
                                            />
                                            <span className="price">€{ingredient.price} per {ingredient.unit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="form-group">
                                <label htmlFor="order-notes">Order Notes</label>
                                <textarea
                                    id="order-notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any special instructions or notes here..."
                                    rows={4}
                                />
                            </div>

                            <div className="order-summary">
                                <span>Total: €{calculateTotal()}</span>
                            </div>
                        </>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="modal-cancel-button"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="modal-submit-button"
                            disabled={isLoading || selectedItems.filter(item => item.quantity > 0).length === 0}
                        >
                            <ShoppingCart size={20} />
                            Place Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

CreateOrderModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    retailerId: PropTypes.number.isRequired
};

export default CreateOrderModal;