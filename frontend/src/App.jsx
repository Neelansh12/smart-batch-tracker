import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
<<<<<<< HEAD:src/App.jsx
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
=======
import Index from "./pages/Index";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Batches from "./pages/Batches";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import QualityUpload from "./pages/QualityUpload";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Insights from "./pages/Insights";
import News from "./pages/News";
import NotFound from "./pages/NotFound";

import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
>>>>>>> f33b072b3e1bf2de2cf4bc8c5fcbe665b137b73d:frontend/src/App.jsx
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
<<<<<<< HEAD:src/App.jsx
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
=======
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/dashboard" element={<Index />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/batches" element={<Batches />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/alerts" element={<Alerts />} />
                            <Route path="/quality-upload" element={<QualityUpload />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/insights" element={<Insights />} />
                            <Route path="/news" element={<News />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </TooltipProvider>
            </ThemeProvider>
        </AuthProvider>
    </QueryClientProvider>
);

>>>>>>> f33b072b3e1bf2de2cf4bc8c5fcbe665b137b73d:frontend/src/App.jsx

export default App;
