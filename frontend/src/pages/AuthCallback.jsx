import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export default function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setSession, setUser } = useAuth();
    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return;
        processed.current = true;

        const token = searchParams.get('token');
        const userId = searchParams.get('userId');
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const error = searchParams.get('error');

        if (error) {
            toast({
                title: 'Login Failed',
                description: decodeURIComponent(error),
                variant: 'destructive',
            });
            navigate('/auth');
            return;
        }

        if (token && userId) {
            // Store token
            localStorage.setItem('token', token);

            // Reconstruct user object
            const userObj = {
                id: userId,
                email: email,
                full_name: decodeURIComponent(name || '')
            };

            // Update Auth Context
            setSession({ user: userObj, access_token: token });
            setUser(userObj);

            toast({ title: 'Welcome back!', description: 'Successfully signed in with Google.' });
            navigate('/dashboard');
        } else {
            navigate('/auth');
        }
    }, [searchParams, navigate, setSession, setUser]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );
}
