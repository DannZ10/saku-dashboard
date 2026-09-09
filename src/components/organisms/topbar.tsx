'use client';

import Link from 'next/link';
import { ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { Brand } from '@/components/atoms/brand';
import { navigation, View } from '@/components/organisms/navigation';
import type { User } from '@/lib/api';

export function Topbar({ view, user, menuOpen, onToggleMenu }: {
  view: View;
  user: User;
  menuOpen: boolean;
  onToggleMenu: () => void;
}) {
  return <header className="topbar">
    <div className="mobile-header"><Button variant="ghost" size="icon" aria-label="Buka menu" aria-expanded={menuOpen} onClick={onToggleMenu}><Menu/></Button><Link href="/"><Brand/></Link></div>
    <div className="desktop-breadcrumb">Dompet pribadi <ChevronRight size={13}/><strong>{view === 'detail' ? 'Detail transaksi' : navigation.find(item => item.view === view)?.label}</strong></div>
    <div className="topbar-right"><span className="session-badge"><span/>Sesi aktif</span><Link href="/account" className="header-account" aria-label="Lihat akun saya"><span className="user-avatar">{user.name.split(' ').slice(0, 2).map(name => name[0]).join('').toUpperCase()}</span><span className="header-user"><strong>{user.name}</strong><span>@{user.username}</span></span><ChevronRight size={14}/></Link></div>
  </header>;
}
