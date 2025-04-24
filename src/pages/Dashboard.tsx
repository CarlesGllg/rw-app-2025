
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentMessages from '@/components/dashboard/RecentMessages';
import StudentList from '@/components/dashboard/StudentList';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import { MessagePriority } from '@/types/database';
import AppLayout from '@/components/layout/AppLayout';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Empty data for components until real data is fetched
  const emptyMessages = [];
  const emptyStudents = [];
  const emptyEvents = [];
  
  const handleMarkAsRead = (messageId: string, studentId: string) => {
    console.log('Marking message as read', messageId, studentId);
    // Implementation will be added when needed
  };

  return (
    <AppLayout title="Dashboard">
      <div className="p-6 space-y-6">
        <WelcomeHeader user={user || { 
          id: '',
          email: '',
          role: 'parent',
          full_name: 'Usuario',
          created_at: '',
          updated_at: ''
        }} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <QuickActions />
            <RecentMessages 
              messages={emptyMessages} 
              onMarkAsRead={handleMarkAsRead} 
            />
          </div>
          <div className="space-y-6">
            <StudentList students={emptyStudents} />
            <UpcomingEvents events={emptyEvents} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
