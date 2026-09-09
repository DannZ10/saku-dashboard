import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

export type NavEntry = { href: string; view: string; label: string; icon: LucideIcon };

// One navigation link, shared by the desktop sidebar and the mobile bottom bar.
// The parent decides which entry is active; mobile shortens two of the labels.
export function NavItem({ entry, active, mobile = false, onNavigate }: { entry: NavEntry; active: boolean; mobile?: boolean; onNavigate?: () => void }) {
  const { href, view, label, icon: Icon } = entry;
  const shown = mobile && view === 'transactions' ? 'Riwayat' : mobile && view === 'account' ? 'Akun' : label;
  return <Link href={href} onClick={onNavigate} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined}>
    <Icon size={19} strokeWidth={1.7}/><span>{shown}</span>{!mobile && active && <span className="nav-dot"/>}
  </Link>;
}
