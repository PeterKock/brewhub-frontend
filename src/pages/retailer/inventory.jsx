import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SearchBar } from '../../components/shared/SearchBar';
import { Plus, Edit2, Trash2, AlertTriangle, Package, Calendar, Box } from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import AddInventoryModal from '../../components/inventory/AddInventoryModal';
import ImportExportButtons from '../../components/inventory/ImportExportButtons';
import './styles/inventory.css';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export default function RetailerInventory() {
    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [filterCategory, setFilterCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [showDeleted, setShowDeleted] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const handleAddItem = async (itemData) => {
        try {
            const formattedData = {
                ...itemData,
                category: itemData.category.toUpperCase(),
                quantity: Number(itemData.quantity),
                price: Number(itemData.price),
                lowStockThreshold: Number(itemData.lowStockThreshold),
                expiryDate: itemData.expiryDate
            };

            await inventoryService.createItem(formattedData);
            await loadInventory();
            setIsModalOpen(false);
            setError(null);
        } catch (error) {
            console.error('Error creating item:', error);
            setError(error.response?.data?.message || 'Failed to create item. Please check all required fields.');
        }
    };

    const handleEditItem = async (id, updatedData) => {
        try {
            const formattedData = {
                ...updatedData,
                category: updatedData.category.toUpperCase(),
                quantity: Number(updatedData.quantity),
                price: Number(updatedData.price),
                lowStockThreshold: Number(updatedData.lowStockThreshold),
                expiryDate: updatedData.expiryDate
            };
            await inventoryService.updateItem(id, formattedData);
            await loadInventory();
            setEditingItem(null);
            setIsModalOpen(false);
            setError(null);
        } catch (error) {
            console.error('Error updating item:', error);
            setError('Failed to update item');
        }
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const loadInventory = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await (showDeleted ?
                inventoryService.getDeletedItems(debouncedSearchTerm, filterCategory) :
                inventoryService.getAllItems(debouncedSearchTerm, filterCategory));
            setInventory(data);
            setError(null);
        } catch (error) {
            console.error('Error loading inventory:', error);
            setError('Failed to load inventory items');
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, filterCategory, showDeleted]);

    const handleRestore = async (id) => {
        try {
            await inventoryService.restoreItem(id);
            await loadInventory();
            setError(null);
        } catch (error) {
            console.error('Error restoring item:', error);
            setError('Failed to restore item');
        }
    };

    useEffect(() => {
        const abortController = new AbortController();

        const fetchInventory = async () => {
            if (!abortController.signal.aborted) {
                await loadInventory();
            }
        };

        fetchInventory().catch(error => {
            if (!abortController.signal.aborted) {
                console.error('Error fetching inventory:', error);
                setError('Failed to load inventory items');
            }
        });

        return () => {
            abortController.abort();
        };
    }, [loadInventory]);

    useEffect(() => {
        if (location.state?.editItemId) {
            const itemToEdit = inventory.find(item => item.id === location.state.editItemId);
            if (itemToEdit) {
                setEditingItem(itemToEdit);
                setIsModalOpen(true);
            }
        }
    }, [location.state, inventory]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleCategoryChange = (e) => {
        setFilterCategory(e.target.value);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await inventoryService.deleteItem(id);
                await loadInventory();
                setError(null);
            } catch (error) {
                console.error('Delete failed:', error);
                setError('Failed to delete item');
            }
        }
    };

    const renderInventoryItem = (item) => {
        const {
            price = 0,
            expiryDate,
            id,
            name,
            quantity = 0,
            unit,
            lowStock
        } = item;

        const itemPrice = Number(price);
        const expiryDateStr = expiryDate ? new Date(expiryDate).toLocaleDateString() : 'No date';
        const isOutOfStock = quantity === 0;

        return (
            <div key={id} className="order-card">
                <div className="order-info">
                    <div className="order-detail">
                        <Box size={20} />
                        <span>{name}</span>
                    </div>
                    <div className="order-detail">
                        <Package size={20} />
                        <span>{quantity} {unit}</span>
                    </div>
                    <div className="order-detail">
                        <span>€{itemPrice.valueOf()} per {unit}</span>
                    </div>
                    <div className="order-detail">
                        <Calendar size={20} />
                        <span>Expires: {expiryDateStr}</span>
                    </div>
                    {isOutOfStock ? (
                        <span className="out-of-stock-badge">
                            <AlertTriangle size={16} />
                            Out of Stock
                        </span>
                    ) : lowStock && (
                        <span className="low-stock-badge">
                            <AlertTriangle size={16} />
                            Low Stock
                        </span>
                    )}
                </div>
                <div className="inventory-actions">
                    {showDeleted ? (
                        <button
                            className="inventory-restore-button"
                            onClick={() => handleRestore(item.id)}
                        >
                            Restore
                        </button>
                    ) : (
                        <>
                            <button
                                className="inventory-edit-button"
                                onClick={() => handleEditClick(item)}
                            >
                                <Edit2 />
                                Edit
                            </button>
                            <button
                                className="inventory-delete-button"
                                onClick={() => handleDelete(item.id)}
                            >
                                <Trash2 />
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="dashboard-container">
                <section className="dashboard-section">
                    <div className="loading">Loading inventory items...</div>
                </section>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <section className="dashboard-section">
                <h2 className="section-title">Inventory Management</h2>

                <ImportExportButtons onImportComplete={loadInventory} />

                {error && <div className="error-message">{error}</div>}
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearch}
                    placeholder="Search ingredients..."
                />
                <div className="inventory-filter-bar">
                    <select
                        className="filter-select"
                        value={filterCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="all">All Categories</option>
                        <option value="grains">Grains</option>
                        <option value="hops">Hops</option>
                        <option value="yeast">Yeast</option>
                        <option value="other">Other</option>
                    </select>
                    <button
                        className="inventory-toggle-button"
                        onClick={() => setShowDeleted(!showDeleted)}
                    >
                        {showDeleted ? 'Show Active Items' : 'Show Deleted Items'}
                    </button>
                    {!showDeleted && (
                        <button
                            className="inventory-add-button"
                            onClick={() => {
                                setEditingItem(null);
                                setIsModalOpen(true);
                            }}
                        >
                            <Plus />
                            Add New Item
                        </button>
                    )}
                </div>

                <div className="inventory-list">
                    {inventory.map(renderInventoryItem)}

                    {inventory.length === 0 && (
                        <div className="no-results">
                            {searchTerm || filterCategory !== 'all'
                                ? 'No inventory items match your search criteria'
                                : showDeleted
                                    ? 'No deleted items found'
                                    : 'No inventory items found'
                            }
                        </div>
                    )}
                </div>
            </section>

            <AddInventoryModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                    navigate('/inventory', { replace: true }); // Clear the editItemId from state
                }}
                onSubmit={editingItem ?
                    (data) => handleEditItem(editingItem.id, data) :
                    handleAddItem}
                initialData={editingItem}
            />
        </div>
    );
}