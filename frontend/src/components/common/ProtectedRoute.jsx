import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSkeleton from './LoadingSkeleton';

// DEMO MODE ENABLED — restore original redirect logic by removing the DEMO_MODE bypass below
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-5">
        <LoadingSkeleton rows={5} height={24} />
      </div>
    );
  }

  // DEMO MODE ENABLED — bypassing auth check, always allow access
  // Original: if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
