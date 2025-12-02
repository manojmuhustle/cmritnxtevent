import { User, Role } from '../types';

const USERS_KEY = 'cmr_nxt_users';
const SESSION_KEY = 'cmr_nxt_session';

// In a real app, use a secure password hashing library.
// For this simulation, we'll store passwords as plain text in local storage.
const ADMIN_EMAIL = 'manojmuhustle@gmail.com';
const ADMIN_PASSWORD = 'Manueventing27@';

const getUsers = (): Record<string, string> => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
};

const saveUsers = (users: Record<string, string>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signup = (email: string, pass: string): { success: boolean, message: string } => {
    const users = getUsers();
    if (users[email]) {
        return { success: false, message: 'User with this email already exists.' };
    }
    if (email === ADMIN_EMAIL) {
        return { success: false, message: 'Cannot register with admin email.' };
    }
    if (pass.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    users[email] = pass; // Storing plain text password for simplicity
    saveUsers(users);
    return { success: true, message: 'Signup successful.' };
};

export const login = (email: string, pass: string): { success: boolean, message: string } => {
    if (email === ADMIN_EMAIL) {
        if (pass === ADMIN_PASSWORD) {
            localStorage.setItem(SESSION_KEY, email);
            return { success: true, message: 'Admin login successful.' };
        } else {
            return { success: false, message: 'Invalid admin credentials.' };
        }
    }

    const users = getUsers();
    const storedPass = users[email];

    if (!storedPass) {
        return { success: false, message: 'User not found. Please sign up first.' };
    }

    if (storedPass === pass) {
        localStorage.setItem(SESSION_KEY, email);
        return { success: true, message: 'Login successful.' };
    }

    return { success: false, message: 'Invalid email or password.' };
};

export const logout = (): void => {
    localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) {
        return null;
    }
    
    const role = email === ADMIN_EMAIL ? Role.ADMIN : Role.USER;

    return { email, role };
};
