import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, Sparkles, Loader2, Image as ImageIcon, Trash2, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function QualityUpload() {
    const { user, session, loading } = useAuth();
    const navigate = useNavigate();
    const [uploads, setUploads] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [notes, setNotes] = useState('');
    const [selectedUpload, setSelectedUpload] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        if (user && session?.access_token) fetchUploads();
    }, [user, session]);

    const fetchUploads = async () => {
        try {
            const data = await api.get('/quality', session?.access_token);
            setUploads(data || []);
        } catch (error) {
            // fail silent
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const uploadAndAnalyze = async () => {
        if (!selectedFile || !user || !session?.access_token) return;

        setIsUploading(true);
        setIsAnalyzing(false);

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('notes', notes);

            await api.upload('/quality', formData, session.access_token);

            toast({ title: 'Success', description: 'Image analyzed successfully!' });
            setSelectedFile(null);
            setPreview(null);
            setNotes('');
            fetchUploads();
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to process image',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
            setIsAnalyzing(false);
        }
    };

    const deleteUpload = async (id) => {
        if (!session?.access_token) return;
        try {
            await api.delete(`/quality/${id}`, session.access_token);
            toast({ title: 'Deleted', description: 'Upload removed' });
            fetchUploads();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete upload', variant: 'destructive' });
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-amber-400';
        return 'text-red-400';
    };

    if (loading) return null;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Camera className="h-6 w-6" />
                        Quality Upload
                    </h1>
                    <p className="text-muted-foreground">
                        Upload images of raw materials for AI-powered quality scoring
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Upload Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Upload New Image
                            </CardTitle>
                            <CardDescription>
                                Upload an image of raw materials for AI analysis
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div
                                className={cn(
                                    'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                                    preview ? 'border-primary' : 'border-border hover:border-primary/50'
                                )}
                                onClick={() => document.getElementById('file-input')?.click()}
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                                ) : (
                                    <>
                                        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                        <p className="text-muted-foreground">Click to upload or drag and drop</p>
                                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                                    </>
                                )}
                                <input
                                    id="file-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes (optional)</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Add any notes about this sample..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <Button
                                onClick={uploadAndAnalyze}
                                disabled={!selectedFile || isUploading || isAnalyzing}
                                className="w-full"
                            >
                                {isUploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                {isAnalyzing && <Sparkles className="h-4 w-4 mr-2 animate-pulse" />}
                                {isUploading ? 'Uploading...' : isAnalyzing ? 'Analyzing...' : 'Upload & Analyze'}
                            </Button>

                            {(isUploading || isAnalyzing) && (
                                <div className="space-y-2">
                                    <Progress value={isUploading ? 50 : 100} className="h-2" />
                                    <p className="text-xs text-center text-muted-foreground">
                                        {isUploading ? 'Uploading image...' : 'AI analyzing quality...'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Selected Upload Details */}
                    {selectedUpload && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5" />
                                    Analysis Results
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <img
                                    src={selectedUpload.image_url}
                                    alt="Analyzed"
                                    className="w-full h-48 object-cover rounded-lg"
                                />

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground">Quality</p>
                                        <p className={cn('text-2xl font-bold', getScoreColor(selectedUpload.quality_score || 0))}>
                                            {selectedUpload.quality_score || '-'}%
                                        </p>
                                    </div>
                                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground">Freshness</p>
                                        <p className={cn('text-2xl font-bold', getScoreColor(selectedUpload.freshness_score || 0))}>
                                            {selectedUpload.freshness_score || '-'}%
                                        </p>
                                    </div>
                                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground">Defects</p>
                                        <p className={cn('text-2xl font-bold', getScoreColor(100 - (selectedUpload.defect_score || 0)))}>
                                            {selectedUpload.defect_score || '-'}%
                                        </p>
                                    </div>
                                </div>

                                {selectedUpload.ai_analysis && (
                                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                            <Sparkles className="h-4 w-4" />
                                            AI Analysis
                                        </h4>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                            {selectedUpload.ai_analysis}
                                        </p>
                                    </div>
                                )}

                                {selectedUpload.notes && (
                                    <div>
                                        <h4 className="font-medium mb-1">Notes</h4>
                                        <p className="text-sm text-muted-foreground">{selectedUpload.notes}</p>
                                    </div>
                                )}

                                <Button variant="outline" onClick={() => setSelectedUpload(null)} className="w-full">
                                    Close
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Previous Uploads */}
                <Card>
                    <CardHeader>
                        <CardTitle>Previous Uploads ({uploads.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {uploads.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No uploads yet</p>
                                <p className="text-sm">Upload your first image to get started</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {uploads.map((upload) => (
                                    <div
                                        key={upload.id}
                                        className="group relative rounded-lg overflow-hidden border bg-card"
                                    >
                                        <img
                                            src={upload.image_url}
                                            alt="Quality check"
                                            className="w-full h-32 object-cover"
                                        />
                                        <div className="p-3">
                                            <div className="flex justify-between items-center mb-2">
                                                <Badge variant={upload.quality_score && upload.quality_score >= 70 ? 'default' : 'destructive'}>
                                                    {upload.quality_score ? `${upload.quality_score}%` : 'Pending'}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(upload.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1"
                                                    onClick={() => setSelectedUpload(upload)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => deleteUpload(upload.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
