import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowLeft, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Insights = () => {
    const navigate = useNavigate();

    const articles = [
        {
            title: "The State of Food Waste in 2024",
            category: "Industry Report",
            date: "May 15, 2024",
            summary: "A deep dive into the latest statistics on global food waste and the emerging trends in waste reduction technologies.",
            icon: BarChart3,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "AI in Quality Control: A Case Study",
            category: "Technology",
            date: "June 2, 2024",
            summary: "How computer vision is revolutionizing the sorting process, reducing false positives by 40% in large-scale facilities.",
            icon: TrendingUp,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: "Optimizing Batch Flows for Efficiency",
            category: "Best Practices",
            date: "June 20, 2024",
            summary: "Actionable strategies for facility managers to streamline batch movements and minimize idle time between processing stages.",
            icon: PieChart,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            {/* Navbar */}
            <nav className="border-b border-border/40 backdrop-blur-md fixed w-full top-0 z-50 bg-background/80">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <Leaf className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">FoodFlow</span>
                    </div>
                    <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </div>
            </nav>

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Insights & Data
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Explore trends, reports, and expert analysis on food processing efficiency and waste management.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article, index) => (
                            <Card key={index} className="flex flex-col border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg ${article.bg} flex items-center justify-center mb-4`}>
                                        <article.icon className={`h-6 w-6 ${article.color}`} />
                                    </div>
                                    <div className="text-sm font-medium text-muted-foreground mb-1">
                                        {article.category} • {article.date}
                                    </div>
                                    <CardTitle className="text-xl">{article.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <CardDescription className="text-base leading-relaxed">
                                        {article.summary}
                                    </CardDescription>
                                    <Button variant="link" className="px-0 mt-4 text-primary hover:text-primary/80">
                                        Read full report <ArrowLeft className="h-4 w-4 rotate-180 ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-20 p-8 rounded-3xl bg-primary/5 border border-primary/10 text-center">
                        <h2 className="text-3xl font-bold mb-4">Want deeper insights?</h2>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Sign up for our monthly whitepaper series to get exclusive data and benchmarks from across the industry.
                        </p>
                        <Button size="lg" className="rounded-full px-8">
                            Subscribe to Insights
                        </Button>
                    </div>
                </div>
            </main>

            <footer className="border-t border-border/40 py-8 bg-muted/20">
                <div className="container mx-auto px-6 text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} FoodFlow Inc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Insights;
