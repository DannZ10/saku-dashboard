'use client';

import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Check, LoaderCircle, Plus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Field } from '@/components/molecules/field';
import { api, ApiError, amountError, rupiah, Transaction } from '@/lib/api';

export function MoneyForm({ mode, balance, onDone }: { mode: 'topup' | 'transfer'; balance: number; onDone?: (transaction: Transaction) => void }) {
  const client = useQueryClient();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [touched, setTouched] = useState(false);
  const [review, setReview] = useState(false);
  const [success, setSuccess] = useState('');
  const [uncertain, setUncertain] = useState(false);
  const busy = useRef(false);
  // Keep the key and payload together while a response is uncertain.
  const attempt = useRef<{ key: string; body: string } | null>(null);
  const transfer = mode === 'transfer';
  const validation = amountError(amount);
  const destination = recipient.trim();
  const recipientValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destination) || /^08[0-9]{8,11}$/.test(destination);
  const balanceError = transfer && Number(amount) > balance ? 'Saldo tidak cukup.' : '';
  const invalid = !!validation || !!balanceError || (transfer && !recipientValid);
  const mutation = useMutation({
    mutationFn: () => {
      const body = JSON.stringify({ amount: Number(amount), ...(transfer ? { recipient: destination } : {}), note: note.trim() || null });
      if (!attempt.current || attempt.current.body !== body) attempt.current = { body, key: crypto.randomUUID() };
      return api<{ message: string; transaction: Transaction }>(mode, JSON.parse(attempt.current.body), attempt.current.key);
    },
    onSuccess: async (data) => {
      setSuccess(data.message); setUncertain(false); attempt.current = null; setReview(false);
      setAmount(''); setNote(''); setRecipient(''); setTouched(false);
      await Promise.all([client.invalidateQueries({ queryKey: ['wallet'] }), client.invalidateQueries({ queryKey: ['transactions'] })]);
      onDone?.(data.transaction);
    },
    onError: error => {
      setUncertain(!(error instanceof ApiError) || error.status >= 500);
      if (error instanceof ApiError && error.status === 401) { client.removeQueries({ queryKey: ['transactions'] }); client.setQueryData(['wallet'], null); }
    },
    onSettled: () => { busy.current = false; },
  });
  const server = mutation.error instanceof ApiError ? mutation.error.errors : undefined;
  const disabled = mutation.isPending || uncertain;
  return <form className="money-form" noValidate onSubmit={event => {
    event.preventDefault();
    if (busy.current || (!uncertain && invalid)) return;
    if (transfer && !review) { setReview(true); mutation.reset(); return; }
    busy.current = true; setSuccess(''); mutation.mutate();
  }}>
    {transfer && <ol className="form-progress" aria-label="Tahap transfer"><li className={!review ? 'current' : 'complete'} aria-current={!review ? 'step' : undefined}><span>{review ? <Check size={12}/> : '1'}</span>Isi detail</li><li className={review ? 'current' : ''} aria-current={review ? 'step' : undefined}><span>2</span>Periksa & kirim</li></ol>}
    {success && <p role="status" className="success-banner"><Check size={17}/>{success}</p>}
    {review ? <div className="transfer-review"><span className="eyebrow">KONFIRMASI TRANSFER</span><h3>{rupiah(Number(amount))}</h3><p>akan dikirim ke</p><strong className="review-recipient">{destination}</strong><dl className="facts-list"><div><dt>Nominal transfer</dt><dd>{rupiah(Number(amount))}</dd></div><div><dt>Biaya admin</dt><dd>Rp0</dd></div><div><dt>Total terpotong</dt><dd>{rupiah(Number(amount))}</dd></div><div><dt>Saldo setelah transfer</dt><dd>{rupiah(balance - Number(amount))}</dd></div>{note && <div><dt>Catatan</dt><dd>{note}</dd></div>}</dl><p className="review-hint">Pastikan email atau nomor HP penerima sudah benar.</p></div> : <>
      {transfer && <Field htmlFor="recipient" label="Email atau nomor HP penerima" hint="Penerima harus memiliki akun Saku." error={server?.recipient?.[0] || (destination && !recipientValid ? 'Masukkan email atau nomor HP yang valid.' : '')}><Input id="recipient" autoComplete="off" placeholder="nama@email.com atau 08…" value={recipient} disabled={disabled} maxLength={255} onChange={event => { setRecipient(event.target.value); mutation.reset(); }} aria-describedby="recipient-error" aria-invalid={!!server?.recipient || !!(destination && !recipientValid)}/></Field>}
      <Field htmlFor={mode + '-amount'} errorId={mode + '-error'} label={'Nominal ' + (transfer ? 'transfer' : 'top up')} hint="Rupiah bulat, tanpa titik atau koma. Maksimum Rp10.000.000." error={server?.amount?.[0] || (touched ? validation || balanceError : '')}><div className="amount-input"><span>Rp</span><Input id={mode + '-amount'} placeholder="0" inputMode="numeric" autoComplete="off" value={amount} maxLength={16} disabled={disabled} aria-invalid={!!(touched && (validation || balanceError))} aria-describedby={mode + '-error'} onBlur={() => setTouched(true)} onChange={event => { setAmount(event.target.value); setTouched(true); mutation.reset(); }}/></div></Field>
      {!transfer && <div className="amount-presets" aria-label="Pilihan nominal">{[50000, 100000, 250000, 500000, 1000000, 2000000].map(value => <Button key={value} type="button" variant="outline" className={amount === String(value) ? 'selected' : ''} aria-pressed={amount === String(value)} disabled={disabled} onClick={() => { setAmount(String(value)); setTouched(true); mutation.reset(); }}>{rupiah(value)}</Button>)}</div>}
      <Field htmlFor="note" label="Catatan" labelAside={'Opsional · ' + note.length + '/140'}><Input id="note" placeholder={transfer ? 'Contoh: Makan siang' : 'Contoh: Kebutuhan minggu ini'} maxLength={140} value={note} disabled={disabled} onChange={event => { setNote(event.target.value); mutation.reset(); }}/></Field>
      <div className="form-total"><span>{transfer ? 'Saldo tersedia' : 'Saldo setelah top up'}</span><strong>{rupiah(transfer || validation ? balance : balance + Number(amount))}</strong></div>
    </>}
    {mutation.error && <p role="alert" className="error-banner">{mutation.error.message}{uncertain && ' Status belum pasti. Gunakan tombol di bawah untuk memeriksa permintaan yang sama sebelum membuat transaksi baru.'}</p>}
    {review && balanceError && !uncertain && <p role="alert" className="error-banner">{balanceError}</p>}
    <div className="form-buttons">{review && <Button type="button" variant="outline" disabled={disabled} onClick={() => { setReview(false); mutation.reset(); }}><ArrowLeft/>Ubah detail</Button>}<Button type="submit" className="submit-button" disabled={mutation.isPending || (!uncertain && invalid)}>{mutation.isPending ? <><LoaderCircle className="animate-spin"/>Memproses…</> : uncertain ? 'Cek ulang transaksi' : transfer ? <>{review ? 'Konfirmasi & kirim' : 'Periksa transfer'}<ArrowRight/></> : <>Tambah saldo <Plus/></>}</Button></div>
    <p className="form-safety"><ShieldCheck size={15}/>{transfer ? 'Tidak ada biaya admin untuk transfer.' : 'Top up simulasi. Tidak menarik uang dari rekening bank.'}</p>
  </form>;
}
