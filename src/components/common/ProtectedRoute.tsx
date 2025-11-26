import { useAuth } from '@/hooks/useAuth';
import { Navigate } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import type { Perfil } from '@/types/auth.types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredProfiles: Perfil[];
  fallbackRoute?: string;
}

/**
 * Componente que protege rotas baseado no perfil do usuário
 * @param children - Componente a ser renderizado se autorizado
 * @param requiredProfiles - Array de perfis permitidos
 * @param fallbackRoute - Rota para redirecionar se não autorizado (default: /sign-in)
 */
export function ProtectedRoute({
  children,
  requiredProfiles,
  fallbackRoute = '/sign-in',
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to={fallbackRoute} />;
  }

  // Se está autenticado, verifica se tem perfil permitido
  if (user && requiredProfiles.includes(user.perfil)) {
    return <>{children}</>;
  }

  // Se não tem perfil permitido, redireciona para rota base ou login
  return <Navigate to={fallbackRoute} />;
}
