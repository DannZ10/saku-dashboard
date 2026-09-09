'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Check, Copy, LoaderCircle, Printer, ReceiptText, SearchX, ShieldCheck } from 'lucide-react';
import { api, ApiError, rupiah, Transaction } from '@/lib/api';
import { kind, moment } from '@/lib/transaction';
import { Button } from '@/components/atoms/button';

export function TransactionDetail({ id }: { id: string }) {
  const [copied, setCopied] = useState('');
  const query = useQuery({
    queryKey: ['transaction', id],
    queryFn: () => api<{ transaction: Transaction }>('transactions/' + id),
    retry: false,
  });

  if (query.isPending) return <div className="detail-layout"><section className="glass receipt-panel"><span className="skeleton skeleton-line" style={{ width: '38%' }}/><span className="skeleton skeleton-line" style={{ width: '62%', height: 34 }}/><span className="skeleton skeleton-block"/></section><p className="sr-only" role="status">Memuat detail transaksi.</p></div>;

  if (query.error) {
    const missing = query.error instanceof ApiError && query.error.status === 404;
    return <div className="detail-layout"><section className="glass empty-state detail-empty">
      {missing ? <SearchX size={30}/> : <ReceiptText size={30}/>}
      <h3>{missing ? 'Transaksi tidak ditemukan.' : 'Detail belum dapat dimuat.'}</h3>
      <p>{missing ? 'Catatan ini tidak ada atau bukan milik akunmu. Riwayat hanya menampilkan transaksi dari akun yang sedang masuk.' : query.error.message}</p>
      <div className="detail-empty-actions"><Button asChild variant="outline"><Link href="/transactions"><ArrowLeft/>Kembali ke riwayat</Link></Button>{!missing && <Button onClick={() => query.refetch()}>Coba lagi</Button>}</div>
    </section></div>;
  }

  const transaction = query.data.transaction;
  const { label, direction, sign, out, Icon } = kind(transaction.type);
  const party = transaction.counterparty;
  const copy = async (value: string, name: string) => {
    try { await navigator.clipboard.writeText(value); setCopied(name + ' berhasil disalin.'); }
    catch { setCopied('Belum bisa menyalin. Pilih teks dan salin secara manual.'); }
  };

  return <div className="detail-layout">
    <section className="glass receipt-panel">
      <div className="receipt-top">
        <Button asChild variant="ghost" size="sm" className="back-link"><Link href="/transactions"><ArrowLeft/>Riwayat</Link></Button>
        <span className="status-badge"><span/>Berhasil</span>
      </div>
      <div className="receipt-headline">
        <span className={'receipt-icon' + (out ? ' out' : '')}><Icon size={26}/></span>
        <span className="eyebrow">{label.toUpperCase()}</span>
        <strong className={out ? 'out' : 'in'}>{sign}{rupiah(transaction.amount)}</strong>
        <p>{moment(transaction.created_at)}</p>
      </div>
      <div className="receipt-perforation" aria-hidden="true"><span/><span/></div>
      <dl className="receipt-fields">
        <div><dt>Jenis transaksi</dt><dd>{label}</dd></div>
        <div><dt>Arah dana</dt><dd>{direction}</dd></div>
        <div><dt>{out ? 'Penerima' : transaction.type === 'topup' ? 'Sumber saldo' : 'Pengirim'}</dt><dd>{party ? party.name : 'Top up simulasi'}</dd></div>
        {party && <div><dt>Email penerima/pengirim</dt><dd>{party.email}</dd></div>}
        {party?.phone && <div><dt>Nomor HP</dt><dd>{party.phone}</dd></div>}
        <div><dt>Nominal</dt><dd>{rupiah(transaction.amount)}</dd></div>
        <div><dt>Biaya admin</dt><dd>Rp0</dd></div>
        <div><dt>Saldo setelah transaksi</dt><dd>{rupiah(transaction.balance_after)}</dd></div>
        <div><dt>Catatan</dt><dd>{transaction.note || 'Tidak ada catatan'}</dd></div>
        <div className="receipt-reference"><dt>Nomor referensi</dt><dd><code>{transaction.reference}</code><Button variant="ghost" size="icon" aria-label="Salin nomor referensi" onClick={() => copy(transaction.reference, 'Nomor referensi')}><Copy/></Button></dd></div>
      </dl>
      <p className="copy-status" role="status">{copied && <><Check size={14}/>{copied}</>}</p>
      <div className="receipt-actions">
        <Button variant="outline" onClick={() => window.print()}><Printer/>Cetak bukti</Button>
        <Button asChild><Link href="/transactions">Selesai</Link></Button>
      </div>
    </section>
    <aside className="detail-aside">
      <section className="glass information-panel">
        <span className="eyebrow">TENTANG BUKTI INI</span>
        <h2>Catatan yang tetap.</h2>
        <p>Setiap transaksi berhasil menyimpan nominal, waktu, pihak terkait, dan saldo setelahnya. Nomor referensi memasangkan sisi pengirim dan penerima dari satu transfer yang sama.</p>
        <ul className="check-list">
          <li><Check size={16}/>Nominal dan saldo tersimpan sebagai Rupiah bulat</li>
          <li><Check size={16}/>Transfer gagal tidak meninggalkan catatan</li>
          <li><Check size={16}/>Detail hanya terbuka untuk pemilik akun</li>
        </ul>
      </section>
      <div className="quiet-note"><ShieldCheck size={20}/><p>Gunakan Cetak bukti untuk menyimpan halaman ini sebagai PDF melalui dialog cetak browser.</p></div>
      <p className="detail-loading-state" role="status">{query.isFetching && <><LoaderCircle size={13} className="animate-spin"/>Memperbarui detail…</>}</p>
    </aside>
  </div>;
}
