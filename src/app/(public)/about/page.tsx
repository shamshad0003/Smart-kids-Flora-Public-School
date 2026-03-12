import PageHeader from "@/components/layout/PageHeader";
import { Target, Eye, Heart } from "lucide-react";

const values = [
    { icon: Target, title: "Our Mission", desc: "To provide a world-class education that equips students with the knowledge, skills, and values needed to lead meaningful lives and contribute positively to society." },
    { icon: Eye, title: "Our Vision", desc: "To be a beacon of academic excellence, nurturing globally competent citizens who are ethical, innovative, and committed to lifelong learning." },
    { icon: Heart, title: "Our Values", desc: "Integrity, Respect, Excellence, Compassion, Curiosity, and Teamwork form the core of everything we do at Smart Kids Flora Public School." },
];

const stats = [
    { value: "20+", label: "Years of Excellence" },
    { value: "5000+", label: "Happy Alumni" },
    { value: "98%", label: "Board Results" },
    { value: "25+", label: "Expert Faculty" },
];

const team = [
    { name: "Dr. Sarah Ahmed", role: "Principal", initials: "SA", color: "bg-blue-500" },
    { name: "Mr. James Patel", role: "Vice Principal", initials: "JP", color: "bg-amber-500" },
    { name: "Ms. Fatima Noor", role: "Head of Academics", initials: "FN", color: "bg-green-500" },
    { name: "Mr. Daniel Khan", role: "Head of Sports", initials: "DK", color: "bg-purple-500" },
];

export default function AboutPage() {
    return (
        <div>
            <PageHeader
                title="About Our School"
                subtitle="Building a legacy of excellence, character, and innovation since 2005."
            />

            {/* Stats Strip */}
            <section className="bg-secondary py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((s) => (
                            <div key={s.label}>
                                <div className="text-4xl font-extrabold text-primary">{s.value}</div>
                                <div className="text-sm font-semibold text-primary/70 mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission / Vision / Values */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
                            What <span className="text-primary">Drives Us</span>
                        </h2>
                        <p className="text-slate-500 text-lg">Our core pillars define who we are and guide everything we do.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((v) => (
                            <div key={v.title} className="p-10 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                                    <v.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{v.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* History */}
            <section className="py-24 bg-primary text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-extrabold">Our <span className="text-secondary">Story</span></h2>
                            <p className="text-blue-100/80 leading-relaxed">Founded in 2005 by a group of visionary educators, Smart Kids Flora Public School started as a small primary school with 120 students and 8 teachers. Over two decades, we&apos;ve grown into a full K-12 institution renowned for academic and co-curricular excellence.</p>
                            <p className="text-blue-100/80 leading-relaxed">We believe every child is uniquely gifted. Our teachers are not just instructors — they are mentors who inspire, guide, and celebrate each student&apos;s journey.</p>
                        </div>
                        <div className="space-y-4">
                            {[
                                { year: "2005", event: "School founded with 120 students" },
                                { year: "2010", event: "Expanded to secondary classes (Grades 6–10)" },
                                { year: "2015", event: "Achieved government 'A+' accreditation" },
                                { year: "2020", event: "Launched digital learning infrastructure" },
                                { year: "2025", event: "Celebrated 20 years of excellence" },
                            ].map((item) => (
                                <div key={item.year} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                    <span className="bg-secondary text-primary text-sm font-extrabold px-3 py-1 rounded-lg shrink-0">{item.year}</span>
                                    <p className="text-blue-100/80">{item.event}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Meet Our <span className="text-primary">Leadership</span></h2>
                        <p className="text-slate-500 text-lg">Guided by passionate educators with decades of experience.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((m) => (
                            <div key={m.name} className="text-center p-8 rounded-3xl bg-slate-50 hover:shadow-xl transition-all">
                                <div className={`w-20 h-20 ${m.color} rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg`}>
                                    {m.initials}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{m.name}</h3>
                                <p className="text-sm text-primary font-medium">{m.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
