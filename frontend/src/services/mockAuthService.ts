import type {
  Entity,
  Employee,
  EmployeeRole,
  AuthSession,
  MagicLinkToken,
  EntityType,
} from "../types";

// Mock data storage
const entities: Entity[] = [
  {
    id: "ent-1",
    name: "Red Cross Disaster Relief",
    type: "NGO" as EntityType,
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=RC&backgroundColor=e53935",
    description: "International humanitarian NGO providing disaster relief and emergency assistance worldwide.",
    website: "https://www.redcross.org",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "ent-2",
    name: "Istanbul Technical University",
    type: "University" as EntityType,
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=ITU&backgroundColor=1565c0",
    description: "Leading technical university conducting disaster research and coordination.",
    website: "https://www.itu.edu.tr",
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-02-20T00:00:00Z",
  },
  {
    id: "ent-3",
    name: "Emergency Response Corp",
    type: "Company" as EntityType,
    logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=ERC&backgroundColor=2e7d32",
    description: "Private emergency response company providing rapid disaster relief services.",
    website: "https://www.emergencyresponse.com",
    createdAt: "2024-03-10T00:00:00Z",
    updatedAt: "2024-03-10T00:00:00Z",
  },
];

const employees: Employee[] = [
  // Red Cross employees
  {
    id: "emp-1",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@redcross.org",
    entityId: "ent-1",
    role: "ADMIN" as EmployeeRole,
    enabled: true,
    createdAt: "2024-01-15T00:00:00Z",
    lastLoginAt: "2024-04-15T10:30:00Z",
  },
  {
    id: "emp-2",
    fullName: "Michael Chen",
    email: "michael.chen@redcross.org",
    entityId: "ent-1",
    role: "USER" as EmployeeRole,
    enabled: true,
    createdAt: "2024-01-20T00:00:00Z",
    lastLoginAt: "2024-04-14T14:20:00Z",
  },
  {
    id: "emp-3",
    fullName: "Emily Rodriguez",
    email: "emily.rodriguez@redcross.org",
    entityId: "ent-1",
    role: "USER" as EmployeeRole,
    enabled: false, // Disabled employee example
    createdAt: "2024-02-01T00:00:00Z",
    lastLoginAt: "2024-03-10T09:15:00Z",
  },
  // ITU employees
  {
    id: "emp-4",
    fullName: "Prof. Ahmet Yilmaz",
    email: "yilmaz@itu.edu.tr",
    entityId: "ent-2",
    role: "ADMIN" as EmployeeRole,
    enabled: true,
    createdAt: "2024-02-20T00:00:00Z",
    lastLoginAt: "2024-04-19T08:45:00Z",
  },
  {
    id: "emp-5",
    fullName: "Dr. Zeynep Kaya",
    email: "kaya@itu.edu.tr",
    entityId: "ent-2",
    role: "USER" as EmployeeRole,
    enabled: true,
    createdAt: "2024-02-25T00:00:00Z",
    lastLoginAt: "2024-04-18T16:30:00Z",
  },
  // ERC employees
  {
    id: "emp-6",
    fullName: "James Wilson",
    email: "james.wilson@emergencyresponse.com",
    entityId: "ent-3",
    role: "ADMIN" as EmployeeRole,
    enabled: true,
    createdAt: "2024-03-10T00:00:00Z",
    lastLoginAt: "2024-04-19T11:20:00Z",
  },
  {
    id: "emp-7",
    fullName: "Lisa Thompson",
    email: "lisa.thompson@emergencyresponse.com",
    entityId: "ent-3",
    role: "USER" as EmployeeRole,
    enabled: true,
    createdAt: "2024-03-15T00:00:00Z",
    lastLoginAt: "2024-04-17T13:45:00Z",
  },
];

// Store current session (simulating localStorage)
let currentSession: AuthSession | null = null;

