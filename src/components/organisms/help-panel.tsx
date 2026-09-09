'use client';

import Link from 'next/link';
import { ArrowRight, CircleHelp, Plus } from 'lucide-react';

const faqs: [string, string][] = [
  ['Bagaimana cara mengisi saldo?', 'Buka Top up, masukkan nominal Rp1 sampai Rp10.000.000, lalu tekan Tambah saldo. Top up adalah simulasi untuk proyek ini; rekening bank tidak terhubung.'],
  ['Apa yang diperlukan untuk transfer?', 'Email atau nomor HP penerima yang sudah terdaftar di Saku, nominal Rupiah bulat, dan saldo yang cukup. Nomor HP memakai format 08 dengan 10–13 digit. Tidak ada biaya admin.'],
  ['Mengapa tombol belum bisa ditekan?', 'Periksa format email atau nomor HP, nominal, dan saldo tersedia. Tombol aktif setelah isian valid dan dinonaktifkan selama transaksi diproses. Pesan di bawah isian menunjukkan yang perlu diperbaiki.'],
  ['Apa yang terjadi jika saldo tidak cukup?', 'Transfer tidak diproses dan saldo tidak berubah. Kurangi nominal atau isi saldo melalui halaman Top up sebelum mencoba lagi.'],
  ['Koneksi terputus saat transaksi. Harus bagaimana?', 'Tetap di formulir dan gunakan Cek ulang transaksi untuk mencoba permintaan yang sama. Periksa riwayat. Hindari memuat ulang halaman atau membuat transaksi baru sebelum status transaksi dipastikan.'],
  ['Bagaimana cara melihat bukti transaksi?', 'Buka Riwayat transaksi, cari aktivitas yang diperlukan, lalu pilih Detail. Halaman bukti menampilkan nominal, waktu, referensi, dan saldo setelah transaksi. Gunakan Cetak bukti untuk menyimpan sebagai PDF melalui browser.'],
  ['Apakah pengguna lain dapat melihat saldo saya?', 'Saldo dan riwayat hanya dapat diakses oleh pemilik akun yang sedang masuk. Detail transaksi milik akun lain tidak tersedia. Jangan membagikan password akun.'],
];

export function HelpPanel() {
  return <div className="help-layout"><section className="glass help-intro"><span className="action-icon"><CircleHelp size={25}/></span><h2>Mulai dari tiga hal.</h2><ol className="help-steps"><li><span>01</span><div><strong>Isi saldo</strong><p>Tentukan nominal sesuai kebutuhan.</p><Link href="/topup" className="text-link">Buka Top up <ArrowRight size={14}/></Link></div></li><li><span>02</span><div><strong>Kirim ke penerima</strong><p>Periksa tujuan sebelum konfirmasi.</p><Link href="/transfer" className="text-link">Buka Transfer <ArrowRight size={14}/></Link></div></li><li><span>03</span><div><strong>Lihat catatan</strong><p>Telusuri aktivitas dan bukti transaksi.</p><Link href="/transactions" className="text-link">Buka Riwayat <ArrowRight size={14}/></Link></div></li></ol></section><section className="glass faq-panel"><span className="eyebrow">PERTANYAAN UMUM</span><h2>Yang perlu kamu tahu.</h2>{faqs.map(([question, answer]) => <details key={question} className="faq-item"><summary>{question}<Plus size={17}/></summary><p>{answer}</p></details>)}</section></div>;
}
