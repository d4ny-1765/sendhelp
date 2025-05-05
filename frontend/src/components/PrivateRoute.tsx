import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { JSX } from 'react';
export const PrivateRoute:React.FC<{children:JSX.Element}> = ({children})=>{
  const { auth } = useAuth();
  return auth ? children : <Navigate to="/login" replace />;
};