import { Navigate } from "react-router-dom";
import { ProtectedRouteProps } from "../interfaces/protectedrouter.interfaces";

function ProtectedRoute({ token, children }: ProtectedRouteProps) {
  // Si no existe un token, redirige al usuario a la página de login
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  // Si el token existe, renderiza los elementos hijos (la página solicitada)
  return <>{children}</>;
}

export default ProtectedRoute;
