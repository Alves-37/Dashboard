import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário e token do localStorage ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  // Função para login
  async function login({ email, senha }) {
    setLoading(true);
    // Login real no backend admin
    try {
      if (!email || !senha) {
        throw new Error('Email e senha são obrigatórios');
      }
      const response = await api.post('/admin/auth/login', { email, senha });
      const { token, user } = response.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setLoading(false);
      return user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  // Função para registro + login automático
  async function register({ nome, email, senha, tipo }) {
    setLoading(true);
    try {
      await api.post('/auth/register', { nome, email, senha, tipo });
      // Login automático após registro
      const user = await login({ email, senha });
      setLoading(false);
      return user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  // Função para atualizar perfil
  async function updateProfile(updates) {
    if (!user) return;
    setLoading(true);
    
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await api.put(`/users/${user.id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.setItem(USER_KEY, JSON.stringify(response.data));
      setUser(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  // Função para excluir conta
  async function deleteAccount() {
    if (!user) return;
    setLoading(true);
    
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await api.delete(`/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Limpar dados locais
      logout();
      return response.data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete api.defaults.headers.common['Authorization'];
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser,
      login, 
      logout, 
      register, 
      updateProfile,
      deleteAccount,
      isAuthenticated: !!user,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
