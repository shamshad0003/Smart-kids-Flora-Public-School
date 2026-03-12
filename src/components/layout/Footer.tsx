import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* School Info */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <div className="p-2 bg-secondary rounded-lg text-primary">
                                <GraduationCap className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight">
                                Flora <span className="text-secondary">Public</span>
                            </span>
                        </div>
                        <p className="text-blue-100/80 leading-relaxed">
                            Empowering young minds through quality education, holistic development, and a nurturing environment for over two decades.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-secondary hover:text-primary transition-all">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-secondary hover:text-primary transition-all">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-secondary hover:text-primary transition-all">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold border-b border-secondary/30 pb-2 inline-block">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Home', 'About Us', 'Academics', 'Admissions', 'Events', 'Gallery'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`}
                                        className="text-blue-100/70 hover:text-secondary transition-colors flex items-center group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold border-b border-secondary/30 pb-2 inline-block">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-blue-100/70">
                                <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                                <span>123 Knowledge Lane, Flora City, FC 56789</span>
                            </li>
                            <li className="flex items-center space-x-3 text-blue-100/70">
                                <Phone className="h-5 w-5 text-secondary shrink-0" />
                                <span>+1 (234) 567-890</span>
                            </li>
                            <li className="flex items-center space-x-3 text-blue-100/70">
                                <Mail className="h-5 w-5 text-secondary shrink-0" />
                                <span>info@florapubic.edu</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter/Motto */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold border-b border-secondary/30 pb-2 inline-block">Our Motto</h3>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 italic text-blue-100/80">
                            &quot;Learning for Life, Leading for Excellence.&quot;
                        </div>
                        <p className="text-sm text-blue-100/50">
                            Stay updated with our latest news and events.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-blue-100/50 text-sm italic">
                        &copy; {currentYear} Smart Kids Flora Public School. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm text-blue-100/50">
                        <a href="#" className="hover:text-secondary">Privacy Policy</a>
                        <a href="#" className="hover:text-secondary">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
