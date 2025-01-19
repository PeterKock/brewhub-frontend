import { useState } from 'react';
import {Download, Upload} from 'lucide-react';
import PropTypes from 'prop-types';

const ImportExportButtons = ({ onImportComplete }) => {
    const [importing, setImporting] = useState(false);
    const [importError, setImportError] = useState(null);

    const handleExport = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/retailer/inventory/export', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                setImportError('Export failed. Please try again.');
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            setImportError('Export failed. Please try again.');
        }
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== 'text/csv') {
            setImportError('Please upload a CSV file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setImporting(true);
            setImportError(null);

            const response = await fetch('http://localhost:8080/api/retailer/inventory/import', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                setImportError(Array.isArray(data) ? data.join('\n') : 'Import failed');
                return;
            }

            onImportComplete();
            event.target.value = null; // Reset file input
        } catch {
            setImportError('Import failed. Please try again.');
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="import-export-container">
            <div className="import-export-buttons">
                <button
                    className="export-button"
                    onClick={handleExport}
                >
                    <Upload size={20} />
                    Export CSV
                </button>

                <div className="import-button-wrapper">
                    <input
                        type="file"
                        id="csv-import"
                        accept=".csv"
                        onChange={handleImport}
                        disabled={importing}
                        style={{ display: 'none' }}
                    />
                    <label
                        htmlFor="csv-import"
                        className={`import-button ${importing ? 'importing' : ''}`}
                    >
                        <Download size={20} />
                        {importing ? 'Importing...' : 'Import CSV'}
                    </label>
                </div>
            </div>

            {importError && (
                <div className="import-error">
                    {importError}
                </div>
            )}
        </div>
    );
};

ImportExportButtons.propTypes = {
    onImportComplete: PropTypes.func.isRequired
};

export default ImportExportButtons;