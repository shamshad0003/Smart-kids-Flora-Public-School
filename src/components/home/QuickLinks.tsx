"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Users, Trophy, Bus, Library, FlaskConical } from 'lucide-react';

const quickLinks = [
    {
        title: "Primary Academic",
        description: "Holistic curriculum for early childhood development and foundational learning.",
        icon: BookOpen,
        href: "/academics",
        color: "bg-blue-500"
    },
    {
        title: "Admissions",
        description: "Simple and transparent admission process for the upcoming academic session.",
        icon: Users,
        href: "/admissions",
        color: "bg-amber-500"
    },
    {
        title: "Achievements",
        description: "Celebrating our students' excellence in academics, sports, and arts.",
        icon: Trophy,
        href: "/about",
        color: "bg-green-500"
    },
    {
        title: "Transport",
        description: "Safe and reliable transport facility covering all major routes in the city.",
        icon: Bus,
        href: "/contact",
        color: "bg-purple-500"
    },
    {
        title: "Digital Library",
        description: "Access to thousands of books, journals, and digital resources for students.",
        icon: Library,
        href: "/academics",
        color: "bg-red-500"
    },
    {
        title: "Science Labs",
        description: "State-of-the-art laboratories for hands-on practical learning experiences.",
        icon: FlaskConical,
        href: "/academics",
        color: "bg-cyan-500"
    }
];

export default function QuickLinks() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-primary font-bold tracking-widest uppercase text-sm">Explore Our School</h2>
                    <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                        Comprehensive Facilities for <span className="text-primary">Holistic Growth</span>
                    </h3>
                    <p className="text-slate-600 text-lg">
                        We provide everything a student needs to excel in a rapidly changing world.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {quickLinks.map((link, index) => (
                        <motion.div
                            key={link.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all"
                        >
                            <div className={`w-14 h-14 ${link.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-${link.color.split('-')[1]}-200`}>
                                <link.icon className="h-7 w-7" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-3">{link.title}</h4>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                {link.description}
                            </p>
                            <Link
                                href={link.href}
                                className="text-primary font-bold inline-flex items-center group"
                            >
                                <span>Learn More</span>
                                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
