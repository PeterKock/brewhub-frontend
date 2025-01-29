import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ShoppingCart, X } from 'lucide-react';
import { publicService } from '../../services/publicService';
import './styles/CreateOrderModal.css';

const CreateOrderModal = ({ isOpen, onClose, onSubmit, retailerId }) => {
    const [ingredients, setIngredients] = useState([]);
    const [filteredIngredients, setFilteredIngredients] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchIngredients = async () => {
            try {
                setIsLoading(true);
                const data = await publicService.getRetailerIngredients(retailerId);
                if (isMounted) {
                    setIngredients(data);
                    setFilteredIngredients(data);
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

        if (isOpen && retailerId) {
            (async () => {
                await fetchIngredients();
            })();
        }

        return () => {
            isMounted = false;
        };
    }, [isOpen, retailerId]);


    useEffect(() => {
        const filtered = ingredients.filter(ingredient =>
            ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredIngredients(filtered);
    }, [searchTerm, ingredients]);

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
        }, 0);
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

    if (!isOpen) {
        return null;
    }

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
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Search ingredients..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    id="ingredient-search"
                                />
                            </div>

                            <div className="ingredients-list">
                                {filteredIngredients.map(ingredient => (
                                    <div key={ingredient.id} className="ingredient-card">
                                        <div className="ingredient-name">
                                            <span>{ingredient.name}</span>
                                            <small>Available: {ingredient.quantity} {ingredient.unit}</small>
                                        </div>
                                        <div className="ingredient-price">
                                            €{ingredient.price} per {ingredient.unit}
                                        </div>
                                        <div className="ingredient-quantity">
                                            <input
                                                type="number"
                                                min="0"
                                                max={ingredient.quantity}
                                                step="0.01"
                                                onChange={(e) => handleQuantityChange(ingredient.id, e.target.value)}
                                            />
                                            <span>{ingredient.unit}</span>
                                        </div>
                                    </div>
                                ))}
                                {filteredIngredients.length === 0 && (
                                    <div className="no-results">
                                        No ingredients found matching your search
                                    </div>
                                )}
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
                            <ShoppingCart size={20}  />
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
