import Hero from "@/components/home/Hero";
import Announcements from "@/components/home/Announcements";
import QuickLinks from "@/components/home/QuickLinks";
import GalleryPreview from "@/components/home/GalleryPreview";
import ContactPreview from "@/components/home/ContactPreview";

export default function Home() {
  return (
    <div className="space-y-0">
      <Hero />
      <Announcements />
      <QuickLinks />
      <GalleryPreview />
      <ContactPreview />
    </div>
  );
}