// Helper functions
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const addHours = (date: Date, hours: number) => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// localStorage helpers for magic link tokens
const getMagicLinkTokens = (): MagicLinkToken[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("magic_link_tokens");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const saveMagicLinkTokens = (tokens: MagicLinkToken[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("magic_link_tokens", JSON.stringify(tokens));
  }
};

const addMagicLinkToken = (token: MagicLinkToken) => {
  const tokens = getMagicLinkTokens();
  tokens.push(token);
  saveMagicLinkTokens(tokens);
};

const findMagicLinkToken = (token: string): MagicLinkToken | undefined => {
  const tokens = getMagicLinkTokens();
  return tokens.find((t) => t.token === token);
};

const updateMagicLinkToken = (token: string, updates: Partial<MagicLinkToken>) => {
  const tokens = getMagicLinkTokens();
  const index = tokens.findIndex((t) => t.token === token);
  if (index !== -1) {
    tokens[index] = { ...tokens[index], ...updates };
    saveMagicLinkTokens(tokens);
  }
};

// Clean up expired tokens periodically
const cleanupExpiredTokens = () => {
  const tokens = getMagicLinkTokens();
  const now = new Date().toISOString();
  const validTokens = tokens.filter((t) => t.expiresAt > now && !t.used);
  if (validTokens.length !== tokens.length) {
    saveMagicLinkTokens(validTokens);
  }
};

// Load session from localStorage on init
const loadSessionFromStorage = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("auth_session");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AuthSession;
        // Check if session is still valid
        if (new Date(parsed.expiresAt) > new Date()) {
          currentSession = parsed;
        } else {
          localStorage.removeItem("auth_session");
        }
      } catch {
        localStorage.removeItem("auth_session");
      }
    }
    // Cleanup expired tokens on init
    cleanupExpiredTokens();
  }
};

// Initialize session from storage
loadSessionFromStorage();

