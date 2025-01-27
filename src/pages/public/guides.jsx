import { useState, useEffect, useRef } from 'react';
import { GuideList, GuideDetailCard } from '../../components/guides/index.js';
import { guideService } from '../../services/guideService.js';
import './styles/guides.css';

const UserGuides = () => {
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const guideDetailRef = useRef(null);

    const loadGuides = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await guideService.getAllGuides();
            setGuides(data);
        } catch (err) {
            console.error('Error loading guides:', err);
            setError('Failed to load guides. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadGuides();
    }, []);

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

    const handleSearch = async (value) => {
        setSearchTerm(value);
        try {
            setLoading(true);
            setError(null);
            let data;
            if (value.trim()) {
                data = await guideService.searchGuides(value);
            } else {
                data = await guideService.getAllGuides();
            }
            setGuides(data);
        } catch (err) {
            console.error('Error searching guides:', err);
            setError('Failed to search guides. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = async (filterType, value) => {
        setFilterCategory(value);
        try {
            setLoading(true);
            setError(null);
            let data;

            if (value === 'all') {
                data = await guideService.getAllGuides();
            } else {
                data = await guideService.getGuidesByCategory(value);
            }

            setGuides(data);
        } catch (err) {
            console.error('Error filtering guides:', err);
            setError('Failed to filter guides. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectGuide = async (guide) => {
        try {
            setLoading(true);
            const fetchedGuide = await guideService.getGuideById(guide.id);
            setSelectedGuide(fetchedGuide);
        } catch (err) {
            setError('Failed to load guide details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => void loadGuides()} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <main className="main-content">
            <h2 className="section-title">Brewing Guides</h2>

            {selectedGuide ? (
                <div className="selected-guide-container" ref={guideDetailRef}>
                    <GuideDetailCard
                        guide={selectedGuide}
                        onClose={() => setSelectedGuide(null)}
                    />
                </div>
            ) : (
                <GuideList
                    guides={guides}
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                    onSelectGuide={handleSelectGuide}
                    loading={loading}
                    searchTerm={searchTerm}
                    selectedCategory={filterCategory}
                />
            )}
        </main>
    );
};

export default UserGuides;