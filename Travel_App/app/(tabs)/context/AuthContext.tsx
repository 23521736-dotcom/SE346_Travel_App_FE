import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import * as authApi from '../../../lib/api/auth';
import { fetchMe } from '../../../lib/api/users';
import { getAccessToken } from '../../../lib/api/client';
import { getApiErrorMessage } from '../../../lib/api/client';
import type { ApiUser } from '../../../lib/api/types';

export type UserType = {
  id: number;
  name: string;
  role: string;
  email: string;
  fullName: string | null;
  username: string | null;
  location: string | null;
  avatarUrl: string | null;
};

interface AuthContextData {
  user: UserType | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function mapUser(u: ApiUser): UserType {
  return {
    id: u.id,
    name: u.name,
    role: u.role.toLowerCase(),
    email: u.email,
    fullName: u.fullName,
    username: u.username,
    location: u.location,
    avatarUrl: u.avatarUrl,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const me = await fetchMe();
    setUser(mapUser(me));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          await refreshUser();
        }
      } catch {
        await authApi.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const { user: apiUser } = await authApi.login(email, password);
    setUser(mapUser(apiUser));
  };

  const register = async (email: string, password: string, fullName?: string) => {
    const { user: apiUser } = await authApi.register(email, password, fullName);
    setUser(mapUser(apiUser));
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export { getApiErrorMessage };
