export interface ProtectedRouteProps {
    token: string | null | undefined; // Token puede ser un string, null o undefined
    children: React.ReactNode; // `children` puede ser cualquier cosa que React permita
  }