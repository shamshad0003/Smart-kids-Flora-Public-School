"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Users } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-primary">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero.png"
                    alt="Smart Kids Flora Public School Campus"
                    fill
                    priority
                    className="object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-white space-y-8"
                    >
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-secondary text-sm font-semibold">
                            <Star className="h-4 w-4 fill-secondary" />
                            <span>Excellence in Education since 2005</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                            Shaping <span className="text-secondary">Future Leaders</span> Today
                        </h1>

                        <p className="text-lg md:text-xl text-blue-100/80 max-w-xl leading-relaxed">
                            At Smart Kids Flora Public School, we provide a holistic learning environment that fosters creativity, critical thinking, and character building.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link
                                href="/admissions"
                                className="w-full sm:w-auto px-8 py-4 bg-secondary text-primary font-bold rounded-xl hover:bg-white transition-all flex items-center justify-center space-x-2 shadow-xl shadow-secondary/20"
                            >
                                <span>Apply for Admission</span>
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                            <Link
                                href="/about"
                                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center"
                            >
                                Learn More
                            </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-secondary">98%</span>
                                <span className="text-sm text-blue-100/60 font-medium">Success Rate</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-secondary">25+</span>
                                <span className="text-sm text-blue-100/60 font-medium">Expert Teachers</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-secondary">15:1</span>
                                <span className="text-sm text-blue-100/60 font-medium">Student Ratio</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side Decoration/Floating Elements */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="hidden lg:block relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden border-8 border-white/10 shadow-2xl">
                            <Image
                                src="/images/hero.png"
                                alt="School Environment"
                                width={600}
                                height={450}
                                className="object-cover"
                            />
                        </div>

                        {/* Floating Badges */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-2xl z-20 flex items-center space-x-3"
                        >
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Govt. Certified</p>
                                <p className="text-xs text-slate-500">Excellence Award 2024</p>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-2xl z-20 flex items-center space-x-3"
                        >
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">5000+ Alumni</p>
                                <p className="text-xs text-slate-500">Leading Global Careers</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Wave Divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-white">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>
        </section>
    );
}
