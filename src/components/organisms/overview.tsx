'use client';

import Link from 'next/link';
import { ArrowDownLeft, ArrowRight, ArrowUpRight, ChevronRight, Eye, EyeOff, Plus, ShieldCheck, UserRound, WalletCards } from 'lucide-react';
import { rupiah, Wallet } from '@/lib/api';
import { Button } from '@/components/atoms/button';
import { ActivityChart } from '@/components/organisms/activity-chart';
import { TransactionTable } from '@/components/organisms/transaction-table';

export function Overview({ data, hidden, onToggleHidden }: { data: Wallet; hidden: boolean; onToggleHidden: () => void }) {
  return <>
    <div className="overview-grid">
      <section className="balance-card" aria-label="Saldo wallet"><div className="balance-sheen" aria-hidden="true"/><div className="balance-top"><span><WalletCards size={19}/>Saldo tersedia</span><Button variant="ghost" size="icon" className="balance-visibility" aria-label={hidden ? 'Tampilkan saldo' : 'Sembunyikan saldo'} onClick={onToggleHidden}>{hidden ? <EyeOff/> : <Eye/>}</Button></div><p className="balance-number">{hidden ? 'Rp •••••••' : rupiah(data.balance)}</p><span className="balance-caption">Rupiah Indonesia <span>•</span> IDR</span><div className="balance-actions"><Button asChild className="light-button"><Link href="/topup"><Plus/>Top up saldo</Link></Button><Button asChild className="glass-button"><Link href="/transfer"><ArrowUpRight/>Transfer</Link></Button></div><div className="balance-bottom"><span>{data.user.name.toUpperCase()}</span><WalletCards size={25} strokeWidth={1.3}/></div></section>
      <section className="glass overview-stats" aria-label="Total arus uang"><div className="section-heading"><h2>Arus uang</h2><span className="subtle-tag">Sejak bergabung</span></div><div className="stat-row"><span className="summary-icon"><ArrowDownLeft size={21}/></span><div><span>Uang masuk</span><strong>{hidden ? 'Rp •••••' : rupiah(Number(data.incoming))}</strong></div><span className="stat-caption">Top up + transfer masuk</span></div><div className="stat-row"><span className="summary-icon outgoing"><ArrowUpRight size={21}/></span><div><span>Uang keluar</span><strong>{hidden ? 'Rp •••••' : rupiah(Number(data.outgoing))}</strong></div><span className="stat-caption">Transfer terkirim</span></div><Link href="/transactions" className="text-link">Lihat semua pergerakan <ArrowRight size={15}/></Link></section>
    </div>
    <div className="insight-grid"><ActivityChart activity={data.activity}/><section className="glass quick-panel"><span className="eyebrow">AKSES CEPAT</span><h2>Setiap langkah,<br/>lebih terarah.</h2><Link className="quick-link" href="/transfer"><span className="quick-icon"><ArrowUpRight size={21}/></span><span><strong>Kirim ke pengguna Saku</strong><small>Gunakan email atau nomor HP</small></span><ChevronRight size={17}/></Link><Link className="quick-link" href="/account"><span className="quick-icon"><UserRound size={19}/></span><span><strong>Terima saldo</strong><small>Salin informasi akunmu</small></span><ChevronRight size={17}/></Link><div className="quick-foot"><ShieldCheck size={15}/><span>Biaya transfer <strong>Rp0</strong></span></div></section></div>
    <TransactionTable compact/>
  </>;
}
