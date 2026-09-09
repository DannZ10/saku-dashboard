import * as React from 'react';
import { cn } from '@/lib/utils';
export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return <input data-slot="input" className={cn('h-12 w-full min-w-0 rounded-xl border border-input bg-white/60 px-3.5 text-sm outline-none transition-shadow placeholder:text-muted-foreground/75 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/10 disabled:opacity-50 aria-invalid:border-destructive', className)} {...props} />;
}
