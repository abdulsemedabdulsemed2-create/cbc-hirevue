import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Video, Mic, Lightbulb, ArrowRight } from "lucide-react";

const Intro = () => {
return (
<div className="min-h-screen bg-background">
<Navbar />

<div className="max-w-5xl mx-auto px-6 py-10">
<div className="mb-8">
<h1 className="text-3xl font-bold text-foreground">HireVue Practice Guide</h1>
<p className="text-muted-foreground mt-2">
Quick tips so you don’t freeze up on camera and you sound sharp every time.
</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* How to use this site */}
<div className="rounded-xl border border-border/60 bg-card p-6">
<div className="flex items-center gap-3 mb-4">
<Video className="h-6 w-6 text-primary" />
<h2 className="text-xl font-semibold text-foreground">How to use this practice</h2>
</div>

<ul className="space-y-3 text-sm text-muted-foreground">
<li className="flex gap-2">
<CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
Pick a company and start the session.
</li>
<li className="flex gap-2">
<CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
Hit <span className="text-foreground font-medium">Start</span> to record and answer the prompt out loud.
</li>
<li className="flex gap-2">
<CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
After you stop, review your recording and redo it if needed.
</li>
<li className="flex gap-2">
<CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
Focus on clarity, structure, and confidence — not perfection.
</li>
</ul>
</div>

{/* Pros do this */}
<div className="rounded-xl border border-border/60 bg-card p-6">
<div className="flex items-center gap-3 mb-4">
<Lightbulb className="h-6 w-6 text-primary" />
<h2 className="text-xl font-semibold text-foreground">How pros do HireVue</h2>
</div>

<div className="space-y-4 text-sm text-muted-foreground">
<div className="flex gap-3">
<Clock className="h-5 w-5 text-primary shrink-0" />
<div>
<p className="text-foreground font-medium">Use a simple structure</p>
<p>Try: 1) Answer, 2) Evidence/example, 3) Close strong.</p>
</div>
</div>

<div className="flex gap-3">
<Mic className="h-5 w-5 text-primary shrink-0" />
<div>
<p className="text-foreground font-medium">Sound calm</p>
<p>Slow down, pause on purpose, and keep sentences short.</p>
</div>
</div>

<div className="flex gap-3">
<Video className="h-5 w-5 text-primary shrink-0" />
<div>
<p className="text-foreground font-medium">Look clean on camera</p>
<p>Camera at eye level, face lit, simple background, no noise.</p>
</div>
</div>
</div>
</div>

{/* Setup checklist */}
<div className="rounded-xl border border-border/60 bg-card p-6 md:col-span-2">
<h2 className="text-xl font-semibold text-foreground mb-4">30-second setup checklist</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
<div className="rounded-lg border border-border/60 bg-secondary/40 p-4">
<p className="text-foreground font-medium mb-1">Lighting</p>
<p>Face a window or lamp. Avoid backlight.</p>
</div>
<div className="rounded-lg border border-border/60 bg-secondary/40 p-4">
<p className="text-foreground font-medium mb-1">Audio</p>
<p>Quiet room. Speak a little louder than normal.</p>
</div>
<div className="rounded-lg border border-border/60 bg-secondary/40 p-4">
<p className="text-foreground font-medium mb-1">Delivery</p>
<p>Smile, breathe, then start strong.</p>
</div>
</div>

<div className="mt-6 flex flex-col sm:flex-row gap-3">
<a href="/interview" className="inline-flex">
<Button className="rounded-lg">
Start Practice <ArrowRight className="h-4 w-4" />
</Button>
</a>
<a href="/admin" className="inline-flex">
<Button variant="secondary" className="rounded-lg">
Edit Questions
</Button>
</a>
</div>
</div>
</div>
</div>

{/* LinkedIn button */}
<a
href="https://www.linkedin.com/in/abdulsemed-abdulsemed-098a4a265"
target="_blank"
rel="noopener noreferrer"
className="fixed bottom-4 left-4 z-50 rounded-full border border-border bg-card/90 p-2 shadow-lg hover:bg-muted transition"
>
<img src="/linkedin.png" alt="LinkedIn" width={40} height={40} className="rounded-full" />
</a>
</div>
);
};

export default Intro;