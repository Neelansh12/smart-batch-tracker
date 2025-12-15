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
} from 'recharts';
import { lossBreakdown } from '@/lib/mockData';

const COLORS = ['hsl(200, 70%, 50%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(270, 60%, 50%)'];

export function LossChart({ dailyStats }) {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Area Chart - Waste Trend */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Waste Trend</h3>
                    <p className="text-sm text-muted-foreground">Daily waste percentage over time</p>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dailyStats}>
                            <defs>
                                <linearGradient id="wasteGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(152, 60%, 38%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(152, 60%, 38%)" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'hsl(215, 15%, 45%)', fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'hsl(215, 15%, 45%)', fontSize: 12 }}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(0, 0%, 100%)',
                                    border: '1px solid hsl(214, 20%, 90%)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px hsl(215 25% 15% / 0.07)',
                                }}
                                labelStyle={{ color: 'hsl(215, 25%, 15%)', fontWeight: 600 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="wastePercentage"
                                stroke="hsl(0, 72%, 51%)"
                                strokeWidth={2}
                                fill="url(#wasteGradient)"
                                name="Waste %"
                            />
                            <Area
                                type="monotone"
                                dataKey="efficiency"
                                stroke="hsl(152, 60%, 38%)"
                                strokeWidth={2}
                                fill="url(#efficiencyGradient)"
                                name="Efficiency %"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart - Loss Breakdown */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground">Loss Breakdown</h3>
                    <p className="text-sm text-muted-foreground">Distribution by loss type</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="h-48 w-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={lossBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {lossBreakdown.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(0, 0%, 100%)',
                                        border: '1px solid hsl(214, 20%, 90%)',
                                        borderRadius: '8px',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-3">
                        {lossBreakdown.map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-3 w-3 rounded-full"
                                        style={{ backgroundColor: COLORS[index] }}
                                    />
                                    <span className="text-sm text-foreground">{item.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-foreground">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
