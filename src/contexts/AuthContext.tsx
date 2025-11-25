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
    const initAuth = () => {
      try {
        const storedToken = authService.getToken();
        const storedUser = authService.getUser();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          // Não valida o token automaticamente para evitar requisições extras
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
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

  // Função para atualizar usuário
  const updateUser = (updatedUser: Usuario): void => {
    setUser(updatedUser);
    if (token) {
      authService.saveAuth(token, updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    setUser: updateUser,
    isAuthenticated: !!user && !!token,
  };

  // O AuthProvider agora renderiza mesmo durante loading
  // O ProtectedRoute cuidará de mostrar "Carregando..." se necessário
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
