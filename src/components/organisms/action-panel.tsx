'use client';

import Link from 'next/link';
import { ArrowUpRight, Plus, ShieldCheck, WalletCards } from 'lucide-react';
import { rupiah, Transaction, Wallet } from '@/lib/api';
import { MoneyForm } from '@/components/organisms/money-form';

// Top up and transfer share this two-column layout; only copy and the form mode differ.
export function ActionPanel({ mode, data, onDone }: { mode: 'topup' | 'transfer'; data: Wallet; onDone: (transaction: Transaction) => void }) {
  const transfer = mode === 'transfer';
  return <div className="action-layout">
    <section className="glass action-panel"><div className="action-panel-heading"><span className="action-icon">{transfer ? <ArrowUpRight size={24}/> : <Plus size={24}/>}</span><div><h2>{transfer ? 'Tujuan & nominal' : 'Nominal top up'}</h2><p>{transfer ? 'Periksa tujuan dan nominal sebelum konfirmasi.' : 'Saldo langsung ditambahkan setelah berhasil.'}</p></div><span className="subtle-tag">IDR</span></div><MoneyForm key={mode} mode={mode} balance={data.balance} onDone={onDone}/></section>
    <aside className="action-aside"><section className="mini-balance"><div><WalletCards size={18}/>Saldo saat ini</div><strong>{rupiah(data.balance)}</strong><span>@{data.user.username}</span></section><section className="glass information-panel"><span className="eyebrow">SEBELUM MEMULAI</span><h2>{transfer ? 'Detail kecil, berarti.' : 'Isi sesuai kebutuhan.'}</h2><dl className="facts-list"><div><dt>Minimum</dt><dd>Rp1</dd></div><div><dt>Maksimum / transaksi</dt><dd>Rp10.000.000</dd></div><div><dt>Biaya admin</dt><dd>Rp0</dd></div><div><dt>{transfer ? 'Penerima' : 'Sumber saldo'}</dt><dd>{transfer ? 'Pengguna Saku' : 'Simulasi'}</dd></div></dl><p>{transfer ? 'Email atau nomor HP harus terdaftar. Transfer ke akun sendiri tidak dapat diproses.' : 'Top up pada versi ini merupakan simulasi. Tidak ada uang yang ditarik dari rekening bank.'}</p><Link href="/help" className="text-link">Baca panduan <ArrowUpRight size={15}/></Link></section><div className="quiet-note"><ShieldCheck size={20}/><p>Jika koneksi terputus, periksa riwayat sebelum membuat transaksi baru.</p></div></aside>
  </div>;
}
