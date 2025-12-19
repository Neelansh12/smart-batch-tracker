import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowLeft, CheckCircle2 } from "lucide-react";

const About = () => {
    const navigate = useNavigate();

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
                <div className="container mx-auto px-6 max-w-4xl">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        About FoodFlow
                    </h1>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            FoodFlow is on a mission to revolutionize the food processing industry by dramatically reducing waste through intelligent tracking and analysis.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 my-12">
                            <div className="bg-muted/30 p-8 rounded-2xl border border-border/50">
                                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                                <p className="text-muted-foreground">
                                    To empower food processors with data-driven tools that minimize waste, optimize quality, and maximize efficiency, contributing to a more sustainable global food system.
                                </p>
                            </div>
                            <div className="bg-muted/30 p-8 rounded-2xl border border-border/50">
                                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                                <p className="text-muted-foreground">
                                    A world where food waste is virtually eliminated from the processing chain, ensuring that the resources used to grow food are valued and preserved.
                                </p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mt-12 mb-6">Why We Started</h2>
                        <p className="text-muted-foreground">
                            We observed that a significant portion of food waste occurs not at the consumption level, but during processing and distribution. Inefficiencies, lack of real-time visibility, and delayed quality control were the main culprits.
                        </p>
                        <p className="text-muted-foreground">
                            FoodFlow was built to bridge this gap. By leveraging advanced sensors, AI-powered quality control, and real-time analytics, we give facility managers the "superpowers" to see problems before they become waste.
                        </p>

                        <h2 className="text-3xl font-bold mt-12 mb-6">Core Values</h2>
                        <ul className="space-y-4 list-none pl-0">
                            {[
                                "Sustainability First: Every feature we build is designed to reduce environmental impact.",
                                "Innovation: We constantly explore new technologies like AI and IoT to solve old problems.",
                                "Transparency: We believe in open data and clear insights for better decision making.",
                                "Integrity: We are committed to the highest standards of data security and ethical business practices."
                            ].map((item, index) => (
                                <li key={index} className="flex gap-3 items-start">
                                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                                    <span className="text-muted-foreground">{item}</span>
                                </li>
                            ))}
                        </ul>
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

export default About;
