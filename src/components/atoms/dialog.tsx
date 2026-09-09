'use client';
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export function DialogContent({ children, className, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  // The overlay only dims — it never captures pointers. That keeps a non-modal
  // dialog (modal={false}) from ever leaving the page behind it unclickable.
  return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-sm pointer-events-none" /><DialogPrimitive.Content className={cn('dialog-panel fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white bg-[#f9fbf8] p-7 shadow-2xl', className)} {...props}>{children}<DialogPrimitive.Close className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full hover:bg-black/5 focus-visible:outline-2" aria-label="Tutup"><X size={18} /></DialogPrimitive.Close></DialogPrimitive.Content></DialogPrimitive.Portal>;
}
