import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
    LayoutDashboard,
    Package,
    BarChart3,
    Bell,
    Settings,
    Leaf,
    ChevronLeft,
    Upload,
    LogOut,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/' },
    { id: 'batches', label: 'Batch Tracking', icon: Package, path: '/batches' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'alerts', label: 'Alerts', icon: Bell, path: '/alerts' },
    { id: 'upload', label: 'Quality Upload', icon: Upload, path: '/quality-upload' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export function DashboardLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [unreadAlerts, setUnreadAlerts] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, signOut } = useAuth();

    useEffect(() => {
        if (user) {
            fetchUnreadAlerts();
            // Subscribe to realtime alerts
            const channel = supabase
                .channel('alert-count')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'alerts', filter: `user_id=eq.${user.id}` },
                    () => fetchUnreadAlerts()
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user]);

    const fetchUnreadAlerts = async () => {
        const { count } = await supabase
            .from('alerts')
            .select('*', { count: 'exact', head: true })
            .eq('is_read', false);
        setUnreadAlerts(count || 0);
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out',
                    collapsed ? 'w-16' : 'w-64'
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
                        <div className={cn('flex items-center gap-3', collapsed && 'justify-center w-full')}>
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
                                <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
                            </div>
                            {!collapsed && (
                                <div className="animate-fade-in">
                                    <h1 className="text-sm font-semibold text-sidebar-foreground">FoodFlow</h1>
                                    <p className="text-xs text-sidebar-foreground/60">Waste Minimizer</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className={cn(
                                'flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/60 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground',
                                collapsed && 'absolute -right-3 top-6 bg-sidebar border border-sidebar-border'
                            )}
                        >
                            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 p-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            const showBadge = item.id === 'alerts' && unreadAlerts > 0;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className={cn(
                                        'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative',
                                        isActive
                                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow'
                                            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                                        collapsed && 'justify-center px-0'
                                    )}
                                >
                                    <Icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'animate-pulse')} />
                                    {!collapsed && <span className="animate-fade-in">{item.label}</span>}
                                    {showBadge && (
                                        <Badge
                                            variant="destructive"
                                            className={cn(
                                                'ml-auto text-xs h-5 min-w-5 flex items-center justify-center',
                                                collapsed && 'absolute -top-1 -right-1'
                                            )}
                                        >
                                            {unreadAlerts}
                                        </Badge>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className={cn('border-t border-sidebar-border p-4', collapsed && 'p-2')}>
                        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
                                <span className="text-xs font-semibold text-sidebar-accent-foreground">
                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                            {!collapsed && (
                                <div className="flex-1 animate-fade-in">
                                    <p className="text-xs font-medium text-sidebar-foreground truncate">
                                        {user?.email}
                                    </p>
                                    <button
                                        onClick={handleSignOut}
                                        className="text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground flex items-center gap-1"
                                    >
                                        <LogOut className="h-3 w-3" />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={cn('transition-all duration-300 min-h-screen', collapsed ? 'ml-16' : 'ml-64')}>
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
