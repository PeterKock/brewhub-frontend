import { useState, useEffect, useCallback } from 'react';
import { SearchBar } from '../../components/shared/SearchBar';
import { Plus, Edit2, Trash2, AlertTriangle, Package, Calendar, DollarSign, Box } from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';

export default function RetailerInventory() {
    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadInventory = useCallback(async () => {
        try {
            const data = await inventoryService.getAllItems(searchTerm, filterCategory);
            setInventory(data);
            setError(null);
        } catch (err) {
            console.error('Error loading inventory:', err);
            setError('Failed to load inventory items');
        } finally {
            setLoading(false);
        }
    }, [searchTerm, filterCategory]);

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
            } catch (err) {
                console.error('Error deleting item:', err);
                setError('Failed to delete item');
            }
        }
    };

    const renderInventoryItem = (item) => {
        const { price, expiryDate, id, name, quantity, unit, lowStock } = item;
        const itemPrice = price !== undefined ? Number(price) : 0;
        const expiryDateStr = expiryDate ? new Date(expiryDate).toLocaleDateString() : 'No date';

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
                        <DollarSign size={20} />
                        <span>€{itemPrice.toFixed(2)} per {unit}</span>
                    </div>
                    <div className="order-detail">
                        <Calendar size={20} />
                        <span>Expires: {expiryDateStr}</span>
                    </div>
                    {lowStock && (
                        <span className="low-stock-badge">
                            <AlertTriangle />
                            Low Stock
                        </span>
                    )}
                </div>
                <div className="inventory-actions">
                    <button className="inventory-edit-button">
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
                </div>
            </div>
        );
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <section className="dashboard-section">
                <h2 className="section-title">Inventory Management</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="inventory-filter-bar">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={handleSearch}
                        placeholder="Search ingredients..."
                    />
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
                    <button className="inventory-add-button">
                        <Plus />
                        Add New Item
                    </button>
                </div>

                <div className="inventory-list">
                    {inventory.map(renderInventoryItem)}

                    {inventory.length === 0 && (
                        <div className="no-results">
                            No inventory items found
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}