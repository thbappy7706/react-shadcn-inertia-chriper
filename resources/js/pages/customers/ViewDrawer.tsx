import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import React from 'react';

interface ViewDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    customer: any | null;
}

export default function ViewDrawer({ open, onOpenChange, customer }: ViewDrawerProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[440px] sm:w-[560px]">
                <SheetHeader>
                    <SheetTitle>Customer Details</SheetTitle>
                </SheetHeader>
                <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                    {customer ? (
                        Object.entries(customer).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-3 gap-2 border-b pb-2 dark:border-slate-800">
                                <div className="col-span-1 font-medium text-slate-700 dark:text-slate-200 capitalize">
                                    {key.replaceAll('_', ' ')}
                                </div>
                                <div className="col-span-2 text-right break-all text-slate-600 dark:text-slate-300">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value ?? '')}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-muted-foreground">No data</div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}



