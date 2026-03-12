import PageHeader from "@/components/layout/PageHeader";
import { Calendar, MapPin, Clock, Tag } from "lucide-react";

const events = [
    {
        title: "Annual Sports Meet 2026",
        date: "March 15, 2026",
        time: "8:00 AM – 5:00 PM",
        location: "School Sports Ground",
        category: "Sports",
        color: "bg-green-500",
        desc: "A full day of athletic events across all grade levels — track & field, team sports, and award ceremonies. All parents are cordially invited."
    },
    {
        title: "Science & Technology Fair",
        date: "April 3, 2026",
        time: "10:00 AM – 3:00 PM",
        location: "School Auditorium & Labs",
        category: "Academics",
        color: "bg-blue-500",
        desc: "Students present innovative projects in science, technology, engineering, and mathematics. Open to parents and community members."
    },
    {
        title: "Cultural Heritage Week",
        date: "April 14–18, 2026",
        time: "All Day",
        location: "Entire Campus",
        category: "Cultural",
        color: "bg-purple-500",
        desc: "A week-long celebration of culture through music, dance, crafts, and food festivals representing the diverse backgrounds of our student community."
    },
    {
        title: "Parent-Teacher Conference",
        date: "May 2, 2026",
        time: "9:00 AM – 12:00 PM",
        location: "Respective Classrooms",
        category: "Academic",
        color: "bg-amber-500",
        desc: "Scheduled meetings for parents to discuss their child's academic progress with class teachers. Booking via the school office."
    },
    {
        title: "Inter-School Debate Competition",
        date: "May 20, 2026",
        time: "9:00 AM – 4:00 PM",
        location: "School Auditorium",
        category: "Co-Curricular",
        color: "bg-red-500",
        desc: "Our students compete against schools from across the district in prepared and impromptu debate categories. Come cheer them on!"
    },
    {
        title: "End-of-Year Ceremony & Prize Distribution",
        date: "June 15, 2026",
        time: "5:00 PM – 8:00 PM",
        location: "School Hall",
        category: "Ceremony",
        color: "bg-cyan-500",
        desc: "Celebrating the achievements of the academic year. Top performers in academics, sports, and co-curriculars are recognized and awarded."
    },
];

export default function EventsPage() {
    return (
        <div>
            <PageHeader
                title="Events & Activities"
                subtitle="Stay up to date with the vibrant life at Smart Kids Flora Public School."
            />

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <div key={event.title} className="rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group">
                                {/* Color Header */}
                                <div className={`${event.color} px-6 py-4 flex items-center justify-between`}>
                                    <span className="text-white font-bold text-sm flex items-center space-x-1.5">
                                        <Tag className="h-4 w-4" />
                                        <span>{event.category}</span>
                                    </span>
                                    <div className="bg-white/20 rounded-lg px-3 py-1 text-white text-xs font-semibold">
                                        Upcoming
                                    </div>
                                </div>

                                <div className="p-8 space-y-5 bg-slate-50">
                                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-primary transition-colors leading-tight">
                                        {event.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{event.desc}</p>

                                    <div className="space-y-2.5 pt-2 border-t border-slate-200">
                                        <div className="flex items-center space-x-3 text-sm text-slate-500">
                                            <Calendar className="h-4 w-4 text-primary shrink-0" />
                                            <span>{event.date}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm text-slate-500">
                                            <Clock className="h-4 w-4 text-primary shrink-0" />
                                            <span>{event.time}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm text-slate-500">
                                            <MapPin className="h-4 w-4 text-primary shrink-0" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
