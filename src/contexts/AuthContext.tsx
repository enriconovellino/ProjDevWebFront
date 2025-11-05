// Context de autenticação global

import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { handleApiError } from '../services/api';
import type { Usuario, LoginRequest, AuthContextType } from '../types/auth.types';

// Cria o contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Verifica se há usuário logado ao carregar a aplicação
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = authService.getToken();
        const storedUser = authService.getUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);

          // Valida o token buscando o perfil do usuário
          try {
            const currentUser = await authService.getPerfil();
            setUser(currentUser);
            authService.saveAuth(storedToken, currentUser);
          } catch (error) {
            // Token inválido, faz logout
            console.error('Token inválido:', handleApiError(error));
            authService.clearAuth();
            setUser(null);
            setToken(null);
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        authService.clearAuth();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Função de login
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      const response = await authService.login(credentials);

      // Salva token e usuário
      authService.saveAuth(response.token, response.usuario);
      setToken(response.token);
      setUser(response.usuario);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  };

  // Função de logout
  const logout = (): void => {
    authService.clearAuth();
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  // Exibe loading enquanto inicializa
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Carregando...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