export const mockAuthService = {
  // Get current session
  getSession: (): AuthSession | null => {
    if (!currentSession) return null;
    // Check if expired
    if (new Date(currentSession.expiresAt) < new Date()) {
      mockAuthService.logout();
      return null;
    }
    return currentSession;
  },

  // Get current user
  getCurrentUser: (): Employee | null => {
    const session = mockAuthService.getSession();
    if (!session) return null;
    return employees.find((e) => e.id === session.userId) || null;
  },

  // Get current entity
  getCurrentEntity: (): Entity | null => {
    const session = mockAuthService.getSession();
    if (!session) return null;
    return entities.find((e) => e.id === session.entityId) || null;
  },

  // Request magic link (simulates sending email)
  requestMagicLink: async (email: string): Promise<{ success: boolean; token?: string; error?: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const employee = employees.find((e) => e.email.toLowerCase() === email.toLowerCase());
    if (!employee) {
      return { success: false, error: "No account found with this email" };
    }

    if (!employee.enabled) {
      return { success: false, error: "Account has been disabled. Contact your administrator." };
    }

    // Generate magic link token (valid for 6 hours)
    const token: MagicLinkToken = {
      token: generateId("token"),
      email: employee.email,
      employeeId: employee.id,
      expiresAt: addHours(new Date(), 6).toISOString(),
      used: false,
    };

    // Store token in localStorage for persistence across reloads
    addMagicLinkToken(token);

    // For development: return token so we can display it
    return { success: true, token: token.token };
  },

  // Verify magic link and create session
  verifyMagicLink: async (token: string): Promise<{ success: boolean; session?: AuthSession; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const magicToken = findMagicLinkToken(token);
    if (!magicToken) {
      return { success: false, error: "Invalid or expired link" };
    }

    if (magicToken.used) {
      return { success: false, error: "This link has already been used" };
    }

    if (new Date(magicToken.expiresAt) < new Date()) {
      return { success: false, error: "Link has expired. Please request a new one." };
    }

    const employee = employees.find((e) => e.id === magicToken.employeeId);
    if (!employee) {
      return { success: false, error: "Employee not found" };
    }

    if (!employee.enabled) {
      return { success: false, error: "Account has been disabled" };
    }

    // Mark token as used in localStorage
    updateMagicLinkToken(token, { used: true });

    // Create session (valid for 7 days)
    const session: AuthSession = {
      token: generateId("session"),
      userId: employee.id,
      entityId: employee.entityId,
      role: employee.role,
      expiresAt: addDays(new Date(), 7).toISOString(),
    };

    currentSession = session;

    // Update last login
    employee.lastLoginAt = new Date().toISOString();

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_session", JSON.stringify(session));
    }

    return { success: true, session };
  },

  // Logout
  logout: () => {
    currentSession = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_session");
    }
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const session = mockAuthService.getSession();
    return session?.role === "ADMIN";
  },

  // Get all employees for current entity (ADMIN only)
  getEntityEmployees: (): Employee[] => {
    const session = mockAuthService.getSession();
    if (!session) return [];
    return employees.filter((e) => e.entityId === session.entityId);
  },

  // Add new employee (ADMIN only)
  addEmployee: async (data: {
    fullName: string;
    email: string;
    role: EmployeeRole;
  }): Promise<{ success: boolean; employee?: Employee; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const session = mockAuthService.getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    if (session.role !== "ADMIN") {
      return { success: false, error: "Only admins can add employees" };
    }

    // Check if email already exists
    if (employees.some((e) => e.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: "An employee with this email already exists" };
    }

    const newEmployee: Employee = {
      id: generateId("emp"),
      fullName: data.fullName,
      email: data.email,
      entityId: session.entityId,
      role: data.role,
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    employees.push(newEmployee);

    return { success: true, employee: newEmployee };
  },

  // Edit employee (ADMIN only)
  editEmployee: async (
    employeeId: string,
    data: Partial<Pick<Employee, "fullName" | "role" | "enabled">>
  ): Promise<{ success: boolean; employee?: Employee; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const session = mockAuthService.getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    if (session.role !== "ADMIN") {
      return { success: false, error: "Only admins can edit employees" };
    }

    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) {
      return { success: false, error: "Employee not found" };
    }

    // Can't edit yourself's role if you're the only admin
    if (employeeId === session.userId && data.role && data.role !== "ADMIN") {
      const entityAdmins = employees.filter(
        (e) => e.entityId === session.entityId && e.role === "ADMIN" && e.enabled && e.id !== employeeId
      );
      if (entityAdmins.length === 0) {
        return { success: false, error: "Cannot demote yourself - you are the only admin" };
      }
    }

    if (data.fullName !== undefined) employee.fullName = data.fullName;
    if (data.role !== undefined) employee.role = data.role;
    if (data.enabled !== undefined) employee.enabled = data.enabled;

    return { success: true, employee };
  },

  // Update entity (ADMIN only)
  updateEntity: async (
    data: Partial<Pick<Entity, "name" | "logoUrl" | "description" | "website">>
  ): Promise<{ success: boolean; entity?: Entity; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const session = mockAuthService.getSession();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    if (session.role !== "ADMIN") {
      return { success: false, error: "Only admins can update entity" };
    }

    const entity = entities.find((e) => e.id === session.entityId);
    if (!entity) {
      return { success: false, error: "Entity not found" };
    }

    if (data.name !== undefined) entity.name = data.name;
    if (data.logoUrl !== undefined) entity.logoUrl = data.logoUrl;
    if (data.description !== undefined) entity.description = data.description;
    if (data.website !== undefined) entity.website = data.website;
    entity.updatedAt = new Date().toISOString();

    return { success: true, entity };
  },

  // For development: get all test credentials
  getTestCredentials: (): { email: string; password: null; role: EmployeeRole; entity: string }[] => {
    return employees.map((e) => ({
      email: e.email,
      password: null,
      role: e.role,
      entity: entities.find((ent) => ent.id === e.entityId)?.name || "Unknown",
    }));
  },
};
