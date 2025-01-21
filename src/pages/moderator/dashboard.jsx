import { useState, useEffect, useCallback } from 'react';
import { communityService } from '../../services/communityService.js';
import { AlertCircle, Check, X } from 'lucide-react';

const Dashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);

    const loadReports = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await communityService.getPendingReports();
            setReports(data || []);
        } catch (err) {
            console.error('Error loading reports:', err);
            setError('Failed to load reports');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadReports();
    }, [loadReports]);

    const handleReportAction = async (reportId, status) => {
        try {
            setError(null);
            await communityService.updateReportStatus(reportId, status);
            void loadReports();
            setSelectedReport(null);
        } catch (err) {
            console.error('Error updating report:', err);
            setError('Failed to update report status');
        }
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
        return <div className="loading">Loading reports...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="moderator-dashboard">
            <h2>Community Moderation</h2>

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

                        <div className="action-buttons">
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

export default Dashboard;