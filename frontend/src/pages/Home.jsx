import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Activity, ShieldCheck, BarChart3, Bell, ArrowRight, Leaf } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ModeToggle } from "@/components/mode-toggle";

const Home = () => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 pt-24">
                <Hero />
                <DashboardPreview />
                <Features />
                <Footer />
            </main>
        </div>
    );
};

const Navbar = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    return (
        <nav className="border-b border-border/40 backdrop-blur-md fixed w-full top-0 z-50 bg-background/80">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Leaf className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">FoodFlow</span>
                </div>
                <div className="flex items-center gap-4">
                    <ModeToggle />
                    {user ? (
                        <div className="flex items-center gap-2">
                            <Button onClick={() => navigate("/dashboard")} variant="default">
                                Go to Dashboard
                            </Button>
                            <Button onClick={() => signOut()} variant="outline">
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <>

                            <Button onClick={() => navigate("/auth")} variant="default">
                                Get Started
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const Hero = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <section className="relative py-24 text-center space-y-8 animate-fade-in overflow-hidden">
            <div className="absolute inset-0 w-full h-full z-0">
                <video
                    src="/media/foodhome.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="mx-auto max-w-3xl space-y-4">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-white drop-shadow-md pb-2">
                        Smart Food Processing & <br />
                        <span className="text-primary dark:text-primary-foreground">Waste Minimization</span>
                    </h1>
                    <p className="text-xl text-white/90 leading-relaxed font-medium drop-shadow-sm">
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
            </div>
        </section>
    );
};

const DashboardPreview = () => (
    <div className="container mx-auto px-6 mt-12 relative z-20">
        <div className="rounded-xl border border-border/50 shadow-2xl overflow-hidden bg-muted/20 backdrop-blur-sm mx-auto max-w-5xl translate-y-4 opacity-0 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground transition-hover hover:scale-103 cursor-pointer">
                <span className="text-sm w-full h-full">
                    {/* Dark Mode Preview */}
                    <img
                        src="/media/Preview.png"
                        alt="Dashboard Preview (Dark)"
                        className="hidden dark:block transition-transform duration-700 hover:scale-110 w-full h-full object-cover rounded-lg"
                    />
                    {/* Light Mode Preview */}
                    <img
                        src="/media/Preview2.png"
                        alt="Dashboard Preview (Light)"
                        className="block dark:hidden transition-transform duration-700 hover:scale-110 w-full h-full object-cover rounded-lg"
                    />
                </span>
            </div>
        </div>
    </div>
);

const Features = () => (
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
);

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <div className="animate-slide-up opacity-0" style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}>
        <Card className="h-full border-border/50 shadow-sm hover:shadow-xl hover-spin-360">
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
    </div>
);

const Footer = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <section className="bg-muted/30 py-20 text-foreground">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <h2 className="text-5xl font-bold tracking-tight text-foreground">
                                Let's <span className="text-primary">Talk</span>
                            </h2>
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                            Discover how FoodFlow can help.
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 py-7 text-lg font-medium shadow-none transition-transform hover:scale-105"
                        onClick={() => navigate(user ? "/dashboard" : "/auth")}
                    >
                        Get a Demo
                    </Button>
                </div>

                <hr className="border-border mb-12" />

                <div className="flex flex-col lg:flex-row justify-between gap-12">
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                        <Link to="/about" className="font-medium text-foreground hover:text-primary transition-colors">About FoodFlow</Link>
                        <Link to="/insights" className="font-medium text-foreground hover:text-primary transition-colors">Insights</Link>
                        <Link to="/news" className="font-medium text-foreground hover:text-primary transition-colors">News Center</Link>
                    </div>
                    <div className="flex flex-col gap-8 lg:items-end">
                        <div className="text-sm text-muted-foreground space-y-2 lg:text-right">
                            <p>Copyright © {new Date().getFullYear()} FoodFlow Inc. All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
