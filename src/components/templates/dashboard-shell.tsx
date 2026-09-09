'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowUpRight, LoaderCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { api, ApiError, Wallet } from '@/lib/api';
import { Brand } from '@/components/atoms/brand';
import { Button } from '@/components/atoms/button';
import { headings, View } from '@/components/organisms/navigation';
import { SessionGuard } from '@/components/organisms/session-guard';
import { Sidebar } from '@/components/organisms/sidebar';
import { Topbar } from '@/components/organisms/topbar';
import { MobileNav } from '@/components/organisms/mobile-nav';
import { Overview } from '@/components/organisms/overview';
import { ActionPanel } from '@/components/organisms/action-panel';
import { AccountPanel } from '@/components/organisms/account-panel';
import { HelpPanel } from '@/components/organisms/help-panel';
import { TransactionTable } from '@/components/organisms/transaction-table';
import { TransactionDetail } from '@/components/organisms/transaction-detail';

/**
 * Container for the whole authenticated dashboard: it owns wallet data, session
 * state, and layout, then hands each view its slice as props. Route pages stay
 * thin wrappers that only choose the view.
 */
export function DashboardShell({ view = 'overview', transactionId }: { view?: View; transactionId?: string }) {
  const client = useQueryClient();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [copied, setCopied] = useState('');
  const wallet = useQuery({ queryKey: ['wallet'], queryFn: () => api<Wallet>('wallet') });
  const unauthorized = (wallet.error instanceof ApiError && wallet.error.status === 401) || wallet.data === null;
  useEffect(() => {
    if (unauthorized) { client.removeQueries({ queryKey: ['transactions'] }); router.replace('/login'); }
  }, [unauthorized, client, router]);
  useEffect(() => {
    if (!menu) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenu(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menu]);
  const logout = useMutation({
    mutationFn: () => api('logout', {}),
    onSuccess: () => { client.clear(); router.replace('/login'); },
    onError: error => { if (error instanceof ApiError && error.status === 401) { client.clear(); router.replace('/login'); } },
  });
  if (wallet.isPending || unauthorized) return <main className="loading-screen"><Brand/><LoaderCircle className="animate-spin" aria-label="Memuat akun"/><p>Menyiapkan dompetmu…</p></main>;
  if (!wallet.data) return <main className="loading-screen"><Brand/><p role="alert">{wallet.error?.message ?? 'Saldo belum dapat dimuat.'}</p><Button onClick={() => wallet.refetch()}>Coba lagi</Button></main>;
  const data = wallet.data;
  const title = headings[view];
  const copy = async (value: string) => {
    try { await navigator.clipboard.writeText(value); setCopied('Berhasil disalin.'); }
    catch { setCopied('Belum bisa menyalin. Pilih teks dan salin secara manual.'); }
  };
  const refresh = () => { void wallet.refetch(); void client.invalidateQueries({ queryKey: ['transactions'] }); };

  return <div className="app-shell">
    <a href="#main-content" className="skip-link">Lewati navigasi</a>
    <SessionGuard/>
    <div className="ambient-light" aria-hidden="true"/>
    {menu && <button className="menu-scrim" aria-label="Tutup navigasi" onClick={() => setMenu(false)}/>}
    <Sidebar view={view} menu={menu} onClose={() => setMenu(false)} onLogout={() => logout.mutate()} loggingOut={logout.isPending}/>
    <div className="main-shell">
      <Topbar view={view} user={data.user} menuOpen={menu} onToggleMenu={() => setMenu(!menu)}/>
      <main className="dashboard-content" id="main-content">
        <div className="page-heading"><div><span className="eyebrow">{title[0]}</span><h1>{view === 'overview' ? <>Halo, {data.user.name.split(' ')[0]}<span className="greeting-dot">.</span></> : title[1]}</h1><p>{title[2]}</p></div><div className="heading-actions">{view === 'overview' || view === 'transactions' ? <Button variant="outline" size="icon" aria-label="Perbarui saldo dan riwayat" onClick={refresh} disabled={wallet.isFetching}><RefreshCw className={wallet.isFetching ? 'animate-spin' : ''}/></Button> : null}<span className="date-label"><span>HARI INI</span>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div></div>
        {logout.error && <p role="alert" className="error-banner">Gagal keluar. {logout.error.message}</p>}
        {wallet.error && <p role="alert" className="error-banner">Data terakhir ditampilkan. {wallet.error.message}</p>}
        {view === 'overview' && <Overview data={data} hidden={hidden} onToggleHidden={() => setHidden(!hidden)}/>}
        {(view === 'topup' || view === 'transfer') && <ActionPanel mode={view} data={data} onDone={transaction => router.push('/transactions/' + transaction.id)}/>}
        {view === 'transactions' && <><div className="history-intro"><span><ShieldCheck size={17}/>Hanya transaksi akunmu</span><span>Nominal dalam Rupiah (IDR)</span></div><TransactionTable/></>}
        {view === 'detail' && transactionId && <TransactionDetail id={transactionId}/>}
        {view === 'account' && <AccountPanel data={data} copied={copied} onCopy={copy} onLogout={() => logout.mutate()} loggingOut={logout.isPending}/>}
        {view === 'help' && <HelpPanel/>}
        <footer className="dashboard-footer"><span>saku. <span>by kembara.id · Dompet pribadi, tertata.</span></span><Link href="/help">Panduan & batas transaksi <ArrowUpRight size={13}/></Link></footer>
      </main>
    </div>
    <MobileNav view={view} onNavigate={() => setMenu(false)}/>
  </div>;
}
