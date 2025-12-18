import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { lazy, Suspense, useEffect } from "react";
import PageLoader from "./components/PageLoader";

// Eager load Home
import Home from "./pages/Home";

// Lazy load other pages
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Batches = lazy(() => import("./pages/Batches"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Alerts = lazy(() => import("./pages/Alerts"));
const QualityUpload = lazy(() => import("./pages/QualityUpload"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
    // Background prefetching
    useEffect(() => {
        const prefetchRoutes = async () => {
            // Small delay to prioritize initial render
            await new Promise(resolve => setTimeout(resolve, 2000));

            try {
                const routes = [
                    import("./pages/Index"),
                    import("./pages/Auth"),
                    import("./pages/Batches"),
                    import("./pages/Analytics"),
                    import("./pages/Alerts"),
                    import("./pages/QualityUpload"),
                    import("./pages/Settings"),
                    import("./pages/NotFound")
                ];
                await Promise.all(routes);
                console.log("Background prefetching completed");
            } catch (error) {
                console.error("Prefetching failed:", error);
            }
        };

        prefetchRoutes();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                        <Suspense fallback={<PageLoader />}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/dashboard" element={<Index />} />
                                <Route path="/auth" element={<Auth />} />
                                <Route path="/batches" element={<Batches />} />
                                <Route path="/analytics" element={<Analytics />} />
                                <Route path="/alerts" element={<Alerts />} />
                                <Route path="/quality-upload" element={<QualityUpload />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                    </BrowserRouter>
                </TooltipProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
