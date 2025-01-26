import { useState, useEffect } from 'react';
import { recipeService } from '../../services/recipeService';
import './styles/RecipeManagement.css';

const RecipeManagement = () => {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficulty: 'Beginner',
        timeInWeeks: 0,
        type: 'Ale',
        abv: '',
        ibu: '',
        ingredients: [''],
        instructions: ['']
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        void loadRecipes();
    }, []);

    const loadRecipes = async () => {
        try {
            setLoading(true);
            const data = await recipeService.getAllRecipes();
            setRecipes(data);
        } catch (err) {
            setError('Failed to load recipes');
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

    const handleArrayInputChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayField = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayField = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (isEditing) {
                await recipeService.updateRecipe(selectedRecipe.id, formData);
            } else {
                await recipeService.createRecipe(formData);
            }
            await loadRecipes();
            resetForm();
        } catch (err) {
            setError(isEditing ? 'Failed to update recipe' : 'Failed to create recipe');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (recipe) => {
        setSelectedRecipe(recipe);
        setFormData({
            title: recipe.title,
            description: recipe.description,
            difficulty: recipe.difficulty,
            timeInWeeks: recipe.timeInWeeks,
            type: recipe.type,
            abv: recipe.abv,
            ibu: recipe.ibu,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this recipe?')) return;
        try {
            setLoading(true);
            await recipeService.deleteRecipe(id);
            await loadRecipes();
        } catch (err) {
            setError('Failed to delete recipe');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            difficulty: 'Beginner',
            timeInWeeks: 0,
            type: 'Ale',
            abv: '',
            ibu: '',
            ingredients: [''],
            instructions: ['']
        });
        setSelectedRecipe(null);
        setIsEditing(false);
        setError(null);
    };

    return (
        <div className="recipe-management">
            <h2 className="recipe-management-title">
                {isEditing ? 'Edit Recipe' : 'Create New Recipe'}
            </h2>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="recipe-form">
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
                        <label htmlFor="difficulty">Difficulty</label>
                        <select
                            id="difficulty"
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleInputChange}
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                        >
                            <option value="Ale">Ale</option>
                            <option value="Lager">Lager</option>
                            <option value="Stout">Stout</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="timeInWeeks">Time (weeks)</label>
                        <input
                            type="number"
                            id="timeInWeeks"
                            name="timeInWeeks"
                            value={formData.timeInWeeks}
                            onChange={handleInputChange}
                            min="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="abv">ABV</label>
                        <input
                            type="text"
                            id="abv"
                            name="abv"
                            value={formData.abv}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ibu">IBU</label>
                        <input
                            type="text"
                            id="ibu"
                            name="ibu"
                            value={formData.ibu}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Ingredients</label>
                    {formData.ingredients.map((ingredient, index) => (
                        <div key={index} className="array-input-row">
                            <input
                                type="text"
                                value={ingredient}
                                onChange={(e) => handleArrayInputChange(index, 'ingredients', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayField('ingredients', index)}
                                className="remove-button"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayField('ingredients')}
                        className="add-button"
                    >
                        Add Ingredient
                    </button>
                </div>

                <div className="form-group">
                    <label>Instructions</label>
                    {formData.instructions.map((instruction, index) => (
                        <div key={index} className="array-input-row">
                            <input
                                type="text"
                                value={instruction}
                                onChange={(e) => handleArrayInputChange(index, 'instructions', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayField('instructions', index)}
                                className="remove-button"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayField('instructions')}
                        className="add-button"
                    >
                        Add Instruction
                    </button>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button" disabled={loading}>
                        {isEditing ? 'Update Recipe' : 'Create Recipe'}
                    </button>
                    {isEditing && (
                        <button type="button" onClick={resetForm} className="cancel-button">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <div className="recipes-list">
                <h3>Existing Recipes</h3>
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="recipes-grid">
                        {recipes.map(recipe => (
                            <div key={recipe.id} className="recipe-item">
                                <h4>{recipe.title}</h4>
                                <p>{recipe.description}</p>
                                <div className="recipe-actions">
                                    <button
                                        onClick={() => handleEdit(recipe)}
                                        className="edit-button"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(recipe.id)}
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

export default RecipeManagement;