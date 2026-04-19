import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Employee, Entity } from "../types/auth.types";
import { mockAuthService } from "../services/mockAuthService";

interface AuthContextType {
  // State
  user: Employee | null;
  entity: Entity | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;

  // Actions
  login: (
    email: string
  ) => Promise<{ success: boolean; token?: string; error?: string }>;
  verifyMagicLink: (
    token: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Employee | null>(null);
  const [entity, setEntity] = useState<Entity | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial session
  useEffect(() => {
    const initAuth = () => {
      const session = mockAuthService.getSession();
      if (session) {
        const currentUser = mockAuthService.getCurrentUser();
        const currentEntity = mockAuthService.getCurrentEntity();
        setUser(currentUser);
        setEntity(currentEntity);
      }
      setIsLoading(false);
    };

    initAuth();

    // Check session validity periodically (every minute)
    const interval = setInterval(() => {
      const session = mockAuthService.getSession();
      if (!session && user) {
        // Session expired
        setUser(null);
        setEntity(null);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const login = useCallback(
    async (
      email: string
    ): Promise<{ success: boolean; token?: string; error?: string }> => {
      const result = await mockAuthService.requestMagicLink(email);
      return result;
    },
    []
  );

  const verifyMagicLink = useCallback(
    async (token: string): Promise<{ success: boolean; error?: string }> => {
      const result = await mockAuthService.verifyMagicLink(token);
      if (result.success && result.session) {
        const currentUser = mockAuthService.getCurrentUser();
        const currentEntity = mockAuthService.getCurrentEntity();
        setUser(currentUser);
        setEntity(currentEntity);
      }
      return result;
    },
    []
  );

  const logout = useCallback(() => {
    mockAuthService.logout();
    setUser(null);
    setEntity(null);
  }, []);

  const refreshUser = useCallback(() => {
    const currentUser = mockAuthService.getCurrentUser();
    const currentEntity = mockAuthService.getCurrentEntity();
    setUser(currentUser);
    setEntity(currentEntity);
  }, []);

  const value: AuthContextType = {
    user,
    entity,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: mockAuthService.isAdmin(),
    login,
    verifyMagicLink,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
