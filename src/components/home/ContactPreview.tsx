"use client";

import React from 'react';

import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPreview() {
    return (
        <section className="py-24 bg-primary relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 border-4 border-white rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-white rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl">
                    <div className="grid lg:grid-cols-2">
                        {/* Contact Info */}
                        <div className="p-12 lg:p-20 bg-slate-900 text-white space-y-12">
                            <div className="space-y-4">
                                <h3 className="text-secondary font-bold tracking-widest uppercase text-sm">Get In Touch</h3>
                                <h4 className="text-4xl font-extrabold leading-tight">
                                    Have Questions? <br />
                                    <span className="text-secondary">We&apos;re Here to Help</span>
                                </h4>
                                <p className="text-slate-400 leading-relaxed max-w-md">
                                    Whether you&apos;re looking for information about admissions, curriculum, or life at our school, we&apos;re just a message away.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start space-x-6">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-secondary shrink-0">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-lg">Visit Us</h5>
                                        <p className="text-slate-400">123 Knowledge Lane, Flora City, FC 56789</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-secondary shrink-0">
                                        <Phone className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-lg">Call Us</h5>
                                        <p className="text-slate-400">+1 (234) 567-890</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-secondary shrink-0">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-lg">Email Us</h5>
                                        <p className="text-slate-400">info@florapubic.edu</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Contact Form */}
                        <div className="p-12 lg:p-20 bg-white space-y-10">
                            <div className="space-y-4">
                                <h4 className="text-2xl font-bold text-slate-900">Send us a quick message</h4>
                                <p className="text-slate-500">We usually respond within 24 hours.</p>
                            </div>

                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Subject</label>
                                    <select className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all">
                                        <option>Admissions Inquiry</option>
                                        <option>General Information</option>
                                        <option>Career Opportunities</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Your Message</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Tell us how we can help you..."
                                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                    ></textarea>
                                </div>

                                <button
                                    type="button"
                                    className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-primary/10"
                                >
                                    <span>Send Message</span>
                                    <Send className="h-5 w-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
