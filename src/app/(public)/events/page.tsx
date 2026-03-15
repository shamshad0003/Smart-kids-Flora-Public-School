import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/layout/PageHeader";
import { Calendar, MapPin, Clock, Tag, SearchX } from "lucide-react";

export default async function EventsPage() {
    // Fetch upcoming events
    const events = await prisma.event.findMany({
        orderBy: {
            eventDate: 'asc',
        },
        where: {
            eventDate: {
                gte: new Date(),
            }
        }
    });

    return (
        <div>
            <PageHeader
                title="Events & Activities"
                subtitle="Stay up to date with the vibrant life at Smart Kids Flora Public School."
            />

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {events.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-3xl max-w-3xl mx-auto">
                            <SearchX className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Upcoming Events</h3>
                            <p className="text-slate-500">There are no scheduled events at this moment. Please check back later.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map((event) => {
                                const eventDate = new Date(event.eventDate);
                                return (
                                    <div key={event.id} className="rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group flex flex-col">
                                        {/* Color Header */}
                                        <div className="bg-primary px-6 py-4 flex items-center justify-between">
                                            <span className="text-white font-bold text-sm flex items-center space-x-1.5">
                                                <Tag className="h-4 w-4" />
                                                <span>Event</span>
                                            </span>
                                            <div className="bg-white/20 rounded-lg px-3 py-1 text-white text-xs font-semibold">
                                                Upcoming
                                            </div>
                                        </div>

                                        <div className="p-8 space-y-5 bg-slate-50 flex-1 flex flex-col">
                                            <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                                                {event.title}
                                            </h3>
                                            <p className="text-slate-600 text-sm leading-relaxed flex-1 line-clamp-3">
                                                {event.description}
                                            </p>

                                            <div className="space-y-2.5 pt-4 border-t border-slate-200 mt-auto">
                                                <div className="flex items-center space-x-3 text-sm text-slate-500">
                                                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                                                    <span>
                                                        {eventDate.toLocaleDateString(undefined, {
                                                            weekday: 'long', 
                                                            year: 'numeric', 
                                                            month: 'long', 
                                                            day: 'numeric' 
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-sm text-slate-500">
                                                    <Clock className="h-4 w-4 text-primary shrink-0" />
                                                    <span>
                                                        {eventDate.toLocaleTimeString(undefined, { 
                                                            hour: '2-digit', 
                                                            minute: '2-digit' 
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-sm text-slate-500">
                                                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                                                    <span className="truncate">{event.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
