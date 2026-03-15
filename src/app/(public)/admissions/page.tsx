import PageHeader from "@/components/layout/PageHeader";
import { CheckCircle, FileText, Calendar, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import AdmissionForm from "./AdmissionForm";

const steps = [
    { step: "01", icon: FileText, title: "Submit Application", desc: "Fill out the online admission form with student and parent/guardian details." },
    { step: "02", icon: Calendar, title: "Entrance Assessment", desc: "Students appear for a grade-appropriate written assessment and interview." },
    { step: "03", icon: CheckCircle, title: "Receive Offer Letter", desc: "Successful applicants receive an official offer letter within 5 working days." },
    { step: "04", icon: CreditCard, title: "Complete Enrollment", desc: "Pay the enrollment fee and submit required documents to confirm the seat." },
];

const requirements = [
    "Copy of Birth Certificate",
    "Last 2 years' Academic Transcripts",
    "Transfer Certificate from previous school",
    "Recent Passport-size Photographs (x4)",
    "Copy of Parent/Guardian CNIC",
    "Medical Fitness Certificate",
    "Character Certificate (for Class 6 onwards)",
];

const feeStructure = [
    { label: "Registration Fee (one-time)", amount: "PKR 5,000" },
    { label: "Admission Fee (one-time)", amount: "PKR 15,000" },
    { label: "Monthly Tuition — Primary", amount: "PKR 8,000/month" },
    { label: "Monthly Tuition — Middle", amount: "PKR 10,000/month" },
    { label: "Monthly Tuition — Secondary", amount: "PKR 12,000/month" },
    { label: "Annual Development Fee", amount: "PKR 20,000/year" },
];

export default function AdmissionsPage() {
    return (
        <div>
            <PageHeader
                title="Admissions"
                subtitle="Join the Smart Kids Flora family. Applications open for the 2026–27 academic session."
            />

            {/* CTA Banner */}
            <section className="py-12 bg-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-extrabold text-primary">Admissions are Open for 2026–27!</h2>
                        <p className="text-primary/70">Limited seats available – don&apos;t miss this opportunity.</p>
                    </div>
                    <Link href="/contact" className="px-8 py-4 bg-primary text-white font-bold rounded-xl flex items-center space-x-2 hover:bg-primary/90 transition-all shrink-0">
                        <span>Contact Admissions Office</span>
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>

            {/* Process */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Admission <span className="text-primary">Process</span></h2>
                        <p className="text-slate-500 text-lg">Simple, transparent, and student-friendly steps to join our school.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((s, i) => (
                            <div key={s.step} className="relative text-center group">
                                {i < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-slate-200 z-0"></div>
                                )}
                                <div className="relative z-10 w-20 h-20 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                                    <s.icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <span className="text-5xl font-extrabold text-slate-100 absolute top-0 left-1/2 -translate-x-1/2 -z-10 select-none">{s.step}</span>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements & Fee */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16">
                    {/* Requirements */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-extrabold text-slate-900">Required <span className="text-primary">Documents</span></h2>
                        <ul className="space-y-4">
                            {requirements.map((r) => (
                                <li key={r} className="flex items-start space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-700">{r}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Fee */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-extrabold text-slate-900">Fee <span className="text-primary">Structure</span></h2>
                        <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 overflow-hidden shadow-sm">
                            {feeStructure.map((f) => (
                                <div key={f.label} className="flex justify-between items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                                    <span className="text-slate-700 font-medium">{f.label}</span>
                                    <span className="text-primary font-extrabold">{f.amount}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400">* Fee subject to revision. Scholarships available for deserving students. Contact the admissions office for details.</p>
                    </div>
                </div>
            </section>

            {/* Application Form */}
            <section className="py-24 bg-white" id="apply-online">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AdmissionForm />
                </div>
            </section>
        </div>
    );
}
