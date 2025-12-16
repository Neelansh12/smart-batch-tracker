import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await api.get('/auth/me', token);
                    const userObj = {
                        id: userData._id || userData.id,
                        email: userData.email,
                        full_name: userData.full_name,
                        organization: userData.organization,
                        avatar_url: userData.avatar_url
                    };
                    setUser(userObj);
                    setSession({ user: userObj, access_token: token });
                } catch (err) {
                    console.error('Auth verification failed', err);
                    localStorage.removeItem('token');
                    setSession(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const signIn = async (email, password) => {
        try {
            const data = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            const userObj = {
                id: data.user.id,
                email: data.user.email,
                full_name: data.user.full_name
            };
            setSession({ user: userObj, access_token: data.token });
            setUser(userObj);
            return { error: null };
        } catch (err) {
            return { error: new Error(err.message || 'Login failed') };
        }
    };

    const signUp = async (email, password, fullName) => {
        try {
            await api.post('/auth/register', { email, password, full_name: fullName });
            return { error: null };
        } catch (err) {
            return { error: new Error(err.message || 'Signup failed') };
        }
    };

    const signOut = async () => {
        localStorage.removeItem('token');
        setSession(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
