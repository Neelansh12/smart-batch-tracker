import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Package, ArrowRight, Trash2, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const stageColors = {
    inbound: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    processing: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    packaging: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    dispatch: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    completed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const stages = [
    { id: 'inbound', label: 'Inbound' },
    { id: 'processing', label: 'Processing' },
    { id: 'packaging', label: 'Packaging' },
    { id: 'dispatch', label: 'Dispatch' },
    { id: 'completed', label: 'Completed' },
];

export default function Batches() {
    const { user, session, loading } = useAuth();
    const navigate = useNavigate();
    const [batches, setBatches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // New Batch State
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newBatch, setNewBatch] = useState({
        batch_id: '',
        type: 'individual',
        ingredients: [{ name: '', weight: '', cost: '' }],
        final_product: '',
        status: 'Inbound', // Custom status text
    });

    // Update Status State
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [statusUpdate, setStatusUpdate] = useState({
        status: '',
        stage: '',
    });
    const [dialogIngredients, setDialogIngredients] = useState([]); // For editing in dialog

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
            setBatches(data || []);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to fetch batches', variant: 'destructive' });
        }
    };

    const openStatusDialog = (batch) => {
        setSelectedBatch(batch);
        setStatusUpdate({
            status: batch.status || '',
            stage: batch.stage || 'inbound'
        });
        // Initialize ingredients for the dialog
        if (batch.ingredients) {
            setDialogIngredients(batch.ingredients.map(i => ({
                ...i,
                status: i.status || 'Pending',
                wastage: i.wastage || 0
            })));
        } else {
            setDialogIngredients([]);
        }
        setIsStatusDialogOpen(true);
    };

    const handleDialogIngredientChange = (index, field, value) => {
        const updated = [...dialogIngredients];
        updated[index][field] = value;
        setDialogIngredients(updated);
    };

    const updateBatchStatus = async () => {
        if (!selectedBatch || !session?.access_token) return;

        try {
            const payload = {
                ...statusUpdate,
                ingredients: dialogIngredients.map(i => ({
                    ...i,
                    wastage: parseFloat(i.wastage) || 0
                }))
            };

            await api.put(`/batches/${selectedBatch.id}`, payload, session.access_token);
            toast({ title: 'Updated', description: 'Batch status updated' });
            setIsStatusDialogOpen(false);
            fetchBatches();
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    };

    // --- Form Handlers ---
    const addIngredient = () => {
        setNewBatch({
            ...newBatch,
            ingredients: [...newBatch.ingredients, { name: '', weight: '', cost: '' }]
        });
    };

    const removeIngredient = (index) => {
        const updated = newBatch.ingredients.filter((_, i) => i !== index);
        setNewBatch({ ...newBatch, ingredients: updated });
    };

    const updateIngredient = (index, field, value) => {
        const updated = [...newBatch.ingredients];
        updated[index][field] = value;
        setNewBatch({ ...newBatch, ingredients: updated });
    };

    const createBatch = async () => {
        if (!user || !session?.access_token) return;

        // Basic validation
        if (!newBatch.batch_id || !newBatch.final_product) {
            toast({ title: 'Error', description: 'Batch ID and Final Product are required', variant: 'destructive' });
            return;
        }

        // Validate ingredients
        const invalidIngredient = newBatch.ingredients.find(i => !i.name || !i.weight || !i.cost);
        if (invalidIngredient) {
            toast({ title: 'Error', description: 'All ingredient fields (Name, Weight, Cost) are required.', variant: 'destructive' });
            return;
        }

        try {
            await api.post('/batches', {
                ...newBatch,
                // Ensure numbers
                ingredients: newBatch.ingredients.map(i => ({
                    ...i,
                    weight: parseFloat(i.weight) || 0,
                    cost: parseFloat(i.cost) || 0
                }))
            }, session.access_token);

            toast({ title: 'Success', description: 'Batch created successfully' });
            setIsCreateDialogOpen(false);
            setNewBatch({
                batch_id: '',
                type: 'individual',
                ingredients: [{ name: '', weight: '', cost: '' }],
                final_product: '',
                status: 'Inbound',
            });
            fetchBatches();
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    };

    const deleteBatch = async (id) => {
        if (!session?.access_token) return;
        try {
            await api.delete(`/batches/${id}`, session.access_token);
            toast({ title: 'Deleted', description: 'Batch removed' });
            fetchBatches();
        } catch (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    };

    const filteredBatches = batches.filter(
        (b) =>
            b.batch_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.final_product || b.product || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return null;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Batch Tracking</h1>
                        <p className="text-muted-foreground">Manage and track your production batches</p>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                New Batch
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Create New Batch</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Batch ID</Label>
                                        <Input
                                            placeholder="BTH-001"
                                            value={newBatch.batch_id}
                                            onChange={(e) => setNewBatch({ ...newBatch, batch_id: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={newBatch.type}
                                            onChange={(e) => {
                                                const type = e.target.value;
                                                setNewBatch({
                                                    ...newBatch,
                                                    type,
                                                    ingredients: type === 'individual' ? [{ name: '', weight: '', cost: '' }] : newBatch.ingredients
                                                });
                                            }}
                                        >
                                            <option value="individual">Individual Product</option>
                                            <option value="group">Group Batch</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Final Product Expected</Label>
                                    <Input
                                        placeholder="e.g. Tomato Sauce"
                                        value={newBatch.final_product}
                                        onChange={(e) => setNewBatch({ ...newBatch, final_product: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label>Ingredients / Products</Label>
                                        {newBatch.type === 'group' && (
                                            <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                                                <Plus className="h-3 w-3 mr-1" /> Add
                                            </Button>
                                        )}
                                    </div>
                                    {newBatch.ingredients.map((ing, index) => (
                                        <div key={index} className="flex gap-2 items-end">
                                            <div className="flex-1">
                                                <Label className="text-xs">Item Name</Label>
                                                <Input
                                                    placeholder="Name"
                                                    value={ing.name}
                                                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                                                />
                                            </div>
                                            <div className="w-24">
                                                <Label className="text-xs">Weight (kg)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={ing.weight}
                                                    onChange={(e) => updateIngredient(index, 'weight', e.target.value)}
                                                />
                                            </div>
                                            <div className="w-24">
                                                <Label className="text-xs">Cost/kg</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    value={ing.cost}
                                                    onChange={(e) => updateIngredient(index, 'cost', e.target.value)}
                                                />
                                            </div>
                                            {newBatch.type === 'group' && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="mb-0.5"
                                                    onClick={() => removeIngredient(index)}
                                                >
                                                    <X className="h-4 w-4 text-destructive" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
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
                                    <TableHead>Stage</TableHead>
                                    <TableHead>Status (Custom)</TableHead>
                                    <TableHead>Input (kg)</TableHead>
                                    <TableHead>Loss %</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBatches.map((batch) => (
                                    <TableRow key={batch.id}>
                                        <TableCell className="font-mono font-medium">{batch.batch_id}</TableCell>
                                        <TableCell>{batch.final_product || batch.product}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={stageColors[batch.stage] || stageColors.inbound}>
                                                {stages.find(s => s.id === batch.stage)?.label || batch.stage}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground italic">
                                            "{batch.status}"
                                        </TableCell>
                                        <TableCell>{batch.input_weight}</TableCell>
                                        <TableCell>
                                            {batch.loss_percentage ? (
                                                <span className="text-destructive font-medium">
                                                    {batch.loss_percentage.toFixed(2)}%
                                                </span>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openStatusDialog(batch)}
                                                >
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
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
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            No batches found. Create your first batch to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Update Status Dialog */}
                <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Batch Status</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Current Stage</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={statusUpdate.stage}
                                    onChange={(e) => setStatusUpdate({ ...statusUpdate, stage: e.target.value })}
                                >
                                    {stages.map(s => (
                                        <option key={s.id} value={s.id}>{s.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Custom Status Message</Label>
                                <Input
                                    placeholder="e.g. In fermenter tank 2"
                                    value={statusUpdate.status}
                                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                                />
                            </div>

                            {selectedBatch?.type === 'group' && dialogIngredients.length > 0 && (
                                <div className="space-y-3 border-t pt-3">
                                    <Label className="text-sm font-semibold">Ingredient Updates</Label>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                        {dialogIngredients.map((ing, idx) => (
                                            <div key={idx} className="flex flex-col gap-2 p-2 rounded-md bg-muted/40 border">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium text-sm">{ing.name} ({ing.weight}kg)</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <Label className="text-[10px] text-muted-foreground">Status</Label>
                                                        <Input
                                                            className="h-8 text-xs"
                                                            placeholder="State"
                                                            value={ing.status}
                                                            onChange={(e) => handleDialogIngredientChange(idx, 'status', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-[10px] text-muted-foreground">Total Wastage (kg)</Label>
                                                        <Input
                                                            type="number"
                                                            className="h-8 text-xs"
                                                            placeholder="0"
                                                            value={ing.wastage}
                                                            onChange={(e) => handleDialogIngredientChange(idx, 'wastage', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button onClick={updateBatchStatus} className="w-full">
                                Update Status
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}

