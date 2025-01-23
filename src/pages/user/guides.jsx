import { useState, useEffect, useRef } from 'react';
import { GuideList, GuideDetailCard, guideData } from '../../components/guides';
import './styles/guides.css'

const UserGuides = () => {
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: 'all'
    });
    const guideDetailRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (guideDetailRef.current && !guideDetailRef.current.contains(event.target)) {
                setSelectedGuide(null);
            }
        };

        if (selectedGuide) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedGuide]);

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleFilter = (filterType, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: value
        }));
    };

    const filteredGuides = guideData.filter(guide => {
        const categoryMatch = filters.category === 'all' || guide.category === filters.category;
        const searchMatch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guide.description.toLowerCase().includes(searchTerm.toLowerCase());
        return categoryMatch && searchMatch;
    });

    return (
        <main className="main-content">
            <h2 className="section-title"></h2>

            {selectedGuide ? (
                <div className="selected-guide-container" ref={guideDetailRef}>
                    <GuideDetailCard
                        guide={selectedGuide}
                        onClose={() => setSelectedGuide(null)}
                    />
                </div>
            ) : (
                <GuideList
                    guides={filteredGuides}
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                    onSelectGuide={setSelectedGuide}
                />
            )}
        </main>
    );
};

export default UserGuides;