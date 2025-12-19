import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { CloudSun, Droplets, Wind, ThermometerSun, Search, MapPin, Sprout, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function EnvironmentalWidget() {
    const { session } = useAuth();
    const [city, setCity] = useState('');
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [aiAnalysis, setAiAnalysis] = useState('');
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        // Default to a known location if none selected (e.g. New York) or try geolocation API
        // For now, we will wait for user input or just load a default
        if (!location) {
            handleSearch('Mumbai'); // Default to Mumbai as example
        }
    }, []);

    const handleSearch = async (searchCity) => {
        if (!searchCity) return;
        setLoading(true);
        try {
            // 1. Geocoding
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchCity}`);
            const geoData = await geoRes.json();

            if (!geoData || geoData.length === 0) {
                alert('Location not found');
                setLoading(false);
                return;
            }

            const { lat, lon, display_name } = geoData[0];
            setLocation({ name: display_name.split(',')[0], lat, lon });

            // 2. Fetch Environmental Data (Open-Meteo)
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,rain,soil_temperature_0cm,soil_moisture_0_to_1cm`;
            const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`;

            const [weatherRes, aqiRes] = await Promise.all([
                fetch(weatherUrl),
                fetch(aqiUrl)
            ]);

            const weatherData = await weatherRes.json();
            const aqiData = await aqiRes.json();

            const envData = {
                temperature: weatherData.current.temperature_2m,
                humidity: weatherData.current.relative_humidity_2m,
                rain: weatherData.current.rain,
                soilTemp: weatherData.current.soil_temperature_0cm,
                soilMoisture: weatherData.current.soil_moisture_0_to_1cm,
                aqi: aqiData.current.us_aqi,
                units: weatherData.current_units
            };

            setData(envData);

            // 3. Trigger AI Analysis
            fetchAIAnalysis(display_name.split(',')[0], envData);

        } catch (error) {
            console.error("Failed to fetch environmental data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAIAnalysis = async (locName, envData) => {
        if (!session?.access_token) return;
        setAnalyzing(true);
        try {
            const response = await api.post('/environmental/analyze', {
                location: locName,
                weather: { temp: envData.temperature, humidity: envData.humidity, rain: envData.rain },
                soil: { temp: envData.soilTemp, moisture: envData.soilMoisture },
                aqi: envData.aqi
            }, session.access_token);

            setAiAnalysis(response.analysis);
        } catch (error) {
            console.error("AI Analysis error", error);
            setAiAnalysis("Could not generate AI insights at this time.");
        } finally {
            setAnalyzing(false);
        }
    };

    const getAQIStatus = (aqi) => {
        if (aqi <= 50) return { label: 'Good', color: 'bg-emerald-500/20 text-emerald-500' };
        if (aqi <= 100) return { label: 'Moderate', color: 'bg-yellow-500/20 text-yellow-500' };
        if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'bg-orange-500/20 text-orange-500' };
        return { label: 'Unhealthy', color: 'bg-red-500/20 text-red-500' };
    };

    return (
        <Card className="col-span-full">
            <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <CloudSun className="h-5 w-5 text-primary" />
                            Environmental Conditions
                        </CardTitle>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Input
                            placeholder="Search city..."
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(city)}
                            className="max-w-[200px]"
                        />
                        <Button size="icon" onClick={() => handleSearch(city)}>
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                ) : data ? (
                    <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Temperature */}
                            <div className="p-4 rounded-xl bg-muted/50 flex flex-col items-center justify-center text-center">
                                <ThermometerSun className="h-8 w-8 text-orange-400 mb-2" />
                                <span className="text-2xl font-bold">{data.temperature}{data.units.temperature_2m}</span>
                                <span className="text-sm text-muted-foreground">Temperature</span>
                            </div>

                            {/* Humidity & Rain */}
                            <div className="p-4 rounded-xl bg-muted/50 flex flex-col items-center justify-center text-center">
                                <Droplets className="h-8 w-8 text-blue-400 mb-2" />
                                <span className="text-2xl font-bold">{data.humidity}{data.units.relative_humidity_2m}</span>
                                <span className="text-sm text-muted-foreground">Humidity ({data.rain}mm rain)</span>
                            </div>

                            {/* Soil */}
                            <div className="p-4 rounded-xl bg-muted/50 flex flex-col items-center justify-center text-center">
                                <Sprout className="h-8 w-8 text-green-500 mb-2" />
                                <span className="text-2xl font-bold">{data.soilMoisture}{data.units.soil_moisture_0_to_1cm}</span>
                                <span className="text-sm text-muted-foreground">Soil Moisture ({data.soilTemp}{data.units.soil_temperature_0cm})</span>
                            </div>

                            {/* AQI */}
                            <div className="p-4 rounded-xl bg-muted/50 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                <Wind className="h-8 w-8 text-slate-400 mb-2" />
                                <span className="text-2xl font-bold">{data.aqi}</span>
                                <Badge variant="secondary" className={`mt-1 ${getAQIStatus(data.aqi).color}`}>
                                    {getAQIStatus(data.aqi).label}
                                </Badge>
                                <span className="text-sm text-muted-foreground mt-1">Air Quality Index</span>
                            </div>
                        </div>

                        {/* AI Insights */}
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                            <h4 className="flex items-center gap-2 font-semibold text-primary mb-2">
                                <Activity className="h-4 w-4" />
                                AI Efficiency Tips & Precautions for {location?.name}
                            </h4>
                            {analyzing ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            ) : (
                                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                                    {aiAnalysis || "No insights available."}
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Enter a location to see environmental data.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
