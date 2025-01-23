import { useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import './styles/AddInventoryModal.css'

const AddInventoryModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        unit: '',
        price: '',
        category: 'grains',
        expiryDate: '',
        lowStockThreshold: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                quantity: initialData.quantity || '',
                unit: initialData.unit || '',
                price: initialData.price || '',
                category: initialData.category?.toLowerCase() || 'grains',
                expiryDate: initialData.expiryDate || '',
                lowStockThreshold: initialData.lowStockThreshold || ''
            });
        } else {
            setFormData({
                name: '',
                quantity: '',
                unit: '',
                price: '',
                category: 'grains',
                expiryDate: '',
                lowStockThreshold: ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{initialData ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h3>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter item name"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                placeholder="Enter quantity"
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div className="form-group">
                            <label>Unit</label>
                            <input
                                type="text"
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                required
                                placeholder="kg, g, l, etc."
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Price per unit (€)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            required
                            placeholder="Enter price"
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="grains">Grains</option>
                            <option value="hops">Hops</option>
                            <option value="yeast">Yeast</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Low Stock Threshold</label>
                        <input
                            type="number"
                            name="lowStockThreshold"
                            value={formData.lowStockThreshold}
                            onChange={handleChange}
                            required
                            step="0.01"
                            min="0"
                            placeholder="Enter minimum stock level"
                        />
                    </div>

                    <div className="inventory-modal-actions">
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
                        >
                            {initialData ? 'Update Item' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

AddInventoryModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object
};

export default AddInventoryModal;