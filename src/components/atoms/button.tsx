import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
const buttonVariants = cva('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 disabled:pointer-events-none disabled:opacity-45 [&_svg]:size-4 cursor-pointer', {
  variants: { variant: { default: 'bg-primary text-primary-foreground hover:brightness-110 shadow-sm', outline: 'border border-border bg-white/60 hover:bg-white', ghost: 'hover:bg-black/5 text-foreground' }, size: { default: 'h-11 px-5', sm: 'h-10 px-3', icon: 'size-11' } },
  defaultVariants: { variant: 'default', size: 'default' },
});
function Button({ className, variant, size, asChild = false, ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
export { Button, buttonVariants };
