"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { User, LoginFormData, RegisterFormData } from "@/types";
import { authAPI } from "@/lib/api";
// import toast from "react-hot-toast";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginFormData) => Promise<boolean>;
    register: (data: RegisterFormData) => Promise<boolean>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user;

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Check if we're in the browser
                if (typeof window === "undefined") {
                    setIsLoading(false);
                    return;
                }

                const token = localStorage.getItem("token");
                const savedUser = localStorage.getItem("user");

                if (token && savedUser) {
                    setUser(JSON.parse(savedUser));

                    // Verify token is still valid
                    try {
                        const response = await authAPI.getProfile();
                        if (response.success && response.data) {
                            setUser(response.data);
                            localStorage.setItem(
                                "user",
                                JSON.stringify(response.data)
                            );
                        }
                    } catch {
                        // Token invalid, clear storage
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                if (typeof window !== "undefined") {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (data: LoginFormData): Promise<boolean> => {
        console.log("AuthContext login called with:", data);
        try {
            setIsLoading(true);
            console.log("Making API call to login...");
            const response = await authAPI.login(data);
            console.log("API response:", response);

            if (response.success && response.data) {
                const { user, token } = response.data;

                if (typeof window !== "undefined") {
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));
                    console.log("User data saved to localStorage");
                }
                setUser(user);

                console.log("Login successful!");
                return true;
            } else {
                console.error(
                    "Login failed:",
                    response.message || "Unknown error"
                );
                return false;
            }
        } catch (error: unknown) {
            console.error("Login error:", error);

            let errorMessage = "Login failed";

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            console.error("Error message:", errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterFormData): Promise<boolean> => {
        try {
            setIsLoading(true);
            const response = await authAPI.register(data);

            if (response.success && response.data) {
                const { user, token } = response.data;

                if (typeof window !== "undefined") {
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));
                }
                setUser(user);

                console.log("Registration successful!");
                return true;
            } else {
                console.error(response.message || "Registration failed");
                return false;
            }
        } catch (error: unknown) {
            console.error("Registration error:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Registration failed";
            console.error(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        setUser(null);
        console.log("Logged out successfully");
    };

    const refreshUser = async () => {
        try {
            if (typeof window === "undefined") return;

            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await authAPI.getProfile();
            if (response.success && response.data) {
                setUser(response.data);
                localStorage.setItem("user", JSON.stringify(response.data));
            }
        } catch (error) {
            console.error("Refresh user error:", error);
            logout();
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;
