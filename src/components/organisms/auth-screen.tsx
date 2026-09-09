'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUpRight, ArrowRight, ShieldCheck, LoaderCircle, WalletCards } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Brand } from '@/components/atoms/brand';
import { Field } from '@/components/molecules/field';
import { api, ApiError } from '@/lib/api';

const NOTICES: Record<string, string> = {
  idle: 'Sesi ditutup otomatis karena tidak ada aktivitas. Silakan masuk lagi.',
  expired: 'Sesi sudah tidak berlaku. Silakan masuk lagi.',
};

export function AuthScreen({ mode = 'login', reason }: { mode?: 'login' | 'register'; reason?: string }) {
  const router = useRouter();
  const client = useQueryClient();
  const register = mode === 'register';
  const [values, setValues] = useState({ name: '', username: '', email: '', phone: '', password: '', password_confirmation: '' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const busy = useRef(false);
  const notice = reason ? NOTICES[reason] : undefined;
  const mutation = useMutation({
    mutationFn: () => api(register ? 'register' : 'login', register ? values : { email: values.email, password: values.password }),
    // A fresh cache avoids showing the previous session's wallet while the new one loads.
    onSuccess: () => { client.clear(); router.replace('/'); },
    onSettled: () => { busy.current = false; },
  });
  const errors: Record<string, string> = {
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? 'Format email tidak valid.' : '',
    password: values.password.length < 8 ? 'Password minimal 8 karakter.' : '',
    ...(register ? {
      name: !values.name.trim() ? 'Nama tidak boleh kosong.' : '',
      username: !/^[a-zA-Z0-9_-]{3,30}$/.test(values.username) ? 'Username 3–30 karakter: huruf, angka, _ atau -.' : '',
      phone: !/^08[0-9]{8,11}$/.test(values.phone) ? 'Gunakan nomor HP 08, terdiri dari 10–13 digit.' : '',
      password_confirmation: values.password !== values.password_confirmation || !values.password_confirmation ? 'Konfirmasi password tidak cocok.' : '',
    } : {}),
  };
  const fields = register ? ['name', 'username', 'email', 'phone', 'password', 'password_confirmation'] as const : ['email', 'password'] as const;
  const labels = { name: 'Nama lengkap', username: 'Username', email: 'Alamat email', phone: 'Nomor HP', password: 'Password', password_confirmation: 'Konfirmasi password' };
  const placeholders = { name: 'Nama kamu', username: 'pilih_username', email: 'nama@email.com', phone: '081234567890', password: 'Minimal 8 karakter', password_confirmation: 'Ulangi password' };
  const serverErrors = mutation.error instanceof ApiError ? mutation.error.errors : undefined;
  return <main className="auth-shell">
    <section className="auth-story">
      <Brand />
      <div className="auth-story-content"><span className="eyebrow">SEDERHANA. TERATUR. DALAM GENGGAMAN.</span><h1>Uangmu,<br/>ruang tenangmu.</h1><p>Satu tempat untuk simpan saldo, kirim uang,<br className="hidden lg:block"/> dan lihat setiap pergerakannya.</p>
        <div className="wallet-art" aria-hidden="true"><div className="art-orbit"/><div className="art-card"><div className="flex justify-between items-start"><span className="art-brand"><span>saku.</span><small>by kembara.id</small></span><WalletCards size={29}/></div><span className="block mt-10 text-xs opacity-70">RUANG UNTUK RENCANAMU</span><span className="block mt-2 text-3xl tracking-tight">Mulai dari sini.</span><div className="flex items-center justify-between mt-10"><span className="text-xs tracking-[.2em]">MINI WALLET</span><ArrowUpRight size={26}/></div></div><span className="art-chip"><ShieldCheck size={17}/> Lebih tenang, setiap transaksi</span></div>
      </div><span className="text-xs text-muted-foreground">Dibuat untuk keseharian yang lebih ringan.</span>
    </section>
    <section className="auth-form-side"><div className="auth-form-inner"><span className="mobile-brand"><Brand/></span><div className="auth-heading"><span className="eyebrow">SELAMAT DATANG DI SAKU</span><h2>{register ? 'Buka ruang baru.' : 'Senang bertemu lagi.'}</h2><p>{register ? 'Buat akun dan mulai perjalanan kecilmu.' : 'Masuk untuk melanjutkan aktivitas uangmu.'}</p></div>
      {notice && <p role="status" className="notice-banner"><ShieldCheck size={16}/>{notice}</p>}
      <form noValidate onSubmit={event => { event.preventDefault(); if (busy.current || Object.values(errors).some(Boolean)) return; busy.current = true; mutation.mutate(); }} className="space-y-5">
        <div className={register ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-5'}>{fields.map(field => <Field key={field} htmlFor={field} label={labels[field]} className={field === 'email' && register ? 'sm:col-span-2' : ''} error={serverErrors?.[field]?.[0] || (touched[field] && errors[field]) || ''}><Input id={field} name={field} value={values[field]} maxLength={field === 'password' || field === 'password_confirmation' ? 128 : field === 'username' ? 30 : 255} type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'} autoComplete={field === 'password' ? register ? 'new-password' : 'current-password' : field === 'password_confirmation' ? 'new-password' : field === 'phone' ? 'tel' : field} placeholder={placeholders[field]} disabled={mutation.isPending} aria-invalid={!!((touched[field] && errors[field]) || serverErrors?.[field])} aria-describedby={`${field}-error`} onBlur={() => setTouched(t => ({ ...t, [field]: true }))} onChange={e => { setValues(v => ({ ...v, [field]: e.target.value })); mutation.reset(); }}/></Field>)}</div>
        {mutation.error && <p role="alert" className="error-banner">{mutation.error.message}</p>}
        <Button className="w-full h-12" disabled={mutation.isPending || Object.values(errors).some(Boolean)}>{mutation.isPending ? <><LoaderCircle className="animate-spin"/>Memproses...</> : <>{register ? 'Buat akun' : 'Masuk ke Saku'}<ArrowRight/></>}</Button>
      </form>
      <p className="auth-switch">{register ? 'Sudah punya akun?' : 'Baru di sini?'} <Link href={register ? '/login' : '/register'}>{register ? 'Masuk' : 'Buat akun'}</Link></p>
      <div className="auth-security"><ShieldCheck size={17}/><span>Sesi terlindungi. Kendali tetap di tanganmu.</span></div>
    </div><span className="auth-footnote">SAKU BY KEMBARA.ID &nbsp; © 2026</span></section>
  </main>;
}
