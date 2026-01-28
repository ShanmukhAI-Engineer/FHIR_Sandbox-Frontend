'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Database, FileText, Home, Settings } from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Generate', href: '/generate', icon: Activity },
    { name: 'Knowledge Base', href: '/knowledge', icon: Database },
    { name: 'Results', href: '/results', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="fixed left-0 top-0 h-screen w-64 glass-card border-r border-[rgb(var(--color-border))] flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-[rgb(var(--color-border))]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-primary-dark))] flex items-center justify-center">
                        <span className="text-2xl">🏥</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-accent))] to-[rgb(var(--color-primary))]">
                            SynthFHIR
                        </h1>
                        <p className="text-xs text-[rgb(var(--color-text-muted))]">Data Generator</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-[rgb(var(--color-primary))]/20 to-transparent border-l-4 border-[rgb(var(--color-primary))] text-[rgb(var(--color-accent))]'
                                    : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-hover))]/50'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[rgb(var(--color-border))]">
                <div className="glass-card p-3 rounded-lg">
                    <p className="text-xs text-[rgb(var(--color-text-muted))]">
                        FHIR R4 Compatible
                    </p>
                    <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1">
                        Enterprise Edition
                    </p>
                </div>
            </div>
        </div>
    );
}
