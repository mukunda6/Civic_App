
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Phone, X } from 'lucide-react';
import { Separator } from './ui/separator';

const customerCareNumbers = [
    { label: 'Toll-Free', number: '1800-425-8828' },
    { label: 'GHMC Helpline', number: '040-21111111' },
    { label: 'Emergency', number: '100 / 108' },
];


export function CustomerCareButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="default"
                    size="icon"
                    className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                    aria-label="Open customer care contacts"
                >
                    <Phone className="h-6 w-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mr-4 mb-2" side="top" align="end">
                 <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Customer Care</h4>
                        <p className="text-sm text-muted-foreground">
                        Contact us for support.
                        </p>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                        {customerCareNumbers.map(({ label, number }) => (
                            <div key={label} className="flex justify-between items-center">
                                <span className="font-medium text-sm">{label}</span>
                                <Button asChild variant="link" className="p-0 h-auto">
                                    <a href={`tel:${number.replace(/\s|\//g, '')}`}>{number}</a>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
