'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ArrowRight, ChevronLeft, ChevronRight, Plus, ReceiptText, Search, X } from 'lucide-react';
import { api, History, rupiah, Transaction } from '@/lib/api';
import { kind, moment } from '@/lib/transaction';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';

const typeFilters = [
  { value: '', label: 'Semua jenis' },
  { value: 'topup', label: 'Top up' },
  { value: 'transfer_in', label: 'Transfer masuk' },
  { value: 'transfer_out', label: 'Transfer keluar' },
];

function Row({ row }: { row: Transaction }) {
  const { label, sign, out, Icon } = kind(row.type);
  const party = row.counterparty ? (out ? 'Ke ' : 'Dari ') + row.counterparty.name : 'Saldo masuk ke dompetmu';
  return <tr>
    <td><div className="cell-transaction"><span className={'transaction-icon' + (out ? ' out' : '')}><Icon size={17}/></span><span><strong>{label}</strong><small>{row.note || party}</small></span></div></td>
    <td><span className="cell-reference">{row.reference.slice(0, 8)}</span></td>
    <td><span className="cell-time">{moment(row.created_at)}</span></td>
    <td><div className="cell-amount"><strong className={out ? 'out' : 'in'}>{sign}{rupiah(row.amount)}</strong><small>Saldo {rupiah(row.balance_after)}</small></div></td>
    <td><Link className="detail-link" href={'/transactions/' + row.id} aria-label={'Lihat detail transaksi ' + row.reference}>Detail<ChevronRight size={14}/></Link></td>
  </tr>;
}

export function TransactionTable({ compact = false }: { compact?: boolean }) {
  const [type, setType] = useState('');
  const [term, setTerm] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(term.trim()); setPage(1); }, 350);
    return () => clearTimeout(timer);
  }, [term]);
  const query = useQuery({
    queryKey: ['transactions', compact ? 'recent' : { type, search, page }],
    queryFn: () => api<History>('transactions?' + new URLSearchParams({ page: String(compact ? 1 : page), ...(type && !compact ? { type } : {}), ...(search && !compact ? { q: search } : {}) })),
    placeholderData: keepPreviousData,
  });
  const rows = (query.data?.data ?? []).slice(0, compact ? 5 : undefined);
  const filtered = !compact && (!!type || !!search);
  const lastPage = query.data?.last_page ?? 1;

  return <section className={'glass history-panel' + (compact ? ' history-compact' : '')} aria-label="Riwayat transaksi">
    <div className="section-heading">
      <div><span className="eyebrow">{compact ? 'AKTIVITAS TERBARU' : 'SEMUA MUTASI'}</span><h2>{compact ? 'Transaksi terakhir' : 'Riwayat transaksi'}</h2><p>{compact ? 'Lima catatan paling baru dari dompetmu.' : query.data ? query.data.total + ' catatan ditemukan' : 'Menelusuri catatan dompetmu'}</p></div>
      {compact
        ? <Link href="/transactions" className="text-link">Lihat semua <ArrowRight size={15}/></Link>
        : <div className="table-tools">
            <div className="table-search"><Search size={15}/><Input value={term} placeholder="Cari nama, catatan, referensi" aria-label="Cari transaksi" onChange={event => setTerm(event.target.value)}/>{term && <button type="button" aria-label="Hapus pencarian" onClick={() => setTerm('')}><X size={14}/></button>}</div>
            <select className="filter-select" aria-label="Saring jenis transaksi" value={type} onChange={event => { setType(event.target.value); setPage(1); }}>{typeFilters.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
          </div>}
    </div>

    {query.isPending
      ? <div className="table-scroll"><table><tbody>{Array.from({ length: compact ? 3 : 5 }).map((_, index) => <tr key={index}><td colSpan={5}><span className="skeleton skeleton-row" aria-hidden="true"/></td></tr>)}</tbody></table><p className="sr-only" role="status">Memuat riwayat transaksi.</p></div>
      : query.error
        ? <div className="empty-state"><ReceiptText size={26}/><h3>Riwayat belum dapat dimuat.</h3><p>{query.error.message}</p><Button variant="outline" onClick={() => query.refetch()}>Coba lagi</Button></div>
        : rows.length === 0
          ? <div className="empty-state"><ReceiptText size={26}/><h3>{filtered ? 'Tidak ada yang cocok.' : 'Belum ada transaksi.'}</h3><p>{filtered ? 'Ubah kata kunci atau pilih jenis transaksi lain.' : 'Mulai dengan mengisi saldo, lalu kirim ke pengguna Saku lain.'}</p>{filtered ? <Button variant="outline" onClick={() => { setTerm(''); setType(''); setPage(1); }}>Atur ulang filter</Button> : <Button asChild><Link href="/topup"><Plus/>Top up saldo</Link></Button>}</div>
          : <div className="table-scroll"><table>
              <thead><tr><th scope="col">Transaksi</th><th scope="col">Referensi</th><th scope="col">Waktu</th><th scope="col">Nominal</th><th scope="col"></th></tr></thead>
              <tbody>{rows.map(row => <Row key={row.id} row={row}/>)}</tbody>
            </table></div>}

    {!compact && lastPage > 1 && rows.length > 0 && <div className="table-footer">
      <span>Halaman {query.data?.current_page} dari {lastPage}</span>
      <div className="pager"><Button variant="outline" size="sm" disabled={page <= 1 || query.isFetching} onClick={() => setPage(page - 1)}><ChevronLeft/>Sebelumnya</Button><Button variant="outline" size="sm" disabled={page >= lastPage || query.isFetching} onClick={() => setPage(page + 1)}>Berikutnya<ChevronRight/></Button></div>
    </div>}
  </section>;
}
