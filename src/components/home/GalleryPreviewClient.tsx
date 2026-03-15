"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Maximize2, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '@prisma/client';

export default function GalleryPreviewClient({ items }: { items: GalleryItem[] }) {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-4">
                        <h2 className="text-primary font-bold tracking-widest uppercase text-sm">Visual Journey</h2>
                        <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                            Life at <span className="text-primary">Smart Kids Flora</span>
                        </h3>
                    </div>
                    <Link
                        href="/gallery"
                        className="group flex items-center space-x-2 text-primary font-bold"
                    >
                        <span>View Full Gallery</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 bg-slate-50 rounded-3xl border border-slate-100">
                        <ImageIcon className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-xl font-bold text-slate-700">Gallery is Empty</h3>
                        <p className="mt-2">Check back soon for photos of our life at the school.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {items.map((image, index) => (
                            <motion.div
                                key={image.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer bg-slate-100"
                            >
                                <Image
                                    src={image.imageUrl}
                                    alt={image.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-8 left-8 right-8 text-white">
                                        <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-2 block">
                                            {image.category}
                                        </span>
                                        <h4 className="text-2xl font-bold mb-4">{image.title}</h4>
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                            <Maximize2 className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
