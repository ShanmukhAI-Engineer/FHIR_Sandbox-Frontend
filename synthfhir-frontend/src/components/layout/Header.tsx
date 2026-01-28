'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api';
import type { LLMStatus } from '@/lib/types';

export default function Header() {
    const [llmStatus, setLlmStatus] = useState<LLMStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLLMStatus();
        // Poll every 30 seconds
        const interval = setInterval(fetchLLMStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchLLMStatus = async () => {
        try {
            const status = await apiClient.getLLMStatus();
            setLlmStatus(status);
        } catch (error) {
            console.error('Failed to fetch LLM status:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <header className="h-16 border-b border-[rgb(var(--color-border))] glass-card flex items-center justify-between px-8">
            <div>
                <h2 className="text-lg font-semibold text-[rgb(var(--color-text))]">
                    Welcome to SynthFHIR
                </h2>
                <p className="text-sm text-[rgb(var(--color-text-muted))]">
                    Generate synthetic FHIR data with AI
                </p>
            </div>

            {/* LLM Status Indicator */}
            <div className="flex items-center gap-3">
                {loading ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--color-bg-card))]">
                        <Loader2 className="w-4 h-4 animate-spin text-[rgb(var(--color-text-muted))]" />
                        <span className="text-sm text-[rgb(var(--color-text-muted))]">
                            Checking LLM...
                        </span>
                    </div>
                ) : llmStatus?.enterprise_configured ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--color-success))]/20 border border-[rgb(var(--color-success))]/30">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <div>
                            <span className="text-sm font-medium text-green-400 block">
                                {llmStatus.active_llm.toUpperCase()}
                            </span>
                            <span className="text-xs text-green-300">
                                Enterprise LLM Connected
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(var(--color-error))]/20 border border-[rgb(var(--color-error))]/30">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-medium text-red-400">
                            LLM Not Configured
                        </span>
                    </div>
                )}
            </div>
        </header>
    );
}
