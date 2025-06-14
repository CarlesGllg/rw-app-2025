
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  console.log('ProtectedRoute - User:', user, 'Loading:', loading, 'Path:', location.pathname);
  
  // Show loading state while checking authentication
  if (loading) {
    console.log('ProtectedRoute - Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Only redirect if the user isn't authenticated
  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to login');
    // Using replace: true avoids adding to history stack, preventing loops
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  console.log('ProtectedRoute - User authenticated, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
