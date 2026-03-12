import PageHeader from "@/components/layout/PageHeader";
import { BookOpen, FlaskConical, Palette, Monitor, Music, Dumbbell } from "lucide-react";

const programs = [
    {
        level: "Primary (Classes 1–5)",
        color: "bg-blue-500",
        desc: "A play-based and inquiry-driven curriculum focusing on core literacy, numeracy, science, and social skills.",
        subjects: ["English", "Mathematics", "Science", "Social Studies", "Arts & Craft", "Physical Education"],
    },
    {
        level: "Middle School (Classes 6–8)",
        color: "bg-amber-500",
        desc: "Building critical thinking and subject mastery, preparing students for higher secondary studies.",
        subjects: ["English", "Mathematics", "Physics", "Chemistry", "Biology", "History", "Computer Science"],
    },
    {
        level: "Secondary (Classes 9–10)",
        color: "bg-green-500",
        desc: "Board-aligned rigorous curriculum preparing students for national/international examinations.",
        subjects: ["English", "Mathematics", "Sciences", "Social Sciences", "Elective Languages", "ICT"],
    },
];

const facilities = [
    { icon: FlaskConical, name: "Science Labs", desc: "Physics, Chemistry, and Biology labs with modern equipment." },
    { icon: Monitor, name: "Computer Lab", desc: "High-speed internet and the latest computers for digital learning." },
    { icon: Palette, name: "Art Studio", desc: "A dedicated space for fine arts, pottery, and creative expression." },
    { icon: Music, name: "Music Room", desc: "Instruments and trained faculty for vocal and instrumental music." },
    { icon: Dumbbell, name: "Sports Complex", desc: "Indoor & outdoor facilities for cricket, football, basketball, and more." },
    { icon: BookOpen, name: "Digital Library", desc: "10,000+ books and unlimited access to e-learning resources." },
];

export default function AcademicsPage() {
    return (
        <div>
            <PageHeader
                title="Academics"
                subtitle="A rigorous, engaging curriculum designed to inspire lifelong curiosity and excellence."
            />

            {/* Programs */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Academic <span className="text-primary">Programs</span></h2>
                        <p className="text-slate-500 text-lg">Structured learning pathways from foundational to advanced levels.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {programs.map((p) => (
                            <div key={p.level} className="border border-slate-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all">
                                <div className={`${p.color} p-6 text-white`}>
                                    <h3 className="text-xl font-extrabold text-white">{p.level}</h3>
                                </div>
                                <div className="p-8 space-y-6 bg-slate-50">
                                    <p className="text-slate-600 leading-relaxed">{p.desc}</p>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Core Subjects</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {p.subjects.map((sub) => (
                                                <span key={sub} className="px-3 py-1 bg-white text-primary text-sm font-medium rounded-full border border-primary/10 shadow-sm">
                                                    {sub}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Facilities */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">World-Class <span className="text-primary">Facilities</span></h2>
                        <p className="text-slate-500 text-lg">Infrastructure that enables hands-on, exploratory, and creative learning.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {facilities.map((f) => (
                            <div key={f.name} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 flex items-start space-x-5">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <f.icon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-1">{f.name}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
