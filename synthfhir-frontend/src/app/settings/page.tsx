'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, Server } from 'lucide-react';
import apiClient from '@/lib/api';
import type { LLMStatus, AppConfig } from '@/lib/types';

export default function SettingsPage() {
    const [llmStatus, setLlmStatus] = useState<LLMStatus | null>(null);
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [llm, cfg] = await Promise.all([
                apiClient.getLLMStatus(),
                apiClient.getConfig(),
            ]);
            setLlmStatus(llm);
            setConfig(cfg);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--color-primary))]" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-accent))] to-[rgb(var(--color-primary))]">
                    Settings
                </h1>
                <p className="text-[rgb(var(--color-text-muted))] mt-2">
                    System configuration and status
                </p>
            </div>

            {/* LLM Configuration */}
            <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Server className="w-6 h-6 text-[rgb(var(--color-primary))]" />
                    <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
                        LLM Configuration
                    </h2>
                </div>

                {llmStatus && (
                    <div className="space-y-4">
                        {/* Active LLM */}
                        <div className="flex items-center justify-between p-4 bg-[rgb(var(--color-bg-card))] rounded-lg">
                            <span className="text-sm text-[rgb(var(--color-text-muted))]">Active LLM</span>
                            <span className="font-semibold text-[rgb(var(--color-text))]">
                                {llmStatus.active_llm.toUpperCase()}
                            </span>
                        </div>

                        {/* Enterprise Configuration */}
                        <div className="p-4 bg-[rgb(var(--color-bg-card))] rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[rgb(var(--color-text-muted))]">
                                    Enterprise LLM (OAuth2)
                                </span>
                                {llmStatus.enterprise_configured ? (
                                    <span className="badge-success flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Configured
                                    </span>
                                ) : (
                                    <span className="badge-error flex items-center gap-2">
                                        <XCircle className="w-4 h-4" />
                                        Not Configured
                                    </span>
                                )}
                            </div>

                            {llmStatus.enterprise_config && (
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[rgb(var(--color-text-muted))]">Base URL</span>
                                        <span className="text-[rgb(var(--color-text))] font-mono text-xs">
                                            {llmStatus.enterprise_config.base_url}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[rgb(var(--color-text-muted))]">Client ID</span>
                                        {llmStatus.enterprise_config.has_client_id ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-400" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[rgb(var(--color-text-muted))]">Client Secret</span>
                                        {llmStatus.enterprise_config.has_client_secret ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-400" />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Connection Status */}
                        <div className="flex items-center justify-between p-4 bg-[rgb(var(--color-bg-card))] rounded-lg">
                            <span className="text-sm text-[rgb(var(--color-text-muted))]">
                                Connection Status
                            </span>
                            <span className={`badge ${llmStatus.connection_status === 'connected'
                                    ? 'badge-success'
                                    : llmStatus.connection_status === 'error'
                                        ? 'badge-error'
                                        : 'badge-primary'
                                }`}>
                                {llmStatus.connection_status}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Default LLM Settings */}
            {config && (
                <div className="glass-card p-6">
                    <h2 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-4">
                        Default LLM Settings
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-[rgb(var(--color-bg-card))] rounded-lg">
                            <span className="text-sm text-[rgb(var(--color-text-muted))]">
                                Default Temperature
                            </span>
                            <span className="font-semibold text-[rgb(var(--color-text))]">
                                {config.llm_settings.default_temperature}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-[rgb(var(--color-bg-card))] rounded-lg">
                            <span className="text-sm text-[rgb(var(--color-text-muted))]">
                                Default Max Tokens
                            </span>
                            <span className="font-semibold text-[rgb(var(--color-text))]">
                                {config.llm_settings.default_max_tokens}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-[rgb(var(--color-bg-card))] rounded-lg">
                            <span className="text-sm text-[rgb(var(--color-text-muted))]">
                                Timeout (seconds)
                            </span>
                            <span className="font-semibold text-[rgb(var(--color-text))]">
                                {config.llm_settings.timeout_seconds}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Enabled Resources */}
            {config && (
                <div className="glass-card p-6">
                    <h2 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-4">
                        Enabled Resources
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {config.enabled_resources.map((resource) => (
                            <div
                                key={resource}
                                className="p-4 bg-[rgb(var(--color-bg-card))] rounded-lg flex items-center gap-3"
                            >
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                <span className="font-medium text-[rgb(var(--color-text))] capitalize">
                                    {config.display_names[resource]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Environment Configuration Info */}
            <div className="glass-card p-6 bg-[rgb(var(--color-info))]/10 border-[rgb(var(--color-info))]/30">
                <h3 className="font-semibold text-[rgb(var(--color-text))] mb-2">
                    💡 Configuration
                </h3>
                <div className="text-sm text-[rgb(var(--color-text-muted))] space-y-1">
                    <p>Enterprise LLM credentials should be configured via environment variables:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1 font-mono text-xs">
                        <li>ENTERPRISE_BASE_URL</li>
                        <li>ENTERPRISE_CLIENT_ID</li>
                        <li>ENTERPRISE_CLIENT_SECRET</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
