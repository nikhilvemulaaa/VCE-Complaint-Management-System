import React from 'react';
import { Home, MessageSquare, FileText, User, ChevronRight, Eye, MessageCircle } from 'lucide-react';
import { NavigationItem } from '../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const navigationItems: NavigationItem[] = [
    { id: 'home', label: 'Home', icon: 'Home', path: 'home' },
    { id: 'complaint-box', label: 'Complaint Box', icon: 'MessageSquare', path: 'complaint-box' },
    { id: 'view-complaints', label: 'Admin Complaints', icon: 'FileText', path: 'view-complaints' },
    { id: 'public-dashboard', label: 'Public Dashboard', icon: 'Eye', path: 'public-dashboard' },
    { id: 'feedback-module', label: 'Feedback Module', icon: 'MessageCircle', path: 'feedback-module' },
    { id: 'profile', label: 'Admin Profile', icon: 'User', path: 'profile' },
  ];

  const getIcon = (iconName: string) => {
    const icons = {
      Home: Home,
      MessageSquare: MessageSquare,
      FileText: FileText,
      User: User,
      Eye: Eye,
      MessageCircle: MessageCircle,
    };
    const IconComponent = icons[iconName as keyof typeof icons];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  return (
    <aside className="bg-gray-50 border-r border-gray-200 w-64 min-h-screen flex flex-col">
      <div className="p-6 flex-1">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200 group ${
                currentPage === item.path
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                {getIcon(item.icon)}
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight 
                className={`w-4 h-4 transition-transform ${
                  currentPage === item.path ? 'rotate-90' : 'group-hover:translate-x-1'
                }`} 
              />
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-6 mt-auto">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-800 font-medium mb-1">Need Help?</p>
          <p className="text-xs text-blue-600">Contact admin for assistance</p>
          <button 
            onClick={() => alert('Admin Contact: admin@vce.edu.in\nPhone: +91 8734 290 290\nOffice Hours: 9 AM - 5 PM')}
            className="mt-2 w-full bg-blue-600 text-white py-1 px-3 rounded text-xs hover:bg-blue-700 transition-colors"
          >
            Contact Admin
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;