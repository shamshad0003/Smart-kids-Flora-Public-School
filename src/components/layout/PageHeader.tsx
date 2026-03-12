"use client";

import React from 'react';
import { motion } from 'framer-motion';


interface PageHeaderProps {
    title: string;
    subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <section className="pt-32 pb-20 bg-primary relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white">
                        {title}
                    </h1>
                    <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full"></div>
                    <p className="text-xl text-blue-100/80 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
