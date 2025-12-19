import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingDown, TrendingUp, Package, DollarSign } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
} from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function Analytics() {
    const { user, session, loading } = useAuth();
    const navigate = useNavigate();
    const [batches, setBatches] = useState([]);
    const [timeRange, setTimeRange] = useState('7d');

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (user && session?.access_token) fetchBatches();
    }, [user, session]);

    const fetchBatches = async () => {
        try {
            const data = await api.get('/batches', session?.access_token);
            // Sort by created_at ascending
            const sortedData = (data || []).sort((a, b) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
            setBatches(sortedData);
        } catch (error) {
            // silent
        }
    };

    // Calculate analytics
    const completedBatches = batches.filter(b => b.status === 'completed');
    const totalInput = batches.reduce((acc, b) => acc + Number(b.input_weight), 0);
    const totalOutput = batches.reduce((acc, b) => acc + (Number(b.output_weight) || 0), 0);
    const avgLoss = completedBatches.length > 0
        ? completedBatches.reduce((acc, b) => acc + (Number(b.loss_percentage) || 0), 0) / completedBatches.length
        : 0;

    // Loss breakdown
    const lossBreakdown = [
        { name: 'Moisture', value: batches.reduce((acc, b) => acc + (Number(b.moisture_loss) || 0), 0) },
        { name: 'Trimming', value: batches.reduce((acc, b) => acc + (Number(b.trimming_loss) || 0), 0) },
        { name: 'Processing', value: batches.reduce((acc, b) => acc + (Number(b.processing_loss) || 0), 0) },
        { name: 'Spoilage', value: batches.reduce((acc, b) => acc + (Number(b.spoilage_loss) || 0), 0) },
    ];

    // Status distribution
    const statusData = [
        { status: 'Inbound', count: batches.filter(b => b.status === 'inbound').length },
        { status: 'Processing', count: batches.filter(b => b.status === 'processing').length },
        { status: 'Packaging', count: batches.filter(b => b.status === 'packaging').length },
        { status: 'Dispatch', count: batches.filter(b => b.status === 'dispatch').length },
        { status: 'Completed', count: batches.filter(b => b.status === 'completed').length },
    ];

    // Daily trend data
    const dailyData = batches.reduce((acc, batch) => {
        const date = new Date(batch.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const existing = acc.find(d => d.date === date);
        if (existing) {
            existing.batches += 1;
            existing.input += Number(batch.input_weight);
            existing.output += Number(batch.output_weight) || 0;
        } else {
            acc.push({
                date,
                batches: 1,
                input: Number(batch.input_weight),
                output: Number(batch.output_weight) || 0,
            });
        }
        return acc;
    }, []);

    if (loading) return null;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Analytics</h1>
                        <p className="text-muted-foreground">Track performance and identify optimization opportunities</p>
                    </div>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{batches.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {completedBatches.length} completed
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Input</CardTitle>
                            <TrendingUp className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalInput.toLocaleString()} kg</div>
                            <p className="text-xs text-muted-foreground">Raw materials processed</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Output</CardTitle>
                            <TrendingDown className="h-4 w-4 text-chart-2" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalOutput.toLocaleString()} kg</div>
                            <p className="text-xs text-muted-foreground">Final product yield</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Loss Rate</CardTitle>
                            <DollarSign className="h-4 w-4 text-destructive" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{avgLoss.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground">Across completed batches</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Production Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={dailyData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis dataKey="date" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="input"
                                        stackId="1"
                                        stroke="hsl(var(--primary))"
                                        fill="hsl(var(--primary))"
                                        fillOpacity={0.3}
                                        name="Input (kg)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="output"
                                        stackId="2"
                                        stroke="hsl(var(--chart-2))"
                                        fill="hsl(var(--chart-2))"
                                        fillOpacity={0.3}
                                        name="Output (kg)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Batch Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={statusData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                    <XAxis dataKey="status" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Loss Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={lossBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                                    >
                                        {lossBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
