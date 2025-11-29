import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Download, 
  Star, 
  Trash2, 
  Eye, 
  Calendar,
  TrendingUp,
  Clock,
  Video,
  BookOpen,
  Filter,
  X
} from 'lucide-react';
import {
  generateReport,
  getReports,
  getReportStatistics,
  deleteReport,
  toggleFavoriteReport,
  downloadReport
} from '../../services/reportsApi';
import toast from 'react-hot-toast';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [generating, setGenerating] = useState(false);

  // Form state for report generation
  const [formData, setFormData] = useState({
    title: '',
    report_type: 'weekly',
    start_date: '',
    end_date: '',
    description: '',
    generate_pdf: true
  });

  useEffect(() => {
    fetchReports();
    fetchStatistics();
  }, [filterType]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filterType !== 'all') {
        if (filterType === 'favorites') {
          params.isFavorite = true;
        } else {
          params.reportType = filterType;
        }
      }

      const data = await getReports(params);
      setReports(data.reports);
    } catch (error) {
      toast.error('Failed to load reports');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await getReportStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.start_date || !formData.end_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setGenerating(true);
      await generateReport(formData);
      toast.success('Report generated successfully!');
      setShowGenerateModal(false);
      fetchReports();
      fetchStatistics();
      // Reset form
      setFormData({
        title: '',
        report_type: 'weekly',
        start_date: '',
        end_date: '',
        description: '',
        generate_pdf: true
      });
    } catch (error) {
      toast.error('Failed to generate report');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      await deleteReport(reportId);
      toast.success('Report deleted successfully');
      fetchReports();
      fetchStatistics();
    } catch (error) {
      toast.error('Failed to delete report');
      console.error(error);
    }
  };

  const handleToggleFavorite = async (reportId) => {
    try {
      await toggleFavoriteReport(reportId);
      fetchReports();
    } catch (error) {
      toast.error('Failed to update favorite status');
      console.error(error);
    }
  };

  const handleDownload = async (reportId) => {
    try {
      const data = await downloadReport(reportId);
      if (data.pdf_url) {
        window.open(data.pdf_url, '_blank');
      } else {
        toast.error('PDF not available for this report');
      }
    } catch (error) {
      toast.error('Failed to download report');
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (hours) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} mins`;
    }
    return `${hours.toFixed(1)} hrs`;
  };

  const getReportTypeColor = (type) => {
    const colors = {
      weekly: 'bg-blue-100 text-blue-800',
      monthly: 'bg-purple-100 text-purple-800',
      semester: 'bg-green-100 text-green-800',
      subject: 'bg-orange-100 text-orange-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.custom;
  };

  const setDateRange = (type) => {
    const end = new Date();
    const start = new Date();
    
    switch (type) {
      case 'weekly':
        start.setDate(end.getDate() - 7);
        setFormData(prev => ({
          ...prev,
          title: 'Weekly Report',
          report_type: 'weekly'
        }));
        break;
      case 'monthly':
        start.setMonth(end.getMonth() - 1);
        setFormData(prev => ({
          ...prev,
          title: 'Monthly Report',
          report_type: 'monthly'
        }));
        break;
      case 'semester':
        start.setMonth(end.getMonth() - 6);
        setFormData(prev => ({
          ...prev,
          title: 'Semester Report',
          report_type: 'semester'
        }));
        break;
      default:
        return;
    }
    
    setFormData(prev => ({
      ...prev,
      start_date: start.toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and view your learning reports</p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Generate Report
        </button>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold">{statistics.total_reports}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star size={24} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Favorites</p>
                <p className="text-2xl font-bold">{statistics.favorite_reports}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Study Time</p>
                <p className="text-2xl font-bold">
                  {formatDuration(statistics.total_study_hours)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold">
                  {Object.values(statistics.reports_by_type).reduce((a, b) => a + b, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        {['all', 'weekly', 'monthly', 'semester', 'favorites'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              filterType === type
                ? 'border-primary-600 text-primary-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : reports.length === 0 ? (
        <div className="card text-center py-12">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
          <p className="text-gray-600 mb-4">
            Generate your first report to track your learning progress
          </p>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Generate Report
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report.id} className="card group hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${getReportTypeColor(report.report_type)}`}>
                    {report.report_type}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-2 line-clamp-1">
                    {report.title}
                  </h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleToggleFavorite(report.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Star
                      size={18}
                      className={report.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Description */}
              {report.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {report.description}
                </p>
              )}

              {/* Date Range */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <Calendar size={16} />
                <span>
                  {formatDate(report.start_date)} - {formatDate(report.end_date)}
                </span>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                    <Video size={16} />
                  </div>
                  <p className="text-xs text-gray-600">Videos</p>
                  <p className="font-semibold">{report.videos_watched}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <Clock size={16} />
                  </div>
                  <p className="text-xs text-gray-600">Time</p>
                  <p className="font-semibold">{formatDuration(report.total_study_hours)}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                    <TrendingUp size={16} />
                  </div>
                  <p className="text-xs text-gray-600">Rate</p>
                  <p className="font-semibold">{report.completion_rate.toFixed(0)}%</p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>{report.view_count} views</span>
                </div>
                <span>{formatDate(report.generated_at)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(report.id)}
                  className="btn flex-1 flex items-center justify-center gap-2"
                  disabled={!report.pdf_generated}
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Generate Report</h2>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Quick Options */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Options</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setDateRange('weekly')}
                    className="btn text-sm"
                  >
                    Last Week
                  </button>
                  <button
                    onClick={() => setDateRange('monthly')}
                    className="btn text-sm"
                  >
                    Last Month
                  </button>
                  <button
                    onClick={() => setDateRange('semester')}
                    className="btn text-sm"
                  >
                    Last Semester
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleGenerateReport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input w-full"
                    placeholder="e.g., Weekly Progress Report"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type *
                  </label>
                  <select
                    value={formData.report_type}
                    onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
                    className="input w-full"
                    required
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="semester">Semester</option>
                    <option value="subject">Subject-specific</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="input w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input w-full"
                    rows={3}
                    placeholder="Add notes about this report..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="generate_pdf"
                    checked={formData.generate_pdf}
                    onChange={(e) => setFormData({ ...formData, generate_pdf: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="generate_pdf" className="text-sm text-gray-700">
                    Generate PDF (recommended)
                  </label>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGenerateModal(false)}
                    className="btn flex-1"
                    disabled={generating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                    disabled={generating}
                  >
                    {generating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        Generate Report
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;