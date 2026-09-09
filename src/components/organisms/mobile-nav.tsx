'use client';

import { NavItem } from '@/components/molecules/nav-item';
import { navigation, View } from '@/components/organisms/navigation';

export function MobileNav({ view, onNavigate }: { view: View; onNavigate: () => void }) {
  return <nav className="mobile-nav" aria-label="Navigasi seluler">
    {navigation.filter(entry => entry.view !== 'help').map(entry => <NavItem key={entry.href} entry={entry} mobile active={view === entry.view || (view === 'detail' && entry.view === 'transactions')} onNavigate={onNavigate}/>)}
  </nav>;
}
