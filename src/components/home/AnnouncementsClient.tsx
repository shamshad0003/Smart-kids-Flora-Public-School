"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Announcement } from '@prisma/client';

export default function AnnouncementsClient({ announcements }: { announcements: Announcement[] }) {
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
                        href="/announcements"
                        className="group flex items-center space-x-2 text-primary font-bold hover:text-secondary transition-colors"
                    >
                        <span>View All Announcements</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {announcements.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-bold text-slate-700">No Announcements Yet</h3>
                        <p>Check back later for the latest news and updates.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {announcements.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-muted p-8 rounded-3xl border border-slate-100 hover:border-secondary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col"
                            >
                                <div className="absolute top-8 right-8 text-primary/10 group-hover:text-secondary/20 transition-colors">
                                    <Bell className="h-12 w-12" />
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center space-x-3">
                                        <span className="px-3 py-1 bg-white text-primary text-xs font-bold rounded-full shadow-sm">
                                            {item.category}
                                        </span>
                                        <div className="flex items-center text-slate-400 text-xs">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-slate-600 leading-relaxed text-sm line-clamp-3">
                                        {item.content}
                                    </p>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-200/50">
                                    <Link
                                        href="/announcements"
                                        className="inline-flex items-center text-primary font-bold text-sm group-hover:underline"
                                    >
                                        Read More
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
