
'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import en from '@/locales/en.json';
import te from '@/locales/te.json';
import hi from '@/locales/hi.json';

export const languages = [
    { code: 'en', name: 'English' },
    { code: 'te', name: 'Telugu' },
    { code: 'hi', name: 'Hindi' },
];

const translations: Record<string, Record<string, string>> = {
    en,
    te,
    hi
};

interface LanguageContextType {
    language: string;
    setLanguage: (language: string) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState('en');

    const t = (key: string): string => {
        return translations[language]?.[key] || translations['en'][key] || key;
    };

    const value = useMemo(() => ({
        language,
        setLanguage,
        t,
    }), [language]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextType {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
