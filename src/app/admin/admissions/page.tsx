import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import AdmissionManager from '@/components/admin/AdmissionManager';

export const metadata: Metadata = {
  title: 'Manage Admissions | Admin Portal',
};

export default async function AdmissionsPage() {
  const admissions = await prisma.admission.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <AdmissionManager initialData={admissions} />
    </div>
  );
}
