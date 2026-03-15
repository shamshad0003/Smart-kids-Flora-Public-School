"use client";

import React, { useState } from 'react';
import Image from "next/image";
import { GalleryItem } from '@prisma/client';
import { ImageIcon } from 'lucide-react';

export default function GalleryClient({ initialItems, categories }: { initialItems: GalleryItem[], categories: string[] }) {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredItems = selectedCategory === "All" 
        ? initialItems 
        : initialItems.filter(item => item.category === selectedCategory);

    return (
        <>
            {/* Category Filter */}
            <section className="py-10 bg-white border-b border-slate-100 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold border transition-all ${
                                    selectedCategory === cat
                                        ? "bg-primary text-white border-primary"
                                        : "border-slate-200 text-slate-600 hover:border-primary hover:text-primary bg-white"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-16 bg-slate-50 min-h-[500px]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredItems.length === 0 ? (
                        <div className="text-center py-20">
                            <ImageIcon className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                            <h3 className="text-xl font-bold text-slate-700">No images found</h3>
                            <p className="mt-2 text-slate-500">There are no photos in this category yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
                            {filteredItems.map((img, i) => {
                                // Dynamic span logic based on index just to mimic the original masonry-like layout
                                let spanClass = "";
                                if (i === 0) spanClass = "col-span-1 md:col-span-2 row-span-2";
                                else if (i === 5) spanClass = "col-span-1 md:col-span-2";

                                return (
                                    <div
                                        key={img.id}
                                        className={`relative group rounded-2xl overflow-hidden shadow-md bg-slate-200 ${spanClass}`}
                                    >
                                        <Image
                                            src={img.imageUrl}
                                            alt={img.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="absolute bottom-5 left-5 text-white">
                                                <p className="text-xs font-bold text-secondary uppercase tracking-widest">{img.category}</p>
                                                <h3 className="text-lg font-extrabold">{img.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
