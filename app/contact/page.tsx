import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <main className="bg-brand-base">
      <Navbar />
      <div className="pt-24 pb-12">
        <ContactForm />
      </div>
      <Footer />
    </main>
  );
}
