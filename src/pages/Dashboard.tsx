
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentMessages from '@/components/dashboard/RecentMessages';
import StudentList from '@/components/dashboard/StudentList';
import UpcomingEvents from '@/components/dashboard/UpcomingEvents';
import AppLayout from '@/components/layout/AppLayout';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Event } from '@/types/database';

const Dashboard = () => {
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch students associated with the parent
        const { data: studentParentData } = await supabase
          .from('student_parent')
          .select('student_id')
          .eq('parent_id', user.id);

        if (studentParentData?.length) {
          const studentIds = studentParentData.map(sp => sp.student_id);
          
          // Get students data
          const { data: studentsData } = await supabase
            .from('students')
            .select('*')
            .in('id', studentIds);
            
          if (studentsData) {
            setStudents(studentsData);
          }
          
          // Get recent messages for these students
          const { data: messagesData } = await supabase
            .from('message_student')
            .select(`
              id,
              message_id,
              student_id,
              read,
              messages:message_id(id, title, content, date, priority, sender),
              students:student_id(id, first_name, last_name1)
            `)
            .in('student_id', studentIds)
            .order('created_at', { ascending: false })
            .limit(5);
            
          if (messagesData) {
            const formattedMessages = messagesData.map(item => ({
              id: item.message_id,
              title: item.messages.title,
              content: item.messages.content,
              date: item.messages.date,
              sender: item.messages.sender,
              priority: item.messages.priority,
              student_id: item.student_id,
              student_first_name: item.students.first_name,
              student_last_name1: item.students.last_name1,
              read: item.read,
            }));
            
            setMessages(formattedMessages);
          }
        }
        
        // Get upcoming events
        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .gte('start_date', new Date().toISOString())
          .order('start_date', { ascending: true })
          .limit(5);
          
        if (eventsData) {
          setEvents(eventsData);
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  const handleMarkAsRead = async (messageId: string, studentId: string) => {
    try {
      await supabase
        .from('message_student')
        .update({ read: true })
        .eq('message_id', messageId)
        .eq('student_id', studentId);
      
      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId && msg.student_id === studentId 
            ? { ...msg, read: true } 
            : msg
        )
      );
      
      toast.success('Mensaje marcado como leído');
    } catch (error) {
      console.error("Error marking message as read:", error);
      toast.error('Error al marcar como leído');
    }
  };

  return (
    <AppLayout title="Dashboard">
      <div className="p-6 space-y-6">
        <WelcomeHeader user={user} />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <QuickActions />
            <RecentMessages 
              messages={messages} 
              onMarkAsRead={handleMarkAsRead} 
            />
          </div>
          <div className="space-y-6">
            <StudentList students={students} />
            <UpcomingEvents events={events} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
