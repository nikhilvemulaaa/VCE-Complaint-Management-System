import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ComplaintForm from './components/ComplaintForm';
import Profile from './components/Profile';
import SystemStatus from './components/SystemStatus';
import QuickActions from './components/QuickActions';
import GenerateReport from './components/GenerateReport';
import SystemSettings from './components/SystemSettings';
import Notifications from './components/Notifications';
import PublicDashboard from './components/PublicDashboard';
import FeedbackModule from './components/FeedbackModule';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import ForgotPasswordForm from './components/Auth/ForgotPasswordForm';
import useLocalStorage from './hooks/useLocalStorage';
import { saveComplaint, getComplaints, saveFeedback, getFeedbacks } from './lib/supabase';
import { Complaint, AdminProfile, SystemSettings as SystemSettingsType, User } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showNotifications, setShowNotifications] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot' | 'authenticated'>('login');
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('vce-current-user', null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [users, setUsers] = useLocalStorage<User[]>('vce-users', [
    {
      id: 'admin-1',
      email: 'admin@vce.edu.in',
      name: 'Admin User',
      role: 'admin',
      department: 'Administration',
      created_at: new Date().toISOString()
    },
    {
      id: 'student-1',
      email: 'student@vce.edu.in',
      name: 'Student User',
      role: 'student',
      rollNumber: 'VCE2024001',
      department: 'Computer Science Engineering',
      created_at: new Date().toISOString()
    }
  ]);

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

  // Load data on component mount
  useEffect(() => {
    loadComplaints();
    loadFeedbacks();
  }, []);

  // Set auth mode based on current user
  useEffect(() => {
    setAuthMode(currentUser ? 'authenticated' : 'login');
  }, [currentUser]);

  const loadComplaints = async () => {
    try {
      const data = await getComplaints();
      setComplaints(data);
    } catch (error) {
      console.error('Error loading complaints:', error);
    }
  };

  const loadFeedbacks = async () => {
    try {
      const data = await getFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    }
  };

  const handleLogin = async (email: string, password: string, role: 'student' | 'admin'): Promise<boolean> => {
    // Demo authentication - in production, this would be handled by Supabase Auth
    const demoCredentials = {
      'admin@vce.edu.in': { password: 'admin123', role: 'admin' },
      'student@vce.edu.in': { password: 'student123', role: 'student' }
    };

    const user = users.find(u => u.email === email);
    const demo = demoCredentials[email as keyof typeof demoCredentials];

    if (user && demo && demo.password === password && demo.role === role) {
      setCurrentUser(user);
      return true;
    }

    return false;
  };

  const handleSignup = async (userData: any): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        return false;
      }

      const newUser: User = {
        id: `${userData.role}-${Date.now()}`,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        rollNumber: userData.rollNumber,
        department: userData.department,
        created_at: new Date().toISOString()
      };

      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const handleForgotPassword = async (email: string): Promise<boolean> => {
    // Demo implementation - in production, this would send actual reset emails
    const user = users.find(u => u.email === email);
    return !!user;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
    setShowNotifications(false);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setShowNotifications(false);
  };

  const handleShowNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleSubmitComplaint = async (complaintData: Omit<Complaint, 'id' | 'dateSubmitted' | 'status'>) => {
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

    try {
      const savedComplaint = await saveComplaint(newComplaint);
      setComplaints(prev => [savedComplaint, ...prev]);
    } catch (error) {
      console.error('Error saving complaint:', error);
      // Fallback to local storage
      setComplaints(prev => [newComplaint, ...prev]);
    }
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

  // Authentication screens
  if (authMode === 'login') {
    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToSignup={() => setAuthMode('signup')}
        onForgotPassword={() => setAuthMode('forgot')}
      />
    );
  }

  if (authMode === 'signup') {
    return (
      <SignupForm
        onSignup={handleSignup}
        onSwitchToLogin={() => setAuthMode('login')}
      />
    );
  }

  if (authMode === 'forgot') {
    return (
      <ForgotPasswordForm
        onBackToLogin={() => setAuthMode('login')}
        onResetPassword={handleForgotPassword}
      />
    );
  }

  // Main application
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Dashboard complaints={complaints} onNavigate={handleNavigate} systemSettings={systemSettings} />;
      case 'complaint-box':
        return <ComplaintForm onSubmit={handleSubmitComplaint} systemSettings={systemSettings} />;
      case 'profile':
        return currentUser?.role === 'admin' ? (
          <Profile 
            adminProfile={adminProfile} 
            onUpdateProfile={setAdminProfile}
            complaints={complaints}
            onUpdateStatus={handleUpdateStatus}
            onDeleteComplaint={handleDeleteComplaint}
          />
        ) : null;
      case 'system-status':
        return <SystemStatus complaints={complaints} systemSettings={systemSettings} />;
      case 'quick-actions':
        return <QuickActions onNavigate={handleNavigate} />;
      case 'generate-report':
        return <GenerateReport complaints={complaints} systemSettings={systemSettings} />;
      case 'system-settings':
        return currentUser?.role === 'admin' ? (
          <SystemSettings settings={systemSettings} onUpdateSettings={setSystemSettings} />
        ) : null;
      case 'public-dashboard':
        return <PublicDashboard complaints={complaints} systemSettings={systemSettings} />;
      case 'feedback-module':
        return <FeedbackModule complaints={complaints} />;
      default:
        return <Dashboard complaints={complaints} onNavigate={handleNavigate} systemSettings={systemSettings} />;
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={handleNavigate}
          userRole={currentUser.role}
          onLogout={handleLogout}
        />
        <div className="flex-1">
          <Header 
            currentPage={currentPage} 
            onShowNotifications={handleShowNotifications}
            onNavigate={handleNavigate}
            adminProfile={adminProfile}
            systemSettings={systemSettings}
            userRole={currentUser.role}
            userName={currentUser.name}
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