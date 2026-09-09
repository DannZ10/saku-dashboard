'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { LoaderCircle, ShieldCheck, TimerReset } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/atoms/dialog';
import { IDLE_MINUTES, IDLE_SECONDS, WARN_SECONDS } from '@/lib/session';

const ACTIVITY = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

/**
 * Ends the session after a stretch of inactivity. The browser timer drives the
 * warning and the redirect; the httpOnly cookie carries the same idle window on
 * the server, so a tab left open past the cutoff cannot act on stale state.
 */
export function SessionGuard() {
  const router = useRouter();
  const client = useQueryClient();
  const last = useRef(0);
  const pinged = useRef(0);
  const closing = useRef(false);
  const [ending, setEnding] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  const endSession = useCallback(async (reason: 'idle' | 'expired') => {
    if (closing.current) return;
    closing.current = true;
    setEnding(true);
    try {
      await fetch('/api/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    } catch {
      // The cookie is dropped either way; the redirect below is what matters.
    }
    client.clear();
    router.replace('/login?alasan=' + reason);
  }, [client, router]);

  // Renews the server-side idle window without waking the API.
  const ping = useCallback(() => {
    pinged.current = Date.now();
    void fetch('/api/session', { cache: 'no-store' })
      .then(response => { if (response.status === 401) void endSession('expired'); })
      .catch(() => {});
  }, [endSession]);

  const stayIn = useCallback(() => {
    last.current = Date.now();
    setRemaining(null);
    ping();
  }, [ping]);

  useEffect(() => {
    last.current = Date.now();
    pinged.current = Date.now();
    // Safety net: never let a stray body lock (e.g. from a dialog that unmounted
    // mid-navigation) survive and strand the whole page as unclickable.
    const release = () => { try { document.body.style.pointerEvents = ''; } catch {} };
    release();
    return release;
  }, []);

  useEffect(() => {
    // While the warning is up, only the explicit button may extend the session.
    const onActivity = () => {
      if (remaining !== null) return;
      last.current = Date.now();
      if (Date.now() - pinged.current > (IDLE_SECONDS / 3) * 1000) ping();
    };
    ACTIVITY.forEach(event => window.addEventListener(event, onActivity, { passive: true }));
    return () => ACTIVITY.forEach(event => window.removeEventListener(event, onActivity));
  }, [remaining, ping]);

  useEffect(() => {
    const tick = setInterval(() => {
      if (!last.current) return;
      const left = Math.ceil((IDLE_SECONDS * 1000 - (Date.now() - last.current)) / 1000);
      if (left <= 0) { void endSession('idle'); return; }
      setRemaining(left <= WARN_SECONDS ? left : null);
    }, 1000);
    return () => clearInterval(tick);
  }, [endSession]);

  // modal={false}: an informational idle prompt must never lock <body>. Radix only
  // writes body{pointer-events:none} in modal mode, and that lock is what stranded
  // the page when the auto-logout navigation unmounted the dialog mid-open.
  return <Dialog open={remaining !== null} modal={false} onOpenChange={next => { if (!next) stayIn(); }}>
    <DialogContent className="idle-dialog">
      <span className="idle-icon"><TimerReset size={24} /></span>
      <DialogTitle>Masih di sana?</DialogTitle>
      <DialogDescription>
        Sesi ditutup otomatis setelah {IDLE_MINUTES} menit tanpa aktivitas. Ini menjaga saldo dan riwayatmu bila perangkat ditinggalkan.
      </DialogDescription>
      <p className="idle-countdown" role="status" aria-live="assertive">
        <strong>{remaining ?? 0}</strong> detik tersisa
      </p>
      <div className="idle-actions">
        <Button onClick={stayIn} disabled={ending}>Tetap masuk</Button>
        <Button variant="outline" disabled={ending} onClick={() => void endSession('idle')}>
          {ending ? <LoaderCircle className="animate-spin" /> : null}Keluar sekarang
        </Button>
      </div>
      <p className="idle-note"><ShieldCheck size={14} />Sesi juga berakhir maksimal 8 jam setelah masuk.</p>
    </DialogContent>
  </Dialog>;
}
