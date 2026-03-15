import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import EventManager from '@/components/admin/EventManager';

export const metadata: Metadata = {
  title: 'Manage Events | Admin Portal',
};

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <EventManager initialData={events} />
    </div>
  );
}
