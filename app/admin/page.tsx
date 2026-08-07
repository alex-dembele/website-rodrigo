import type { Metadata } from 'next';
import AdminApp from '@/components/admin/AdminApp';
import { adminConfigured } from '@/lib/admin/session';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Espace de gestion',
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  // Le mot de passe reste sur le serveur : la page reçoit seulement
  // l'information « un mot de passe est configuré ».
  return <AdminApp configured={adminConfigured()} />;
}
