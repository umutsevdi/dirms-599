import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { Employee, Entity } from "../types/auth.types";
import { apiAuthService } from "../services/apiAuthService";

interface AuthContextType {
  user: Employee | null;
  entity: Entity | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;

  login: (
    email: string
  ) => Promise<{ success: boolean; token?: string; error?: string }>;
  verifyMagicLink: (
    token: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Employee | null>(null);
  const [entity, setEntity] = useState<Entity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const initAuth = async () => {
      const session = apiAuthService.getSession();
      if (session) {
        const [currentUser, currentEntity] = await Promise.all([
          apiAuthService.getCurrentUser(),
          apiAuthService.getCurrentEntity(),
        ]);
        setUser(currentUser);
        setEntity(currentEntity);
      }
      setIsLoading(false);
    };

    initAuth();

    const interval = setInterval(() => {
      const session = apiAuthService.getSession();
      if (!session && userRef.current) {
        setUser(null);
        setEntity(null);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const login = useCallback(
    async (
      email: string
    ): Promise<{ success: boolean; token?: string; error?: string }> => {
      const result = await apiAuthService.requestMagicLink(email);
      return result;
    },
    []
  );

  const verifyMagicLink = useCallback(
    async (token: string): Promise<{ success: boolean; error?: string }> => {
      const result = await apiAuthService.verifyMagicLink(token);
      if (result.success && result.session) {
        const [currentUser, currentEntity] = await Promise.all([
          apiAuthService.getCurrentUser(),
          apiAuthService.getCurrentEntity(),
        ]);
        setUser(currentUser);
        setEntity(currentEntity);
      }
      return result;
    },
    []
  );

  const logout = useCallback(async () => {
    await apiAuthService.logout();
    setUser(null);
    setEntity(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const [currentUser, currentEntity] = await Promise.all([
      apiAuthService.getCurrentUser(),
      apiAuthService.getCurrentEntity(),
    ]);
    setUser(currentUser);
    setEntity(currentEntity);
  }, []);

  const value: AuthContextType = {
    user,
    entity,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: apiAuthService.isAdmin(),
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
