import { WalletCards } from 'lucide-react';

// Wordmark used across the app shell, auth screen, and loading states.
export function Brand() {
  return <span className="brand">
    <span className="brand-symbol"><WalletCards size={23} strokeWidth={1.8}/></span>
    <span className="brand-words"><span className="brand-word">saku<span className="brand-dot">.</span></span><span className="brand-by">by kembara.id</span></span>
  </span>;
}
