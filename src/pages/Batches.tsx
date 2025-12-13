import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Package, ArrowRight, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type BatchStatus = 'inbound' | 'processing' | 'packaging' | 'dispatch' | 'completed';

interface Batch {
  id: string;
  batch_id: string;
  product: string;
  status: BatchStatus;
  input_weight: number;
  output_weight: number | null;
  loss_percentage: number | null;
  moisture_loss: number | null;
  trimming_loss: number | null;
  processing_loss: number | null;
  spoilage_loss: number | null;
  created_at: string;
}

const statusColors: Record<BatchStatus, string> = {
  inbound: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  processing: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  packaging: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  dispatch: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const nextStatus: Record<BatchStatus, BatchStatus | null> = {
  inbound: 'processing',
  processing: 'packaging',
  packaging: 'dispatch',
  dispatch: 'completed',
  completed: null,
};

export default function Batches() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBatch, setNewBatch] = useState({
    batch_id: '',
    product: '',
    input_weight: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchBatches();
  }, [user]);

  const fetchBatches = async () => {
    const { data, error } = await supabase
      .from('batches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch batches', variant: 'destructive' });
    } else {
      setBatches(data || []);
    }
  };

  const createBatch = async () => {
    if (!user) return;

    const { error } = await supabase.from('batches').insert({
      user_id: user.id,
      batch_id: newBatch.batch_id,
      product: newBatch.product,
      input_weight: parseFloat(newBatch.input_weight),
      status: 'inbound' as BatchStatus,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Batch created successfully' });
      setIsDialogOpen(false);
      setNewBatch({ batch_id: '', product: '', input_weight: '' });
      fetchBatches();
    }
  };

  const advanceStatus = async (batch: Batch) => {
    const next = nextStatus[batch.status];
    if (!next) return;

    const updates: Partial<Batch> = { status: next };

    // Calculate losses when completing
    if (next === 'completed' && batch.output_weight) {
      const totalLoss = ((batch.input_weight - batch.output_weight) / batch.input_weight) * 100;
      updates.loss_percentage = totalLoss;
    }

    const { error } = await supabase
      .from('batches')
      .update(updates)
      .eq('id', batch.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Status Updated', description: `Batch moved to ${next}` });
      fetchBatches();
    }
  };

  const updateOutputWeight = async (batch: Batch, weight: string) => {
    const outputWeight = parseFloat(weight);
    if (isNaN(outputWeight)) return;

    const { error } = await supabase
      .from('batches')
      .update({ output_weight: outputWeight })
      .eq('id', batch.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      fetchBatches();
    }
  };

  const deleteBatch = async (id: string) => {
    const { error } = await supabase.from('batches').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Batch removed' });
      fetchBatches();
    }
  };

  const filteredBatches = batches.filter(
    (b) =>
      b.batch_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Batch Tracking</h1>
            <p className="text-muted-foreground">Manage and track all your processing batches</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Batch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Batch</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Batch ID</Label>
                  <Input
                    placeholder="BTH-001"
                    value={newBatch.batch_id}
                    onChange={(e) => setNewBatch({ ...newBatch, batch_id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Input
                    placeholder="Fresh Tomatoes"
                    value={newBatch.product}
                    onChange={(e) => setNewBatch({ ...newBatch, product: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Input Weight (kg)</Label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={newBatch.input_weight}
                    onChange={(e) => setNewBatch({ ...newBatch, input_weight: e.target.value })}
                  />
                </div>
                <Button onClick={createBatch} className="w-full">
                  Create Batch
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search batches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              All Batches ({filteredBatches.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Input (kg)</TableHead>
                  <TableHead>Output (kg)</TableHead>
                  <TableHead>Loss %</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-mono font-medium">{batch.batch_id}</TableCell>
                    <TableCell>{batch.product}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[batch.status]}>
                        {batch.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{batch.input_weight}</TableCell>
                    <TableCell>
                      {batch.status !== 'inbound' ? (
                        <Input
                          type="number"
                          className="w-24 h-8"
                          value={batch.output_weight || ''}
                          onChange={(e) => updateOutputWeight(batch, e.target.value)}
                          placeholder="0"
                        />
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {batch.loss_percentage ? `${batch.loss_percentage.toFixed(1)}%` : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {nextStatus[batch.status] && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => advanceStatus(batch)}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteBatch(batch.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBatches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No batches found. Create your first batch to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
