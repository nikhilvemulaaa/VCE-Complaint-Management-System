import React from 'react';
import { Eye, BarChart3, Users, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Complaint, SystemSettings } from '../types';

interface PublicDashboardProps {
  complaints: Complaint[];
  systemSettings: SystemSettings;
}

const PublicDashboard: React.FC<PublicDashboardProps> = ({ complaints, systemSettings }) => {
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;
  const closedComplaints = complaints.filter(c => c.status === 'Closed').length;

  const issueTypeStats = complaints.reduce((acc, complaint) => {
    acc[complaint.issueType] = (acc[complaint.issueType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentComplaints = complaints.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Public Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Public Complaint Dashboard</h2>
            <p className="text-blue-100 text-lg">{systemSettings.siteName}</p>
            <p className="text-blue-200 text-sm">{systemSettings.address}</p>
            <div className="mt-4 text-sm">
              <p>Transparency in action - Real-time complaint tracking for our community</p>
            </div>
          </div>
          <Eye className="w-16 h-16 text-blue-200" />
        </div>
      </div>

      {/* Public Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalComplaints}</p>
          <p className="text-sm text-gray-600">Total Complaints</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{resolvedComplaints}</p>
          <p className="text-sm text-gray-600">Resolved</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-600">{inProgressComplaints}</p>
          <p className="text-sm text-gray-600">In Progress</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{pendingComplaints}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-gray-600" />
          </div>
          <p className="text-2xl font-bold text-gray-600">{closedComplaints}</p>
          <p className="text-sm text-gray-600">Closed</p>
        </div>
      </div>

      {/* Issue Type Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Complaint Categories</h3>
        <div className="space-y-4">
          {Object.entries(issueTypeStats).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">{type}</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(count / totalComplaints) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Public Complaints */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Complaints (Public View)</h3>
        <div className="space-y-4">
          {recentComplaints.map((complaint) => (
            <div key={complaint.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{complaint.subject}</h4>
                  <p className="text-sm text-blue-600 mt-1">{complaint.issueType}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{complaint.description}</p>
                  <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                    <span>ID: #{complaint.id.slice(-6)}</span>
                    <span>Date: {new Date(complaint.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span>By: {complaint.name || 'Anonymous'}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                  complaint.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                  complaint.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {complaint.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Public Information */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">About This Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Transparency Commitment</h4>
            <p className="text-sm text-blue-700">
              This public dashboard provides real-time visibility into our complaint resolution process. 
              We believe in transparency and accountability in addressing student concerns.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">How to Submit</h4>
            <p className="text-sm text-blue-700">
              Students can submit complaints through our secure complaint box. All submissions are 
              tracked and updated in real-time for complete transparency.
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Contact Information</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>Email: {systemSettings.adminEmail}</p>
            <p>Phone: {systemSettings.contactPhone}</p>
            <p>Address: {systemSettings.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;