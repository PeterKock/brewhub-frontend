import { useState, useEffect } from 'react';
import { SearchBar } from '../../components/shared/SearchBar';
import { Plus, Edit2, Trash2, AlertTriangle, Package, Calendar, DollarSign, Box } from 'lucide-react';

export default function RetailerInventory() {
    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        // Example inventory data - replace with actual API call
        const exampleInventory = [
            {
                id: 1,
                name: "Pilsner Malt",
                category: "grains",
                quantity: 500,
                unit: "kg",
                price: 2.5,
                expiryDate: "2025-12-31",
                lowStock: true
            },
            {
                id: 2,
                name: "Cascade Hops",
                category: "hops",
                quantity: 50,
                unit: "kg",
                price: 15.0,
                expiryDate: "2025-06-30",
                lowStock: false
            }
        ];

        setInventory(exampleInventory);
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="dashboard-container">
            <section className="dashboard-section">
                <h2 className="section-title">Inventory Management</h2>

                <div className="inventory-filter-bar">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={handleSearch}
                        placeholder="Search ingredients..."
                    />
                    <select
                        className="filter-select"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
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
                    {filteredInventory.map(item => (
                        <div key={item.id} className="order-card">
                            <div className="order-info">
                                <div className="order-detail">
                                    <Box size={20} />
                                    <span>{item.name}</span>
                                </div>
                                <div className="order-detail">
                                    <Package size={20} />
                                    <span>{item.quantity} {item.unit}</span>
                                </div>
                                <div className="order-detail">
                                    <DollarSign size={20} />
                                    <span>€{item.price.toFixed(2)} per {item.unit}</span>
                                </div>
                                <div className="order-detail">
                                    <Calendar size={20} />
                                    <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                                </div>
                                {item.lowStock && (
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
                                <button className="inventory-delete-button">
                                    <Trash2 />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}