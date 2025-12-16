
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Activity, ShieldCheck, BarChart3, Bell, ArrowRight, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            {/* Navbar */}
            <nav className="border-b border-border/40 backdrop-blur-md fixed w-full top-0 z-50 bg-background/80">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <Leaf className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">FoodFlow</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Button onClick={() => navigate("/dashboard")} variant="default">
                                Go to Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => navigate("/auth")}>
                                    Sign In
                                </Button>
                                <Button onClick={() => navigate("/auth")} variant="default">
                                    Get Started
                                </Button>
                            </>
                        )}

                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 pt-24">
                <section className="container mx-auto px-6 py-24 text-center space-y-8 animate-fade-in">
                    <div className="mx-auto max-w-3xl space-y-4">
                        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent pb-2">
                            Smart Food Processing & Waste Minimization
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Optimize your food processing workflow with real-time tracking, AI-powered quality assessment, and intelligent alerts to minimize waste and maximize efficiency.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button size="lg" className="px-8 text-lg h-12 gap-2 shadow-lg hover:shadow-xl transition-all" onClick={() => navigate(user ? "/dashboard" : "/auth")}>
                            {user ? "Go to Dashboard" : "Start Tracking Now"}
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="px-8 text-lg h-12 shadow-sm hover:bg-muted/50" onClick={() => {
                            const element = document.getElementById('features');
                            element?.scrollIntoView({ behavior: 'smooth' });
                        }}>
                            Learn More
                        </Button>
                    </div>

                    <div className="mt-16 rounded-xl border border-border/50 shadow-2xl overflow-hidden bg-muted/20 backdrop-blur-sm mx-auto max-w-5xl translate-y-4 opacity-0 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground transition-hover hover:scale-103 cursor-pointer  ">
                            <span className="text-sm">
                                <img src="./Preview.png" alt="Dashboard Preview" className="transition-transform duration-700 hover:scale-110 w-full h-full object-cover rounded-lg" />
                            </span>
                            {/* Placeholder for actual dashboard screenshot if available */}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="container mx-auto px-6 py-24">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need to Reduce Waste</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our comprehensive suite of tools helps you monitor every stage of production, identifying inefficiencies before they become waste.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Package}
                            title="Batch Tracking"
                            description="Monitor food batches in real-time as they move through processing, packaging, and dispatch stages with precision timings."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Quality Control"
                            description="AI-powered visual analysis instantly grades your produce, ensuring only the best quality makes it through while flagging potential compromises."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={BarChart3}
                            title="Advanced Analytics"
                            description="Gain deep insights into loss percentages, processing times, and efficiency trends with interactive, real-time charts."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={Bell}
                            title="Smart Alerts"
                            description="Get instant notifications for critical events, quality drops, or processing delays so you can take immediate corrective action."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={Activity}
                            title="Live Monitoring"
                            description="Keep a pulse on your facility with a live dashboard showing active batches, current waste rates, and impending bottlenecks."
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={Leaf}
                            title="Sustainability Metrics"
                            description="Track your environmental impact and see exactly how much food waste you're saving with our sustainability reporting."
                            delay={0.6}
                        />
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-primary/5 py-24">
                    <div className="container mx-auto px-6 text-center space-y-8">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary-foreground/90 text-foreground text-cyan-800">Ready to optimize your production?</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Join forward-thinking food processors using FoodFlow to cut waste and boost profitability.
                        </p>
                        <Button size="lg" className="px-8 text-lg h-12 shadow-lg hover:shadow-xl transition-all" onClick={() => navigate(user ? "/dashboard" : "/auth")}>
                            Get Started for Free
                        </Button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/40 bg-muted/30 py-12">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20">
                            <Leaf className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-semibold text-foreground">FoodFlow</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} FoodFlow. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slide-up opacity-0" style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}>
        <CardHeader>
            <div className="p-3 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <CardDescription className="text-base leading-relaxed">
                {description}
            </CardDescription>
        </CardContent>
    </Card>
);

export default Home;
