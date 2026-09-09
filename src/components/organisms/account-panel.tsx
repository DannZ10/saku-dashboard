'use client';

import Link from 'next/link';
import { ArrowDownLeft, ArrowRight, Check, Copy, LogOut } from 'lucide-react';
import { Wallet } from '@/lib/api';
import { Button } from '@/components/atoms/button';

export function AccountPanel({ data, copied, onCopy, onLogout, loggingOut }: {
  data: Wallet;
  copied: string;
  onCopy: (value: string) => void;
  onLogout: () => void;
  loggingOut: boolean;
}) {
  return <div className="account-grid">
    <section className="glass profile-panel"><div className="profile-cover"><span className="profile-avatar">{data.user.name.split(' ').slice(0, 2).map(name => name[0]).join('')}</span><span className="subtle-tag">Akun pribadi</span></div><h2>{data.user.name}</h2><p>@{data.user.username}</p><dl className="profile-fields"><div><dt>Nama lengkap</dt><dd>{data.user.name}</dd></div><div><dt>Email</dt><dd>{data.user.email}<Button variant="ghost" size="icon" aria-label="Salin email" onClick={() => onCopy(data.user.email)}><Copy/></Button></dd></div><div><dt>Nomor HP</dt><dd>{data.user.phone}<Button variant="ghost" size="icon" aria-label="Salin nomor HP" onClick={() => onCopy(data.user.phone)}><Copy/></Button></dd></div><div><dt>Mata uang</dt><dd>Rupiah Indonesia · IDR</dd></div></dl><p className="copy-status" role="status">{copied}</p></section>
    <div className="account-aside"><section className="glass information-panel"><span className="action-icon"><ArrowDownLeft size={23}/></span><h2>Terima saldo.</h2><p>Bagikan email atau nomor HP di samping kepada pengirim. Saldo masuk akan muncul di riwayat transaksi.</p><Button asChild variant="outline"><Link href="/transactions">Lihat riwayat <ArrowRight/></Link></Button></section><section className="glass information-panel"><span className="eyebrow">SESI & KEAMANAN</span><h2>Akses akunmu.</h2><ul className="check-list"><li><Check size={16}/>Sesi berakhir setelah 8 jam</li><li><Check size={16}/>Riwayat hanya tersedia untuk pemilik akun</li><li><Check size={16}/>Keluar untuk mengakhiri sesi perangkat ini</li></ul><Button variant="outline" disabled={loggingOut} onClick={onLogout}><LogOut/>{loggingOut ? 'Memproses…' : 'Keluar akun'}</Button></section></div>
  </div>;
}
