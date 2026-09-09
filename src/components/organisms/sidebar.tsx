'use client';

import Link from 'next/link';
import { ArrowUpRight, LoaderCircle, LogOut, ShieldCheck, X } from 'lucide-react';
import { Brand } from '@/components/atoms/brand';
import { NavItem } from '@/components/molecules/nav-item';
import { navigation, View } from '@/components/organisms/navigation';

export function Sidebar({ view, menu, onClose, onLogout, loggingOut }: {
  view: View;
  menu: boolean;
  onClose: () => void;
  onLogout: () => void;
  loggingOut: boolean;
}) {
  return <aside className={'sidebar' + (menu ? ' sidebar-open' : '')}>
    <div className="sidebar-brand"><Link href="/" aria-label="Saku — Ringkasan"><Brand/></Link><button className="sidebar-close" aria-label="Tutup menu" onClick={onClose}><X size={20}/></button></div>
    <div className="sidebar-section">DOMPETMU</div>
    <nav aria-label="Navigasi utama">{navigation.map(entry => <NavItem key={entry.href} entry={entry} active={view === entry.view || (view === 'detail' && entry.view === 'transactions')} onNavigate={onClose}/>)}</nav>
    <div className="sidebar-bottom"><div className="sidebar-note"><span className="sidebar-note-icon"><ShieldCheck size={20}/></span><strong>Di tanganmu.</strong><p>Saldo, penerima, dan setiap transaksi tercatat di sini.</p><Link href="/help">Kenali Saku <ArrowUpRight size={14}/></Link></div>
      <button className="logout-button" disabled={loggingOut} onClick={onLogout}>{loggingOut ? <LoaderCircle size={18} className="animate-spin"/> : <LogOut size={18}/>}Keluar akun</button>
      <span className="sidebar-version">SAKU BY KEMBARA.ID <span>© 2026</span></span>
    </div>
  </aside>;
}
