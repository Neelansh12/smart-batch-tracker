import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, ArrowRight, BrainCircuit, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"


export default function CostCalculations() {
    const { user, session } = useAuth();
    const [calculations, setCalculations] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        product_name: '',
        packet_size: '',
        ingredient_cost: '',    // per packet
        processing_charge: '',  // per packet
        packing_charge: '',     // per packet
        misc_charge: '',        // per packet
        delivery_total_cost: '',
        delivery_batch_size: '', // qty
        selling_price: ''
    });

    const [results, setResults] = useState(null); // Live results

    // AI Dialog State
    const [aiDialogOpen, setAiDialogOpen] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        if (session?.access_token) fetchCalculations();
    }, [session]);

    // Live Calculation Logic
    useEffect(() => {
        calculateLive();
    }, [formData]);

    const fetchCalculations = async () => {
        try {
            const data = await api.get('/costs', session?.access_token);
            setCalculations(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateLive = () => {
        const ing = parseFloat(formData.ingredient_cost) || 0;
        const proc = parseFloat(formData.processing_charge) || 0;
        const pack = parseFloat(formData.packing_charge) || 0;
        const misc = parseFloat(formData.misc_charge) || 0;

        const delTotal = parseFloat(formData.delivery_total_cost) || 0;
        const delQty = parseFloat(formData.delivery_batch_size) || 1;
        const delPerUnit = delQty > 0 ? (delTotal / delQty) : 0;

        const totalCost = ing + proc + pack + misc + delPerUnit;
        const selling = parseFloat(formData.selling_price) || 0;
        const profit = selling - totalCost;
        const profitPercent = totalCost > 0 ? ((profit / totalCost) * 100) : 0;

        setResults({
            totalCost: totalCost.toFixed(2),
            deliveryPerUnit: delPerUnit.toFixed(2),
            profit: profit.toFixed(2),
            profitPercent: profitPercent.toFixed(2),
            isProfit: profit >= 0
        });
    };

    const handleSave = async () => {
        if (!formData.product_name || !formData.selling_price) {
            toast({ title: "Error", description: "Product Name and Selling Price are required", variant: "destructive" });
            return;
        }

        try {
            setLoading(true);
            const payload = {
                ...formData,
                ingredient_cost: parseFloat(formData.ingredient_cost) || 0,
                processing_charge: parseFloat(formData.processing_charge) || 0,
                packing_charge: parseFloat(formData.packing_charge) || 0,
                misc_charge: parseFloat(formData.misc_charge) || 0,
                delivery_total_cost: parseFloat(formData.delivery_total_cost) || 0,
                delivery_batch_size: parseFloat(formData.delivery_batch_size) || 1,
                selling_price: parseFloat(formData.selling_price) || 0,
            };

            await api.post('/costs', payload, session.access_token);
            toast({ title: "Saved", description: "Calculation saved successfully" });
            fetchCalculations();

            // Optional: Reset form ?
            // setFormData({ ...initialState });
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = async (calc) => {
        setAiAnalysis('');
        setAiDialogOpen(true);
        setAnalyzing(true);
        try {
            const res = await api.post(`/costs/${calc._id}/analyze`, {}, session.access_token);
            setAiAnalysis(res.analysis);

            // Update local state to cache it
            setCalculations(prev => prev.map(c =>
                c._id === calc._id ? { ...c, ai_analysis: res.analysis } : c
            ));
        } catch (error) {
            setAiAnalysis("Failed to get analysis. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Calculator className="h-6 w-6" />
                        Cost Calculations
                    </h1>
                    <p className="text-muted-foreground">Calculate margins and get AI-driven optimization tips.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calculator Form */}
                    <Card className="lg:col-span-2 border-primary/20 shadow-md">
                        <CardHeader>
                            <CardTitle>New Calculation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Product Name</Label>
                                    <Input name="product_name" placeholder="Tomato Ketchup" value={formData.product_name} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Packet Size</Label>
                                    <Input name="packet_size" placeholder="1 kg" value={formData.packet_size} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Ingredients (per unit)</Label>
                                    <Input type="number" name="ingredient_cost" placeholder="0.00" value={formData.ingredient_cost} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Processing (per unit)</Label>
                                    <Input type="number" name="processing_charge" placeholder="0.00" value={formData.processing_charge} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Packing (per unit)</Label>
                                    <Input type="number" name="packing_charge" placeholder="0.00" value={formData.packing_charge} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Misc Charges</Label>
                                    <Input type="number" name="misc_charge" placeholder="0.00" value={formData.misc_charge} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                                <Label className="mb-2 block font-semibold text-xs uppercase tracking-wide">Transport / Delivery</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Total Transport Cost</Label>
                                        <Input type="number" name="delivery_total_cost" placeholder="0.00" value={formData.delivery_total_cost} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Total Units transported</Label>
                                        <Input type="number" name="delivery_batch_size" placeholder="1" value={formData.delivery_batch_size} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-1 text-right">
                                    Cost per unit: <span className="font-mono text-foreground font-medium">{results?.deliveryPerUnit}</span>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-primary font-semibold">Selling Price (Per Unit)</Label>
                                <Input type="number" name="selling_price" placeholder="0.00" className="border-primary/30" value={formData.selling_price} onChange={handleInputChange} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center bg-muted/20 border-t p-4">
                            <div className="text-sm">
                                <div className="flex gap-4">
                                    <span>Total Cost: <span className="font-bold">₹{results?.totalCost}</span></span>
                                    <span className={results?.isProfit ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                        {results?.isProfit ? "Profit" : "Loss"}: ₹{Math.abs(results?.profit)} ({results?.profitPercent}%)
                                    </span>
                                </div>
                            </div>
                            <Button onClick={handleSave} disabled={loading}>
                                {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
                                Save Calculation
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Recent Calculations List */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Recent Calculations</h2>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                            {calculations.map(calc => (
                                <Card key={calc._id} className="relative transition-all hover:shadow-md">
                                    <CardContent className="p-4 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold">{calc.product_name}</h3>
                                                <p className="text-xs text-muted-foreground">{calc.packet_size} • SP: ₹{calc.selling_price}</p>
                                            </div>
                                            <Badge variant={calc.profit_loss_amount >= 0 ? "default" : "destructive"}>
                                                {calc.profit_loss_percentage.toFixed(1)}%
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                                            <div>Cost: ₹{calc.total_cost_per_unit.toFixed(2)}</div>
                                            <div className={calc.profit_loss_amount >= 0 ? "text-green-600" : "text-red-500"}>
                                                {calc.profit_loss_amount >= 0 ? "+" : ""}₹{calc.profit_loss_amount.toFixed(2)}
                                            </div>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200"
                                            onClick={() => handleAnalyze(calc)}
                                        >
                                            <BrainCircuit className="h-3 w-3 mr-2" />
                                            AI Analysis
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                            {calculations.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No recent calculations.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Analysis Dialog */}
                <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <BrainCircuit className="h-5 w-5 text-indigo-600" />
                                AI Profit Optimization
                            </DialogTitle>
                            <DialogDescription>
                                Analysis based on your cost structure using Gemini 2.0 Flash.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 min-h-[100px] text-sm leading-relaxed">
                            {analyzing ? (
                                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                                    <p className="text-muted-foreground">Analyzing cost effectiveness...</p>
                                </div>
                            ) : (
                                <div className="prose prose-sm dark:prose-invert">
                                    <p className="whitespace-pre-wrap">{aiAnalysis}</p>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
