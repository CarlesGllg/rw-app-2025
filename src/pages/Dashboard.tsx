
import React from 'react';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentMessages from '@/components/dashboard/RecentMessages';
import StudentList from '@/components/dashboard/StudentList';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <WelcomeHeader />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <QuickActions />
          <RecentMessages />
        </div>
        <div className="space-y-6">
          <StudentList />
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
