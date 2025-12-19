import { cn } from '@/lib/utils';
import { Package, Cog, BoxIcon, Truck, CheckCircle } from 'lucide-react';

const stages = [
    { id: 'inbound', label: 'Inbound', icon: Package },
    { id: 'processing', label: 'Processing', icon: Cog },
    { id: 'packaging', label: 'Packaging', icon: BoxIcon },
    { id: 'dispatch', label: 'Dispatch', icon: Truck },
    { id: 'completed', label: 'Completed', icon: CheckCircle },
];

export function BatchPipeline({ batches }) {
    const getBatchesByStage = (stage) =>
        batches.filter((b) => (b.stage || 'inbound') === stage);

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">Batch Pipeline</h3>
                <p className="text-sm text-muted-foreground">Track batches through processing stages</p>
            </div>

            <div className="flex items-start justify-between gap-2">
                {stages.map((stage, index) => {
                    const stageBatches = getBatchesByStage(stage.id);
                    const Icon = stage.icon;

                    return (
                        <div key={stage.id} className="flex flex-1 flex-col items-center">
                            {/* Stage header */}
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-xl transition-all',
                                        stageBatches.length > 0
                                            ? 'bg-primary text-primary-foreground shadow-glow'
                                            : 'bg-muted text-muted-foreground'
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-foreground">{stage.label}</p>
                                    <p className="text-xs text-muted-foreground">{stageBatches.length} batch{stageBatches.length !== 1 ? 'es' : ''}</p>
                                </div>
                            </div>

                            {/* Connector line */}
                            {index < stages.length - 1 && (
                                <div className="absolute mt-6 h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-border via-primary/30 to-border" style={{ left: '50%', width: 'calc(100% - 3rem)' }} />
                            )}

                            {/* Batch cards */}
                            <div className="mt-4 w-full space-y-2">
                                {stageBatches.slice(0, 2).map((batch) => (
                                    <div
                                        key={batch.id}
                                        className="group cursor-pointer rounded-lg border border-border bg-background p-3 transition-all hover:border-primary hover:shadow-card"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-primary">{batch.batch_id}</span>
                                            {batch.qualityScore && (
                                                <span
                                                    className={cn(
                                                        'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                                                        batch.qualityScore >= 90
                                                            ? 'bg-success/10 text-success'
                                                            : batch.qualityScore >= 75
                                                                ? 'bg-warning/10 text-warning'
                                                                : 'bg-destructive/10 text-destructive'
                                                    )}
                                                >
                                                    {batch.qualityScore}%
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 truncate text-xs text-muted-foreground">
                                            {batch.final_product || batch.product}
                                        </p>
                                        <p className="text-xs font-medium text-foreground">
                                            {(batch.input_weight || 0).toLocaleString()} kg
                                        </p>
                                    </div>
                                ))}
                                {stageBatches.length > 2 && (
                                    <button className="w-full rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                                        +{stageBatches.length - 2} more
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
