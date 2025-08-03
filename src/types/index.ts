export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}


export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin';
    createdAt: string;
}