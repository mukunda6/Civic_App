'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Globe, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'te', name: 'Telugu' },
    { code: 'hi', name: 'Hindi' },
];

export function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en');
    const { toast } = useToast();

    const handleLanguageChange = (langCode: string) => {
        setSelectedLang(langCode);
        setIsOpen(false);
        toast({
            title: 'Language Switched',
            description: `Language has been set to ${languages.find(l => l.code === langCode)?.name}. (UI text will not change yet.)`,
        });
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="default"
                    size="icon"
                    className="fixed bottom-40 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                    aria-label="Open language switcher"
                >
                    <Globe className="h-6 w-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 mr-4 mb-2 p-1" side="top" align="end">
                 <div className="grid gap-1">
                    {languages.map((lang) => (
                        <Button 
                            key={lang.code}
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => handleLanguageChange(lang.code)}
                        >
                            <span className="flex-1">{lang.name}</span>
                            {selectedLang === lang.code && <Check className="h-4 w-4" />}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
