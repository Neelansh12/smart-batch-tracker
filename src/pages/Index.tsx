import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { BatchPipeline } from '@/components/dashboard/BatchPipeline';
import { LossChart } from '@/components/dashboard/LossChart';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { BatchTable } from '@/components/dashboard/BatchTable';
import { mockBatches, mockAlerts, mockDailyStats } from '@/lib/mockData';
import {
  Package,
  TrendingDown,
  Gauge,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const unreadAlerts = mockAlerts.filter((a) => !a.isRead).length;

  // Calculate metrics
  const totalBatches = mockBatches.length;
  const avgWaste = mockDailyStats.reduce((acc, d) => acc + d.wastePercentage, 0) / mockDailyStats.length;
  const avgEfficiency = mockDailyStats.reduce((acc, d) => acc + d.efficiency, 0) / mockDailyStats.length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <main className={cn('transition-all duration-300', 'ml-64')}>
        <DashboardHeader unreadAlerts={unreadAlerts} />
        
        <div className="p-6">
          {/* Welcome Banner */}
          <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary to-primary/80 p-6 text-primary-foreground shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Welcome back!</h2>
                <p className="mt-1 text-primary-foreground/80">
                  Here's what's happening with your food processing today.
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-primary-foreground/80">Today's Output</p>
                <p className="text-3xl font-bold">4,950 kg</p>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Active Batches"
              value={totalBatches}
              unit="batches"
              change={12}
              changeLabel="vs last week"
              icon={Package}
              variant="success"
            />
            <MetricCard
              title="Avg. Waste Rate"
              value={avgWaste.toFixed(1)}
              unit="%"
              change={-2.3}
              changeLabel="vs last week"
              icon={TrendingDown}
              variant="warning"
            />
            <MetricCard
              title="Efficiency"
              value={avgEfficiency.toFixed(1)}
              unit="%"
              change={1.5}
              changeLabel="vs last week"
              icon={Gauge}
              variant="success"
            />
            <MetricCard
              title="Active Alerts"
              value={unreadAlerts}
              unit=""
              icon={AlertTriangle}
              variant={unreadAlerts > 2 ? 'destructive' : 'default'}
            />
          </div>

          {/* Batch Pipeline */}
          <div className="mb-6">
            <BatchPipeline batches={mockBatches} />
          </div>

          {/* Charts Section */}
          <div className="mb-6">
            <LossChart dailyStats={mockDailyStats} />
          </div>

          {/* Bottom Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <BatchTable batches={mockBatches} />
            </div>
            <div>
              <AlertsPanel alerts={mockAlerts} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
