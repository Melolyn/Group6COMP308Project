import type { LoginFormData, RegisterFormData, User } from "../types/user";

const mockUser: User = {
  id: "u1",
  firstName: "Lynn",
  lastName: "Zein",
  email: "lynn@example.com",
  role: "resident",
};

export const authService = {
  async login(data: LoginFormData): Promise<User> {
    console.log("Mock login", data);
    localStorage.setItem("civicai_user", JSON.stringify(mockUser));
    return mockUser;
  },

  async register(data: RegisterFormData): Promise<User> {
    console.log("Mock register", data);
    const newUser: User = {
      id: crypto.randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem("civicai_user", JSON.stringify(newUser));
    return newUser;
  },

  logout() {
    localStorage.removeItem("civicai_user");
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem("civicai_user");
    return raw ? (JSON.parse(raw) as User) : null;
  },
};