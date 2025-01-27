import { useState, useEffect, useCallback } from 'react';
import { communityService } from '../../services/communityService.js';
import { AlertCircle, Check, X } from 'lucide-react';
import './styles/ReportManagement.css';

const ReportManagement = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [notification, setNotification] = useState(null);

    const loadReports = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await communityService.getPendingReports();
            setReports(data || []);
            // Automatically select the first report if one exists
            if (data && data.length > 0 && !selectedReport) {
                setSelectedReport(data[0]);
            }
        } catch (err) {
            console.error('Error loading reports:', err);
            setError('Failed to load reports');
        } finally {
            setLoading(false);
        }
    }, [selectedReport]);

    useEffect(() => {
        void loadReports();
    }, [loadReports]);

    const handleReportAction = async (reportId, status) => {
        try {
            setError(null);
            await communityService.updateReportStatus(reportId, status);
            await loadReports();
            setSelectedReport(null);
            showNotification(
                status === 'APPROVED'
                    ? 'Report approved and content removed'
                    : 'Report rejected'
            );
        } catch (err) {
            console.error('Error updating report:', err);
            setError('Failed to update report status');
        }
    };

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const formatDate = useCallback((dateString) => {
        if (!dateString) return 'No date available';
        try {
            return new Date(dateString).toLocaleString();
        } catch (err) {
            console.error('Error formatting date:', err);
            return 'Invalid date';
        }
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading reports...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => void loadReports()} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="report-management">
            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}

            <div className="reports-container">
                <div className="reports-list">
                    <h3>Pending Reports ({reports.length})</h3>
                    {reports.length === 0 ? (
                        <p className="no-reports">No pending reports to review</p>
                    ) : (
                        reports.map(report => (
                            <div
                                key={report.id}
                                className={`report-card ${selectedReport?.id === report.id ? 'selected' : ''}`}
                                onClick={() => setSelectedReport(report)}
                            >
                                <div className="report-header">
                                    <AlertCircle size={20} />
                                    <span className="report-reason">{report.reason}</span>
                                </div>
                                <div className="report-meta">
                                    <span>Reported by: {report.reporterName || 'Anonymous'}</span>
                                    <span>{formatDate(report.createdAt)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {selectedReport && (
                    <div className="report-details">
                        <h3>Report Details</h3>
                        <div className="report-info">
                            <div className="info-group">
                                <label>Reported Content Type:</label>
                                <span>
                                    {selectedReport.questionId ? 'Question' : 'Answer'}
                                </span>
                            </div>
                            <div className="info-group">
                                <label>Reason:</label>
                                <span>{selectedReport.reason}</span>
                            </div>
                            {selectedReport.description && (
                                <div className="info-group">
                                    <label>Additional Details:</label>
                                    <p>{selectedReport.description}</p>
                                </div>
                            )}
                            <div className="info-group">
                                <label>Reported By:</label>
                                <span>{selectedReport.reporterName || 'Anonymous'}</span>
                            </div>
                            <div className="info-group">
                                <label>Report Date:</label>
                                <span>{formatDate(selectedReport.createdAt)}</span>
                            </div>
                            {selectedReport.resolvedAt && (
                                <div className="info-group">
                                    <label>Resolved Date:</label>
                                    <span>{formatDate(selectedReport.resolvedAt)}</span>
                                </div>
                            )}
                        </div>

                        <div className="action-buttons-moderator">
                            <button
                                className="approve-button"
                                onClick={() => void handleReportAction(selectedReport.id, 'APPROVED')}
                            >
                                <Check size={20} />
                                Approve & Remove Content
                            </button>
                            <button
                                className="reject-button"
                                onClick={() => void handleReportAction(selectedReport.id, 'REJECTED')}
                            >
                                <X size={20} />
                                Reject Report
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportManagement;