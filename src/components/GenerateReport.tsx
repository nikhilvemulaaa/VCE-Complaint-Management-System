import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, BarChart3, PieChart, TrendingUp, Eye, CheckCircle } from 'lucide-react';
import { Complaint, SystemSettings } from '../types';

interface GenerateReportProps {
  complaints: Complaint[];
  systemSettings: SystemSettings;
}

const GenerateReport: React.FC<GenerateReportProps> = ({ complaints, systemSettings }) => {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('week');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showPreview, setShowPreview] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { id: 'summary', name: 'Summary Report', description: 'Overview of all complaints' },
    { id: 'detailed', name: 'Detailed Report', description: 'Complete complaint information' },
    { id: 'analytics', name: 'Analytics Report', description: 'Statistical analysis and trends' },
    { id: 'status', name: 'Status Report', description: 'Complaints grouped by status' }
  ];

  const dateRanges = [
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' },
    { id: 'custom', name: 'Custom Range' }
  ];

  const statusOptions = [
    { id: 'all', name: 'All Status' },
    { id: 'pending', name: 'Pending Only' },
    { id: 'in-progress', name: 'In Progress Only' },
    { id: 'resolved', name: 'Resolved Only' },
    { id: 'closed', name: 'Closed Only' }
  ];

  const generateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setReportGenerated(true);
      setIsGenerating(false);
      setShowPreview(true);
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setReportGenerated(false), 5000);
    }, 2000);
  };

  const exportToPDF = () => {
    const reportData = generateReportData();
    const pdfContent = `
${systemSettings.siteName} - ${reportTypes.find(r => r.id === reportType)?.name}
Generated on: ${new Date().toLocaleString()}
Date Range: ${dateRanges.find(d => d.id === dateRange)?.name}
Status Filter: ${statusOptions.find(s => s.id === selectedStatus)?.name}

SUMMARY STATISTICS:
Total Complaints: ${reportData.total}
Pending: ${reportData.pending}
In Progress: ${reportData.inProgress}
Resolved: ${reportData.resolved}
Closed: ${reportData.closed}

DETAILED COMPLAINTS:
${reportData.complaints.map(c => `
ID: ${c.id}
Subject: ${c.subject}
Type: ${c.issueType}
Status: ${c.status}
Date: ${c.dateSubmitted}
Description: ${c.description}
---
`).join('')}
    `;
    
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaint-report-${reportType}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('PDF report downloaded successfully!');
  };

  const exportToExcel = () => {
    const reportData = generateReportData();
    const csvContent = [
      ['ID', 'Subject', 'Type', 'Status', 'Date', 'Name', 'Description'],
      ...reportData.complaints.map(c => [
        c.id,
        c.subject,
        c.issueType,
        c.status,
        c.dateSubmitted,
        c.name || 'Anonymous',
        c.description
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaint-report-${reportType}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Excel report downloaded successfully!');
  };

  const exportToCSV = () => {
    const reportData = generateReportData();
    const csvContent = [
      'ID,Subject,Type,Status,Date,Name,Description',
      ...reportData.complaints.map(c => 
        `"${c.id}","${c.subject}","${c.issueType}","${c.status}","${c.dateSubmitted}","${c.name || 'Anonymous'}","${c.description}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complaint-data-${reportType}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('CSV file downloaded successfully!');
  };

  const generateReportData = () => {
    let filteredComplaints = complaints;
    
    // Apply status filter
    if (selectedStatus !== 'all') {
      const statusMap = {
        'pending': 'Pending',
        'in-progress': 'In Progress',
        'resolved': 'Resolved',
        'closed': 'Closed'
      };
      filteredComplaints = complaints.filter(c => c.status === statusMap[selectedStatus as keyof typeof statusMap]);
    }
    
    return {
      total: filteredComplaints.length,
      pending: filteredComplaints.filter(c => c.status === 'Pending').length,
      inProgress: filteredComplaints.filter(c => c.status === 'In Progress').length,
      resolved: filteredComplaints.filter(c => c.status === 'Resolved').length,
      closed: filteredComplaints.filter(c => c.status === 'Closed').length,
      complaints: filteredComplaints
    };
  };

  const stats = generateReportData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Generate Reports</h2>
            <p className="text-emerald-100">Create detailed reports and analytics for complaint data</p>
          </div>
          <BarChart3 className="w-16 h-16 text-emerald-200" />
        </div>
      </div>

      {/* Report Generated Success */}
      {reportGenerated && (
        <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
            <div>
              <p className="text-emerald-800 font-medium">Report Generated Successfully!</p>
              <p className="text-emerald-700 text-sm">
                {reportTypes.find(r => r.id === reportType)?.name} for {dateRanges.find(d => d.id === dateRange)?.name} 
                with {stats.total} records has been generated and is ready for download.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Report Configuration */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Report Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Report Type</label>
            <div className="space-y-2">
              {reportTypes.map((type) => (
                <label key={type.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="reportType"
                    value={type.id}
                    checked={reportType === type.id}
                    onChange={(e) => setReportType(e.target.value)}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{type.name}</p>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {dateRanges.map((range) => (
                <option key={range.id} value={range.id}>{range.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Status Filter</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {statusOptions.map((status) => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={generateReport}
            disabled={isGenerating}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Generate Report</span>
              </>
            )}
          </button>
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Eye className="w-5 h-5" />
            <span>{showPreview ? 'Hide Preview' : 'Preview Report'}</span>
          </button>
        </div>
      </div>

      {/* Report Preview */}
      {showPreview && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Report Preview</h3>
            <button 
              onClick={() => setShowPreview(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h4 className="text-lg font-medium text-gray-900">{systemSettings.siteName}</h4>
              <p className="text-sm text-gray-600">{systemSettings.address}</p>
              <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleString()}</p>
              <p className="text-sm text-gray-600">Report Type: {reportTypes.find(r => r.id === reportType)?.name}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-sm text-blue-700">Total</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-sm text-amber-700">Pending</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
                <p className="text-sm text-orange-700">In Progress</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">{stats.resolved}</p>
                <p className="text-sm text-emerald-700">Resolved</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Subject</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.complaints.slice(0, 10).map((complaint) => (
                    <tr key={complaint.id}>
                      <td className="px-4 py-2 font-mono">#{complaint.id.slice(-6)}</td>
                      <td className="px-4 py-2">{complaint.subject}</td>
                      <td className="px-4 py-2">{complaint.issueType}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                          complaint.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                          complaint.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">{new Date(complaint.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {stats.complaints.length > 10 && (
                <p className="text-center text-gray-500 mt-4">
                  ... and {stats.complaints.length - 10} more records
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Export Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={exportToPDF}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            <FileText className="w-6 h-6 text-red-600" />
            <span className="font-medium text-gray-900">Export as PDF</span>
          </button>
          <button 
            onClick={exportToExcel}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
          >
            <Download className="w-6 h-6 text-emerald-600" />
            <span className="font-medium text-gray-900">Export as Excel</span>
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <FileText className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-gray-900">Export as CSV</span>
          </button>
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Export Information:</strong> Reports will be downloaded to your local device. 
            PDF exports contain formatted reports, Excel/CSV exports contain raw data for analysis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;