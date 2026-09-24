import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { FullPageLoader } from '../components/ui/Loader.jsx';

export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullPageLoader text="Verifying session..." />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
