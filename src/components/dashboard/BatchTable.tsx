import { cn } from '@/lib/utils';
import { Batch } from '@/lib/mockData';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

interface BatchTableProps {
  batches: Batch[];
}

const stageColors = {
  inbound: 'bg-info/10 text-info',
  processing: 'bg-warning/10 text-warning',
  packaging: 'bg-primary/10 text-primary',
  dispatch: 'bg-success/10 text-success',
  completed: 'bg-muted text-muted-foreground',
};

export function BatchTable({ batches }: BatchTableProps) {
  const calculateLoss = (batch: Batch) => {
    if (batch.inputWeight === 0) return 0;
    const totalLoss = Object.values(batch.losses).reduce((a, b) => a + b, 0);
    return totalLoss.toFixed(1);
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <div className="border-b border-border p-5">
        <h3 className="text-lg font-semibold text-foreground">All Batches</h3>
        <p className="text-sm text-muted-foreground">Detailed batch information and status</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Batch ID
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Material
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Input
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Output
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Loss %
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quality
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Stage
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Updated
              </th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {batches.map((batch) => (
              <tr
                key={batch.id}
                className="group cursor-pointer transition-colors hover:bg-muted/30"
              >
                <td className="px-5 py-4">
                  <span className="font-semibold text-primary">{batch.id}</span>
                </td>
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-foreground">{batch.name}</p>
                    <p className="text-xs text-muted-foreground">{batch.rawMaterial}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-foreground">
                  {batch.inputWeight.toLocaleString()} kg
                </td>
                <td className="px-5 py-4 text-foreground">
                  {batch.outputWeight > 0 ? `${batch.outputWeight.toLocaleString()} kg` : '—'}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      'font-medium',
                      Number(calculateLoss(batch)) > 15
                        ? 'text-destructive'
                        : Number(calculateLoss(batch)) > 10
                        ? 'text-warning'
                        : 'text-success'
                    )}
                  >
                    {calculateLoss(batch)}%
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          batch.qualityScore >= 90
                            ? 'bg-success'
                            : batch.qualityScore >= 75
                            ? 'bg-warning'
                            : 'bg-destructive'
                        )}
                        style={{ width: `${batch.qualityScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {batch.qualityScore}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                      stageColors[batch.stage]
                    )}
                  >
                    {batch.stage}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {format(batch.updatedAt, 'MMM d, HH:mm')}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
