import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function MetricCard({
    title,
    value,
    unit,
    change,
    changeLabel,
    icon: Icon,
    variant = 'default',
    className,
}) {
    const isPositive = change !== undefined && change >= 0;

    const variantStyles = {
        default: 'bg-card',
        success: 'bg-card border-l-4 border-l-success',
        warning: 'bg-card border-l-4 border-l-warning',
        destructive: 'bg-card border-l-4 border-l-destructive',
    };

    const iconVariantStyles = {
        default: 'bg-primary/10 text-primary',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/10 text-warning',
        destructive: 'bg-destructive/10 text-destructive',
    };

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-xl border border-border p-5 shadow-card transition-all duration-300 hover:shadow-card-hover',
                variantStyles[variant],
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold tracking-tight text-foreground">
                            {value}
                        </span>
                        {unit && (
                            <span className="text-sm font-medium text-muted-foreground">{unit}</span>
                        )}
                    </div>
                </div>
                <div
                    className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110',
                        iconVariantStyles[variant]
                    )}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            {change !== undefined && (
                <div className="mt-3 flex items-center gap-1.5">
                    <div
                        className={cn(
                            'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
                            isPositive
                                ? 'bg-success/10 text-success'
                                : 'bg-destructive/10 text-destructive'
                        )}
                    >
                        {isPositive ? (
                            <TrendingUp className="h-3 w-3" />
                        ) : (
                            <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{Math.abs(change)}%</span>
                    </div>
                    {changeLabel && (
                        <span className="text-xs text-muted-foreground">{changeLabel}</span>
                    )}
                </div>
            )}

            {/* Decorative gradient */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
    );
}
