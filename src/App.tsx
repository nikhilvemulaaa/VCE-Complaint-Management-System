import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ComplaintForm from './components/ComplaintForm';
import ViewComplaints from './components/ViewComplaints';
import Profile from './components/Profile';
import SystemStatus from './components/SystemStatus';
import QuickActions from './components/QuickActions';
import GenerateReport from './components/GenerateReport';
import SystemSettings from './components/SystemSettings';
import Notifications from './components/Notifications';
import PublicDashboard from './components/PublicDashboard';
import FeedbackModule from './components/FeedbackModule';
import useLocalStorage from './hooks/useLocalStorage';
import { Complaint, AdminProfile, SystemSettings as SystemSettingsType } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [complaints, setComplaints] = useLocalStorage<Complaint[]>('vce-complaints', []);
  const [adminProfile, setAdminProfile] = useLocalStorage<AdminProfile>('vce-admin-profile', {
    name: 'Admin User',
    email: 'admin@vce.edu.in',
    phone: '+91 8734 290 290',
    department: 'Administration'
  });
  const [systemSettings, setSystemSettings] = useLocalStorage<SystemSettingsType>('vce-system-settings', {
    siteName: 'VCE Complaint Management',
    adminEmail: 'admin@vce.edu.in',
    contactPhone: '+91 8734 290 290',
    address: 'Thimmapur, Karimnagar',
    timezone: 'Asia/Kolkata',
    language: 'English',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    instantAlerts: true,
    maintenanceNotices: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelist: false,
    auditLogging: true,
    allowRegistration: false,
    requireEmailVerification: true,
    defaultRole: 'student',
    maxUsers: 1000,
    accountApproval: true,
    bulkImport: false,
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 30,
    compressionEnabled: true
  });

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setShowNotifications(false);
  };

  const handleShowNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleSubmitComplaint = (complaintData: Omit<Complaint, 'id' | 'dateSubmitted' | 'status'>) => {
    const newComplaint: Complaint = {
      ...complaintData,
      id: `CMP-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      dateSubmitted: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      status: 'Pending',
    };

    setComplaints(prev => [newComplaint, ...prev]);
  };

  const handleUpdateStatus = (id: string, status: Complaint['status']) => {
    setComplaints(prev => prev.map(complaint =>
      complaint.id === id ? { ...complaint, status } : complaint
    ));
  };

  const handleDeleteComplaint = (id: string) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      setComplaints(prev => prev.filter(complaint => complaint.id !== id));
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Dashboard complaints={complaints} onNavigate={handleNavigate} systemSettings={systemSettings} />;
      case 'complaint-box':
        return <ComplaintForm onSubmit={handleSubmitComplaint} systemSettings={systemSettings} />;
      case 'view-complaints':
        return (
          <ViewComplaints
            complaints={complaints}
            onUpdateStatus={handleUpdateStatus}
            onDeleteComplaint={handleDeleteComplaint}
          />
        );
      case 'profile':
        return <Profile adminProfile={adminProfile} onUpdateProfile={setAdminProfile} />;
      case 'system-status':
        return <SystemStatus complaints={complaints} systemSettings={systemSettings} />;
      case 'quick-actions':
        return <QuickActions onNavigate={handleNavigate} />;
      case 'generate-report':
        return <GenerateReport complaints={complaints} systemSettings={systemSettings} />;
      case 'system-settings':
        return <SystemSettings settings={systemSettings} onUpdateSettings={setSystemSettings} />;
      case 'public-dashboard':
        return <PublicDashboard complaints={complaints} systemSettings={systemSettings} />;
      case 'feedback-module':
        return <FeedbackModule complaints={complaints} />;
      default:
        return <Dashboard complaints={complaints} onNavigate={handleNavigate} systemSettings={systemSettings} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
        <div className="flex-1">
          <Header 
            currentPage={currentPage} 
            onShowNotifications={handleShowNotifications}
            onNavigate={handleNavigate}
            adminProfile={adminProfile}
            systemSettings={systemSettings}
          />
          {showNotifications && (
            <Notifications onClose={() => setShowNotifications(false)} complaints={complaints} />
          )}
          <main className="p-8">
            {renderPage()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;