import { redirect } from 'next/navigation';
import { DEFAULT_COUNTRY, DEFAULT_LOCALE } from '@/lib/constants';

export default function RootPage() {
  // Redirect to default country/locale
  redirect(`/${DEFAULT_COUNTRY}/${DEFAULT_LOCALE}/shop`);
}
