import PageHeader from "@/components/layout/PageHeader";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

const contactInfo = [
    {
        icon: MapPin,
        title: "Our Location",
        lines: ["123 Knowledge Lane", "Flora City, FC 56789"],
        color: "bg-blue-500",
    },
    {
        icon: Phone,
        title: "Call Us",
        lines: ["+1 (234) 567-890", "+1 (234) 567-891 (Admin)"],
        color: "bg-green-500",
    },
    {
        icon: Mail,
        title: "Email Us",
        lines: ["info@florapublic.edu", "admissions@florapublic.edu"],
        color: "bg-amber-500",
    },
    {
        icon: Clock,
        title: "Office Hours",
        lines: ["Mon – Fri: 8:00 AM – 4:00 PM", "Sat: 9:00 AM – 1:00 PM"],
        color: "bg-purple-500",
    },
];

export default function ContactPage() {
    return (
        <div>
            <PageHeader
                title="Contact Us"
                subtitle="We're always happy to hear from parents, students, and the community. Reach out to us anytime."
            />

            {/* Contact Info Cards */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                        {contactInfo.map((info) => (
                            <div key={info.title} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center hover:shadow-xl transition-all">
                                <div className={`w-14 h-14 ${info.color} rounded-2xl mx-auto flex items-center justify-center text-white mb-5 shadow-lg`}>
                                    <info.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-lg font-extrabold text-slate-900 mb-2">{info.title}</h3>
                                {info.lines.map((line) => (
                                    <p key={line} className="text-slate-500 text-sm">{line}</p>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Contact Form + Map */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Form */}
                        <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Send us a Message</h2>
                            <p className="text-slate-500 mb-8">We respond to all inquiries within 24 business hours.</p>

                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Full Name *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., John Doe"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Email Address *</label>
                                        <input
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+1 (234) 567-890"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Subject *</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition">
                                        <option value="">Select a subject...</option>
                                        <option>Admissions Inquiry</option>
                                        <option>Academic Information</option>
                                        <option>Fee & Payment</option>
                                        <option>Transport/Logistics</option>
                                        <option>General Information</option>
                                        <option>Career Opportunities</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Message *</label>
                                    <textarea
                                        rows={5}
                                        placeholder="Write your message here..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="button"
                                    className="w-full py-4 bg-primary text-white font-extrabold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary/10"
                                >
                                    <span>Send Message</span>
                                    <Send className="h-5 w-5" />
                                </button>
                            </form>
                        </div>

                        {/* Map Placeholder + Details */}
                        <div className="space-y-8">
                            <div className="w-full h-80 rounded-3xl overflow-hidden bg-slate-200 border border-slate-100 flex items-center justify-center relative shadow-md">
                                <div className="text-center space-y-3">
                                    <MapPin className="h-12 w-12 text-primary mx-auto" />
                                    <p className="text-slate-600 font-bold">123 Knowledge Lane, Flora City</p>
                                    <p className="text-slate-400 text-sm">Interactive map coming soon</p>
                                </div>
                            </div>

                            <div className="bg-primary text-white p-8 rounded-3xl space-y-5">
                                <h3 className="text-xl font-extrabold text-white">Admissions Office</h3>
                                <p className="text-blue-100/70 leading-relaxed">
                                    For urgent admission queries, please contact our dedicated admissions team directly. We are available during office hours to guide you through the enrollment process.
                                </p>
                                <div className="flex items-center space-x-3 text-blue-100/80 text-sm">
                                    <Phone className="h-4 w-4 text-secondary" />
                                    <span>+1 (234) 567-891</span>
                                </div>
                                <div className="flex items-center space-x-3 text-blue-100/80 text-sm">
                                    <Mail className="h-4 w-4 text-secondary" />
                                    <span>admissions@florapublic.edu</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
