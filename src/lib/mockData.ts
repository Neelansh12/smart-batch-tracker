// Mock data for the Food Processing Dashboard

export interface Batch {
  id: string;
  name: string;
  rawMaterial: string;
  inputWeight: number;
  outputWeight: number;
  stage: 'inbound' | 'processing' | 'packaging' | 'dispatch' | 'completed';
  qualityScore: number;
  losses: {
    moisture: number;
    trimming: number;
    spoilage: number;
    processing: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  batchId?: string;
  timestamp: Date;
  isRead: boolean;
}

export interface DailyStats {
  date: string;
  totalBatches: number;
  totalInput: number;
  totalOutput: number;
  wastePercentage: number;
  efficiency: number;
}

export const mockBatches: Batch[] = [
  {
    id: 'BTH-001',
    name: 'Tomato Batch A',
    rawMaterial: 'Fresh Tomatoes',
    inputWeight: 1000,
    outputWeight: 820,
    stage: 'completed',
    qualityScore: 87,
    losses: { moisture: 8.2, trimming: 5.5, spoilage: 2.1, processing: 2.2 },
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'BTH-002',
    name: 'Wheat Batch B',
    rawMaterial: 'Durum Wheat',
    inputWeight: 2500,
    outputWeight: 2350,
    stage: 'packaging',
    qualityScore: 94,
    losses: { moisture: 3.2, trimming: 1.5, spoilage: 0.8, processing: 0.5 },
    createdAt: new Date('2024-12-02'),
    updatedAt: new Date('2024-12-03'),
  },
  {
    id: 'BTH-003',
    name: 'Apple Batch C',
    rawMaterial: 'Gala Apples',
    inputWeight: 800,
    outputWeight: 680,
    stage: 'processing',
    qualityScore: 78,
    losses: { moisture: 5.0, trimming: 8.5, spoilage: 3.5, processing: 1.5 },
    createdAt: new Date('2024-12-03'),
    updatedAt: new Date('2024-12-03'),
  },
  {
    id: 'BTH-004',
    name: 'Rice Batch D',
    rawMaterial: 'Basmati Rice',
    inputWeight: 3000,
    outputWeight: 2880,
    stage: 'dispatch',
    qualityScore: 96,
    losses: { moisture: 2.0, trimming: 0.5, spoilage: 0.3, processing: 1.2 },
    createdAt: new Date('2024-12-03'),
    updatedAt: new Date('2024-12-04'),
  },
  {
    id: 'BTH-005',
    name: 'Mango Batch E',
    rawMaterial: 'Alphonso Mangoes',
    inputWeight: 500,
    outputWeight: 0,
    stage: 'inbound',
    qualityScore: 91,
    losses: { moisture: 0, trimming: 0, spoilage: 0, processing: 0 },
    createdAt: new Date('2024-12-04'),
    updatedAt: new Date('2024-12-04'),
  },
];

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    type: 'critical',
    title: 'High Spoilage Detected',
    message: 'Batch BTH-003 showing 3.5% spoilage rate - above threshold',
    batchId: 'BTH-003',
    timestamp: new Date('2024-12-04T10:30:00'),
    isRead: false,
  },
  {
    id: 'ALT-002',
    type: 'warning',
    title: 'Temperature Variance',
    message: 'Storage unit 3 temperature fluctuated by 2°C in last hour',
    timestamp: new Date('2024-12-04T09:15:00'),
    isRead: false,
  },
  {
    id: 'ALT-003',
    type: 'info',
    title: 'Batch Completed',
    message: 'BTH-001 has been successfully dispatched with 82% yield',
    batchId: 'BTH-001',
    timestamp: new Date('2024-12-03T16:45:00'),
    isRead: true,
  },
  {
    id: 'ALT-004',
    type: 'warning',
    title: 'Quality Score Declining',
    message: 'Average quality score dropped 5% this week',
    timestamp: new Date('2024-12-03T14:20:00'),
    isRead: true,
  },
];

export const mockDailyStats: DailyStats[] = [
  { date: 'Nov 28', totalBatches: 12, totalInput: 8500, totalOutput: 7480, wastePercentage: 12.0, efficiency: 88.0 },
  { date: 'Nov 29', totalBatches: 15, totalInput: 10200, totalOutput: 9180, wastePercentage: 10.0, efficiency: 90.0 },
  { date: 'Nov 30', totalBatches: 10, totalInput: 6800, totalOutput: 5984, wastePercentage: 12.0, efficiency: 88.0 },
  { date: 'Dec 01', totalBatches: 18, totalInput: 12500, totalOutput: 11375, wastePercentage: 9.0, efficiency: 91.0 },
  { date: 'Dec 02', totalBatches: 14, totalInput: 9200, totalOutput: 8464, wastePercentage: 8.0, efficiency: 92.0 },
  { date: 'Dec 03', totalBatches: 16, totalInput: 11000, totalOutput: 9900, wastePercentage: 10.0, efficiency: 90.0 },
  { date: 'Dec 04', totalBatches: 8, totalInput: 5500, totalOutput: 4950, wastePercentage: 10.0, efficiency: 90.0 },
];

export const lossBreakdown = [
  { name: 'Moisture Loss', value: 35, color: 'hsl(200, 70%, 50%)' },
  { name: 'Trimming Loss', value: 28, color: 'hsl(38, 92%, 50%)' },
  { name: 'Spoilage', value: 22, color: 'hsl(0, 72%, 51%)' },
  { name: 'Processing', value: 15, color: 'hsl(270, 60%, 50%)' },
];

export const stageDistribution = [
  { stage: 'Inbound', batches: 3, efficiency: 100 },
  { stage: 'Processing', batches: 5, efficiency: 88 },
  { stage: 'Packaging', batches: 4, efficiency: 92 },
  { stage: 'Dispatch', batches: 2, efficiency: 95 },
];
