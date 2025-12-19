import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowLeft, Calendar, User, Newspaper } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const News = () => {
    const navigate = useNavigate();

    const newsItems = [
        {
            title: "FoodFlow Raises Series B to Expand AI Capabilities",
            date: "July 12, 2024",
            author: "Press Team",
            excerpt: "We are excited to announce a new round of funding led by GreenTech Ventures to accelerate our development of next-gen computer vision models.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
        },
        {
            title: "Partnership Announcement: FoodFlow x AgriCorp",
            date: "June 28, 2024",
            author: "Partnerships",
            excerpt: "A strategic alliance to bring end-to-end traceability from farm to fork, ensuring quality and reducing waste at every step of the supply chain.",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2613&auto=format&fit=crop"
        },
        {
            title: "New Feature: Real-time Carbon Footprint Tracking",
            date: "June 10, 2024",
            author: "Product Team",
            excerpt: "Our latest update allows facility managers to see the carbon impact of their waste reduction efforts in real-time.",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop"
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
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                                News Center
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Latest updates, announcements, and press releases.
                            </p>
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Newspaper className="h-4 w-4" />
                            Media Kit
                        </Button>
                    </div>

                    <div className="space-y-8">
                        {newsItems.map((item, index) => (
                            <Card key={index} className="overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                                        <div
                                            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${item.image})`, backgroundColor: '#e2e8f0' }}
                                        />
                                    </div>
                                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-3">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {item.date}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {item.author}
                                            </div>
                                        </div>
                                        <CardTitle className="text-2xl mb-3 group-hover:text-primary transition-colors">
                                            {item.title}
                                        </CardTitle>
                                        <p className="text-muted-foreground leading-relaxed mb-4">
                                            {item.excerpt}
                                        </p>
                                        <div>
                                            <span className="text-sm font-semibold text-primary flex items-center gap-1">
                                                Read more <ArrowLeft className="h-3 w-3 rotate-180" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
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

export default News;
