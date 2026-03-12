"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const announcements = [
    {
        id: 1,
        title: "Annual Sports Meet 2026",
        date: "March 15, 2026",
        category: "Events",
        content: "Registration for the annual sports meet is now open for all grades. Join us for a day of athletic excellence."
    },
    {
        id: 2,
        title: "Admission Open for Session 2026-27",
        date: "Ongoing",
        category: "Admissions",
        content: "We are now accepting applications for the upcoming academic year. Limited seats available in Primary sections."
    },
    {
        id: 3,
        title: "Eco-Friendly Campus Initiative",
        date: "Feb 28, 2026",
        category: "News",
        content: "Smart Kids Flora is going green! We've installed solar panels and started a comprehensive recycling program."
    }
];

export default function Announcements() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center space-x-2 text-primary font-bold tracking-wider uppercase text-sm">
                            <span className="w-8 h-[2px] bg-secondary"></span>
                            <span>Latest Updates</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
                            News & <span className="text-primary italic">Announcements</span>
                        </h2>
                    </div>
                    <Link
                        href="/events"
                        className="group flex items-center space-x-2 text-primary font-bold hover:text-secondary transition-colors"
                    >
                        <span>View All Events</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {announcements.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-muted p-8 rounded-3xl border border-slate-100 hover:border-secondary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all"
                        >
                            <div className="absolute top-8 right-8 text-primary/10 group-hover:text-secondary/20 transition-colors">
                                <Bell className="h-12 w-12" />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <span className="px-3 py-1 bg-white text-primary text-xs font-bold rounded-full shadow-sm">
                                        {item.category}
                                    </span>
                                    <div className="flex items-center text-slate-400 text-xs">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        {item.date}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {item.content}
                                </p>

                                <Link
                                    href="/events"
                                    className="inline-flex items-center text-primary font-bold text-sm group-hover:underline"
                                >
                                    Read More
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
