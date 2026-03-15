import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/layout/PageHeader";
import { Bell, Calendar } from "lucide-react";

// Server component
export default async function AnnouncementsPage() {
    // Fetch all published announcements, newest first
    const announcements = await prisma.announcement.findMany({
        where: {
            published: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div>
            <PageHeader
                title="Announcements"
                subtitle="Stay updated with the latest news, notices, and important information from Smart Kids Flora Public School."
            />

            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {announcements.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-3xl">
                            <Bell className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Announcements</h3>
                            <p className="text-slate-500">There are no published announcements at this moment. Please check back later.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {announcements.map((announcement) => (
                                <div key={announcement.id} className="relative group bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:border-primary/20 transition-all overflow-hidden flex flex-col md:flex-row gap-6">
                                    {/* Left accent line */}
                                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary/10 group-hover:bg-primary transition-colors"></div>
                                    
                                    {/* Icon Column */}
                                    <div className="hidden md:flex flex-col items-center justify-start pt-2">
                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                                            <Bell className="h-6 w-6" />
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1 space-y-3 pl-4 md:pl-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full border border-secondary/20 uppercase tracking-wider">
                                                {announcement.category}
                                            </span>
                                            <div className="flex items-center text-slate-500 text-sm">
                                                <Calendar className="h-4 w-4 mr-1.5" />
                                                {new Date(announcement.createdAt).toLocaleDateString(undefined, {
                                                    weekday: 'long', 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                                            {announcement.title}
                                        </h3>
                                        
                                        <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                            {announcement.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
