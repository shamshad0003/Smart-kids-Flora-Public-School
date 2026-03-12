import PageHeader from "@/components/layout/PageHeader";
import Image from "next/image";

const images = [
    { src: "/images/gallery/lab.png", title: "Science Lab", category: "Academics", span: "col-span-2 row-span-2" },
    { src: "/images/gallery/library.png", title: "School Library", category: "Resources", span: "" },
    { src: "/images/gallery/sports.png", title: "Sports Day", category: "Athletics", span: "" },
    { src: "/images/hero.png", title: "School Campus", category: "Campus", span: "" },
    { src: "/images/gallery/library.png", title: "Reading Corner", category: "Learning", span: "" },
    { src: "/images/gallery/sports.png", title: "Football Practice", category: "Sports", span: "col-span-2" },
];

const categories = ["All", "Academics", "Athletics", "Campus", "Learning", "Resources", "Sports"];

export default function GalleryPage() {
    return (
        <div>
            <PageHeader
                title="Photo Gallery"
                subtitle="A visual glimpse into the vibrant life and activities at Smart Kids Flora Public School."
            />

            {/* Category Filter (static for Phase 1) */}
            <section className="py-10 bg-white border-b border-slate-100 sticky top-16 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`shrink-0 px-5 py-2 rounded-full text-sm font-bold border transition-all ${cat === "All"
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
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px]">
                        {images.map((img, i) => (
                            <div
                                key={i}
                                className={`relative group rounded-2xl overflow-hidden shadow-md ${img.span}`}
                            >
                                <Image
                                    src={img.src}
                                    alt={img.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-5 left-5 text-white">
                                        <p className="text-xs font-bold text-secondary uppercase tracking-widest">{img.category}</p>
                                        <h3 className="text-lg font-extrabold">{img.title}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
