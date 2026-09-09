export class ApiError extends Error {
  constructor(message: string, public status: number, public errors?: Record<string, string[]>) { super(message); }
}
export async function api<T>(path: string, body?: unknown, key?: string): Promise<T> {
  const response = await fetch(`/api/${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', ...(key ? { 'Idempotency-Key': key } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }), cache: 'no-store',
  });
  const data = await response.json();
  if (!response.ok) throw new ApiError(data.message ?? 'Permintaan gagal. Silakan coba lagi.', response.status, data.errors);
  return data;
}
export const rupiah = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
export const amountError = (value: string) => !value.trim() ? 'Nominal tidak boleh kosong.' : !/^\d+(\.\d+)?$/.test(value) ? 'Nominal harus berupa angka.' : !Number.isInteger(Number(value)) ? 'Nominal harus berupa Rupiah bulat.' : Number(value) < 1 ? 'Nominal minimal Rp1.' : Number(value) > 10000000 ? 'Nominal melebihi batas maksimum transaksi.' : '';
export type User = { id: number; name: string; email: string; username: string; phone: string };
export type Wallet = { user: User; balance: number; incoming: number; outgoing: number; activity: { date: string; incoming: number; outgoing: number }[] };
export type Transaction = { id: number; reference: string; type: 'topup' | 'transfer_in' | 'transfer_out'; amount: number; balance_after: number; note: string | null; created_at: string; counterparty: { name: string; email: string; phone?: string } | null };
export type History = { data: Transaction[]; current_page: number; last_page: number; total: number };
