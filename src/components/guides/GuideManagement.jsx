import { useState, useEffect } from 'react';
import { guideService } from '../../services/guideService';
import './styles/GuideManagement.css';

const GuideManagement = () => {
    const [guides, setGuides] = useState([]);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'getting-started',
        timeToRead: 0,
        sections: [{
            title: '',
            content: ''
        }],
        tips: ['']
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        void loadGuides();
    }, []);

    const loadGuides = async () => {
        try {
            setLoading(true);
            const data = await guideService.getAllGuides();
            setGuides(data);
        } catch (err) {
            setError('Failed to load guides');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSectionChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map((section, i) =>
                i === index ? { ...section, [field]: value } : section
            )
        }));
    };

    const addSection = () => {
        setFormData(prev => ({
            ...prev,
            sections: [...prev.sections, { title: '', content: '' }]
        }));
    };

    const removeSection = (index) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.filter((_, i) => i !== index)
        }));
    };

    const handleTipChange = (index, value) => {
        setFormData(prev => ({
            ...prev,
            tips: prev.tips.map((tip, i) => i === index ? value : tip)
        }));
    };

    const addTip = () => {
        setFormData(prev => ({
            ...prev,
            tips: [...prev.tips, '']
        }));
    };

    const removeTip = (index) => {
        setFormData(prev => ({
            ...prev,
            tips: prev.tips.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (isEditing) {
                await guideService.updateGuide(selectedGuide.id, formData);
            } else {
                await guideService.createGuide(formData);
            }
            await loadGuides();
            resetForm();
        } catch (err) {
            setError(isEditing ? 'Failed to update guide' : 'Failed to create guide');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (guide) => {
        setSelectedGuide(guide);
        setFormData({
            title: guide.title,
            description: guide.description,
            category: guide.category,
            timeToRead: guide.timeToRead,
            sections: guide.sections,
            tips: guide.tips
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this guide?')) return;
        try {
            setLoading(true);
            await guideService.deleteGuide(id);
            await loadGuides();
        } catch (err) {
            setError('Failed to delete guide');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'getting-started',
            timeToRead: 0,
            sections: [{ title: '', content: '' }],
            tips: ['']
        });
        setSelectedGuide(null);
        setIsEditing(false);
        setError(null);
    };

    return (
        <div className="guide-management">
            <h2 className="guide-management-title">
                {isEditing ? 'Edit Guide' : 'Create New Guide'}
            </h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="guide-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                        >
                            <option value="getting-started">Getting Started</option>
                            <option value="equipment">Equipment</option>
                            <option value="ingredients">Ingredients</option>
                            <option value="techniques">Techniques</option>
                            <option value="troubleshooting">Troubleshooting</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="timeToRead">Time to Read (minutes)</label>
                        <input
                            type="number"
                            id="timeToRead"
                            name="timeToRead"
                            value={formData.timeToRead}
                            onChange={handleInputChange}
                            min="1"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Sections</label>
                    {formData.sections.map((section, index) => (
                        <div key={index} className="section-input">
                            <input
                                type="text"
                                placeholder="Section Title"
                                value={section.title}
                                onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                                required
                            />
                            <textarea
                                placeholder="Section Content"
                                value={section.content}
                                onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeSection(index)}
                                className="remove-button"
                            >
                                Remove Section
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addSection}
                        className="add-button"
                    >
                        Add Section
                    </button>
                </div>

                <div className="form-group">
                    <label>Tips & Recommendations</label>
                    {formData.tips.map((tip, index) => (
                        <div key={index} className="tip-input">
                            <input
                                type="text"
                                value={tip}
                                onChange={(e) => handleTipChange(index, e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeTip(index)}
                                className="remove-button"
                            >
                                Remove Tip
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addTip}
                        className="add-button"
                    >
                        Add Tip
                    </button>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={loading}>
                        {isEditing ? 'Update Guide' : 'Create Guide'}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={resetForm} className="cancel-button">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="guides-list">
                <h3>Existing Guides</h3>
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="guides-grid">
                        {guides.map(guide => (
                            <div key={guide.id} className="guide-item">
                                <h4>{guide.title}</h4>
                                <p>{guide.description}</p>
                                <div className="guide-meta">
                                    <span className="guide-category">{guide.category}</span>
                                    <span className="guide-time">{guide.timeToRead} min read</span>
                                </div>
                                <div className="guide-actions">
                                    <button
                                        onClick={() => handleEdit(guide)}
                                        className="edit-button"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(guide.id)}
                                        className="delete-button"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuideManagement;