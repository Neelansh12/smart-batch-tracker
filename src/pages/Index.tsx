import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  TrendingDown,
  Gauge,
  AlertTriangle,
  ArrowRight,
  Plus,
  Bell,
  Upload,
} from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBatches: 0,
    activeBatches: 0,
    avgLoss: 0,
    unreadAlerts: 0,
  });
  const [recentBatches, setRecentBatches] = useState<any[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    // Fetch batches
    const { data: batches } = await supabase
      .from('batches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    // Fetch alerts
    const { data: alerts } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3);

    // Calculate stats
    const allBatches = batches || [];
    const completed = allBatches.filter(b => b.status === 'completed');
    const avgLoss = completed.length > 0
      ? completed.reduce((acc, b) => acc + (Number(b.loss_percentage) || 0), 0) / completed.length
      : 0;

    const unread = (alerts || []).filter(a => !a.is_read).length;

    setStats({
      totalBatches: allBatches.length,
      activeBatches: allBatches.filter(b => b.status !== 'completed').length,
      avgLoss,
      unreadAlerts: unread,
    });
    setRecentBatches(allBatches);
    setRecentAlerts(alerts || []);
  };

  const statusColors: Record<string, string> = {
    inbound: 'bg-blue-500/20 text-blue-400',
    processing: 'bg-amber-500/20 text-amber-400',
    packaging: 'bg-purple-500/20 text-purple-400',
    dispatch: 'bg-cyan-500/20 text-cyan-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
  };

  if (loading) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary to-primary/80 p-6 text-primary-foreground shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Welcome back!</h2>
              <p className="mt-1 text-primary-foreground/80">
                Here's your food processing overview for today.
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => navigate('/batches')}
              className="hidden sm:flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Batch
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Batches"
            value={stats.totalBatches}
            unit="batches"
            icon={Package}
            variant="default"
          />
          <MetricCard
            title="Active Batches"
            value={stats.activeBatches}
            unit="in progress"
            icon={Gauge}
            variant="success"
          />
          <MetricCard
            title="Avg. Waste Rate"
            value={stats.avgLoss.toFixed(1)}
            unit="%"
            icon={TrendingDown}
            variant="warning"
          />
          <MetricCard
            title="Unread Alerts"
            value={stats.unreadAlerts}
            unit=""
            icon={AlertTriangle}
            variant={stats.unreadAlerts > 0 ? 'destructive' : 'default'}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card
            className="cursor-pointer transition-colors hover:bg-muted/50"
            onClick={() => navigate('/batches')}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Batch Tracking</h3>
                <p className="text-sm text-muted-foreground">Manage all batches</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-colors hover:bg-muted/50"
            onClick={() => navigate('/quality-upload')}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-lg bg-chart-2/10">
                <Upload className="h-6 w-6 text-chart-2" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Quality Upload</h3>
                <p className="text-sm text-muted-foreground">AI quality scoring</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-colors hover:bg-muted/50"
            onClick={() => navigate('/alerts')}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-lg bg-destructive/10">
                <Bell className="h-6 w-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  {stats.unreadAlerts > 0 ? `${stats.unreadAlerts} unread` : 'All caught up'}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Batches */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Batches</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/batches')}>
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {recentBatches.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No batches yet. Create your first batch to get started.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentBatches.map((batch) => (
                    <div
                      key={batch.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{batch.batch_id}</p>
                        <p className="text-sm text-muted-foreground">{batch.product}</p>
                      </div>
                      <Badge variant="outline" className={statusColors[batch.status]}>
                        {batch.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Alerts</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/alerts')}>
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {recentAlerts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No alerts. You're all caught up!
                </p>
              ) : (
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <AlertTriangle className={`h-5 w-5 ${alert.severity === 'critical' ? 'text-destructive' :
                          alert.severity === 'high' ? 'text-orange-400' :
                            'text-amber-400'
                        }`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{alert.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{alert.message}</p>
                      </div>
                      {!alert.is_read && (
                        <Badge variant="secondary" className="text-xs">New</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
