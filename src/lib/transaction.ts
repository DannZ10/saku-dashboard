import { ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react';
import type { Transaction } from '@/lib/api';

// Shared transaction presentation, used by the history table and the detail receipt.
export const kind = (type: Transaction['type']) => type === 'topup'
  ? { label: 'Top up', direction: 'Masuk', sign: '+', out: false, Icon: Plus }
  : type === 'transfer_in'
    ? { label: 'Transfer masuk', direction: 'Masuk', sign: '+', out: false, Icon: ArrowDownLeft }
    : { label: 'Transfer keluar', direction: 'Keluar', sign: '−', out: true, Icon: ArrowUpRight };

export const moment = (value: string) => new Date(value).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
