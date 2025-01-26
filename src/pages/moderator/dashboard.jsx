import { useState } from 'react';
import { AlertCircle, Book, Coffee } from 'lucide-react';
import RecipeManagement from '../../components/recipes/RecipeManagement';
import GuideManagement from '../../components/guides/GuideManagement';
import ReportManagement from '../../components/reports/ReportManagement';
import './styles/dashboard.css';

const ModeratorDashboard = () => {
    const [activeTab, setActiveTab] = useState('reports');

    return (
        <div className="moderator-dashboard">
            <div className="dashboard-tabs">
                <button
                    className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                >
                    <AlertCircle size={20} />
                    Reports
                </button>
                <button
                    className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('recipes')}
                >
                    <Coffee size={20} />
                    Recipes
                </button>
                <button
                    className={`tab-button ${activeTab === 'guides' ? 'active' : ''}`}
                    onClick={() => setActiveTab('guides')}
                >
                    <Book size={20} />
                    Guides
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'reports' && <ReportManagement />}
                {activeTab === 'recipes' && <RecipeManagement />}
                {activeTab === 'guides' && <GuideManagement />}
            </div>
        </div>
    );
};

export default ModeratorDashboard;