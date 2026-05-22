import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServicesSection from '@/components/ServicesSection';

export default function ServicesPage() {
  return (
    <main className="bg-brand-base">
      <Navbar />
      <div className="pt-24 pb-12">
        <ServicesSection />
      </div>
      <Footer />
    </main>
  );
}
