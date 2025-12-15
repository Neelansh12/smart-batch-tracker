import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info, Bell, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const alertIcons = {
    critical: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const alertStyles = {
    critical: {
        container: 'border-l-4 border-l-destructive bg-destructive/5',
        icon: 'text-destructive',
        badge: 'bg-destructive text-destructive-foreground',
    },
    warning: {
        container: 'border-l-4 border-l-warning bg-warning/5',
        icon: 'text-warning',
        badge: 'bg-warning text-warning-foreground',
    },
    info: {
        container: 'border-l-4 border-l-info bg-info/5',
        icon: 'text-info',
        badge: 'bg-info text-info-foreground',
    },
};

export function AlertsPanel({ alerts, onDismiss }) {
    const unreadCount = alerts.filter((a) => !a.isRead).length;

    return (
        <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center justify-between border-b border-border p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                        <Bell className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
                        <p className="text-sm text-muted-foreground">
                            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                        {unreadCount}
                    </span>
                )}
            </div>

            <div className="divide-y divide-border">
                {alerts.map((alert) => {
                    const Icon = alertIcons[alert.type];
                    const styles = alertStyles[alert.type];

                    return (
                        <div
                            key={alert.id}
                            className={cn(
                                'group relative p-4 transition-all hover:bg-muted/50',
                                styles.container,
                                alert.isRead && 'opacity-60'
                            )}
                        >
                            <div className="flex gap-3">
                                <div className={cn('mt-0.5', styles.icon)}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-medium text-foreground">{alert.title}</p>
                                            <p className="mt-0.5 text-sm text-muted-foreground">
                                                {alert.message}
                                            </p>
                                        </div>
                                        {onDismiss && (
                                            <button
                                                onClick={() => onDismiss(alert.id)}
                                                className="opacity-0 transition-opacity group-hover:opacity-100"
                                            >
                                                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        {alert.batchId && (
                                            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                {alert.batchId}
                                            </span>
                                        )}
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="border-t border-border p-3">
                <button className="w-full rounded-lg py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5">
                    View All Alerts
                </button>
            </div>
        </div>
    );
}
