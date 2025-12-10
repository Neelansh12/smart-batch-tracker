import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Check, CheckCheck, Trash2, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const severityConfig = {
    low: { icon: Info, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Low' },
    medium: { icon: AlertCircle, color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'Medium' },
    high: { icon: AlertTriangle, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', label: 'High' },
    critical: { icon: AlertTriangle, color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Critical' },
};

export default function Alerts() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!loading && !user) {
            navigate('/auth');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (user) {
            fetchAlerts();
            // Subscribe to realtime alerts
            const channel = supabase
                .channel('alerts-changes')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'alerts', filter: `user_id=eq.${user.id}` },
                    () => fetchAlerts()
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user]);

    const fetchAlerts = async () => {
        const { data, error } = await supabase
            .from('alerts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast({ title: 'Error', description: 'Failed to fetch alerts', variant: 'destructive' });
        } else {
            setAlerts(data || []);
        }
    };

    const markAsRead = async (id) => {
        const { error } = await supabase
            .from('alerts')
            .update({ is_read: true })
            .eq('id', id);

        if (!error) fetchAlerts();
    };

    const markAllAsRead = async () => {
        const { error } = await supabase
            .from('alerts')
            .update({ is_read: true })
            .eq('user_id', user?.id);

        if (!error) {
            toast({ title: 'Success', description: 'All alerts marked as read' });
            fetchAlerts();
        }
    };

    const deleteAlert = async (id) => {
        const { error } = await supabase.from('alerts').delete().eq('id', id);
        if (!error) {
            toast({ title: 'Deleted', description: 'Alert removed' });
            fetchAlerts();
        }
    };

    const clearAll = async () => {
        const { error } = await supabase.from('alerts').delete().eq('user_id', user?.id);
        if (!error) {
            toast({ title: 'Cleared', description: 'All alerts removed' });
            fetchAlerts();
        }
    };

    const filteredAlerts = filter === 'unread' ? alerts.filter(a => !a.is_read) : alerts;
    const unreadCount = alerts.filter(a => !a.is_read).length;

    if (loading) return null;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Bell className="h-6 w-6" />
                            Alerts
                            {unreadCount > 0 && (
                                <Badge variant="destructive" className="ml-2">{unreadCount} unread</Badge>
                            )}
                        </h1>
                        <p className="text-muted-foreground">Monitor system alerts and notifications</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}>
                            {filter === 'all' ? <BellOff className="h-4 w-4 mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
                            {filter === 'all' ? 'Show Unread' : 'Show All'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                            <CheckCheck className="h-4 w-4 mr-2" />
                            Mark All Read
                        </Button>
                        <Button variant="outline" size="sm" onClick={clearAll} disabled={alerts.length === 0}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear All
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {filter === 'all' ? 'All Alerts' : 'Unread Alerts'} ({filteredAlerts.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {filteredAlerts.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No alerts to display</p>
                                <p className="text-sm">Alerts will appear here when something needs your attention</p>
                            </div>
                        ) : (
                            filteredAlerts.map((alert) => {
                                const config = severityConfig[alert.severity];
                                const Icon = config.icon;

                                return (
                                    <div
                                        key={alert.id}
                                        className={cn(
                                            'flex items-start gap-4 p-4 rounded-lg border transition-colors',
                                            alert.is_read ? 'bg-muted/30 border-border' : 'bg-card border-primary/20'
                                        )}
                                    >
                                        <div className={cn('p-2 rounded-lg', config.color)}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className={cn('font-medium', !alert.is_read && 'text-foreground')}>
                                                    {alert.title}
                                                </h3>
                                                <Badge variant="outline" className={config.color}>
                                                    {config.label}
                                                </Badge>
                                                {!alert.is_read && (
                                                    <Badge variant="secondary" className="text-xs">New</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {new Date(alert.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {!alert.is_read && (
                                                <Button size="sm" variant="ghost" onClick={() => markAsRead(alert.id)}>
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button size="sm" variant="ghost" onClick={() => deleteAlert(alert.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
