import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import * as authService from '../services/authService';
import { initDB } from '../services/db';

interface AuthContextType {
    user: User | null;
    role: Role | null;
    login: (email: string, pass: string) => { success: boolean; message: string; };
    signup: (email: string, pass: string) => { success: boolean; message: string; };
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'cmr_nxt_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const updateUser = useCallback(() => {
        initDB(); // Ensure DB is initialized
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
    }, []);

    useEffect(() => {
        updateUser();
        
        const handleStorageChange = (event: StorageEvent) => {
           if (event.key === SESSION_KEY || event.key === null) {
                updateUser();
           }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };

    }, [updateUser]);

    const login = (email: string, pass: string) => {
        const result = authService.login(email, pass);
        if (result.success) {
            updateUser();
        }
        return result;
    };

    const signup = (email: string, pass: string) => {
        const result = authService.signup(email, pass);
        return result;
    };

    const logout = () => {
        authService.logout();
        updateUser();
    };

    return (
        <AuthContext.Provider value={{ user, role: user?.role || null, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
