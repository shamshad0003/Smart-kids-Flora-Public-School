"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Academics', href: '/academics' },
  { name: 'Admissions', href: '/admissions' },
  { name: 'Events', href: '/events' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className={`p-2 rounded-lg transition-colors ${
              scrolled ? 'bg-primary text-white' : 'bg-white/20 backdrop-blur-sm text-white'
            }`}>
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className={`font-bold text-xl tracking-tight transition-colors ${
              scrolled ? 'text-primary' : 'text-white'
            }`}>
              Flora <span className="text-secondary">Public</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-secondary ${
                  pathname === link.href 
                    ? 'text-secondary font-bold' 
                    : scrolled ? 'text-foreground' : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/admissions" 
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                scrolled 
                  ? 'bg-primary text-white hover:bg-primary/90' 
                  : 'bg-secondary text-primary hover:bg-white'
              }`}
            >
              Enroll Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${
                scrolled ? 'text-primary' : 'text-white'
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium transition-colors ${
                    pathname === link.href 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-4 px-3">
                <Link 
                  href="/admissions"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-3 rounded-lg bg-primary text-white font-bold"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
