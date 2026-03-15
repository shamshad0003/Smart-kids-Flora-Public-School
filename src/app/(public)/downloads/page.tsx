import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/layout/PageHeader";
import { FileText, Download, FolderArchive } from "lucide-react";

export default async function DownloadsPage() {
    // Fetch all downloads
    const downloads = await prisma.downloadFile.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div>
            <PageHeader
                title="Downloads & Resources"
                subtitle="Access important forms, syllabus, and study materials provided by the school."
            />

            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {downloads.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-3xl max-w-3xl mx-auto">
                            <FolderArchive className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Files Available</h3>
                            <p className="text-slate-500">There are no downloadable resources at this moment.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {downloads.map((file) => (
                                <div key={file.id} className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-primary/30 transition-all flex flex-col h-full relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                                    
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                                            {file.category}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-6 flex-1">
                                        {file.title}
                                    </h3>
                                    
                                    <a 
                                        href={file.fileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full py-3 bg-slate-50 text-primary font-bold border border-primary/20 rounded-xl flex items-center justify-center space-x-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all mt-auto"
                                    >
                                        <Download className="h-4 w-4" />
                                        <span>Download File</span>
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
