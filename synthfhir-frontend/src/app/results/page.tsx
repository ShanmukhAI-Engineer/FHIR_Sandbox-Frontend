'use client';

import { useState, useEffect } from 'react';
import { Download, FileJson, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api';
import type { GeneratedData } from '@/lib/types';

export default function ResultsPage() {
    const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
    const [exporting, setExporting] = useState<string | null>(null);

    // In a real app, this would be stored in context or state management
    // For now, we'll simulate it
    useEffect(() => {
        // Check if there's data in localStorage (temporary solution)
        const stored = localStorage.getItem('synthfhir_results');
        if (stored) {
            try {
                setGeneratedData(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse stored results:', e);
            }
        }
    }, []);

    const handleExportCSV = async (resource: string, data: any[]) => {
        setExporting(resource);
        try {
            const result = await apiClient.exportToCSV({
                resource: resource as any,
                data,
                apply_md5: true,
            });

            if (result.success && result.download_url) {
                // Trigger download
                const blob = await apiClient.downloadCSV(result.filepath!);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${resource}_synthetic.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Export failed:', error);
            alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setExporting(null);
        }
    };

    const copyJSON = (data: any[]) => {
        navigator.clipboard.writeText(JSON.stringify(data.slice(0, 5), null, 2));
        alert('First 5 records copied to clipboard!');
    };

    if (!generatedData || Object.keys(generatedData).length === 0) {
        return (
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-accent))] to-[rgb(var(--color-primary))] mb-6">
                    Generated Results
                </h1>
                <div className="glass-card p-12 text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h2 className="text-2xl font-semibold text-[rgb(var(--color-text))] mb-2">
                        No Data Generated Yet
                    </h2>
                    <p className="text-[rgb(var(--color-text-muted))] mb-6">
                        Go to the Generate tab to create synthetic FHIR data
                    </p>
                    <a href="/generate" className="btn-primary inline-block">
                        Start Generating →
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-accent))] to-[rgb(var(--color-primary))]">
                    Generated Results
                </h1>
                <p className="text-[rgb(var(--color-text-muted))] mt-2">
                    View and export your generated synthetic data
                </p>
            </div>

            {/* Results by Resource */}
            {Object.entries(generatedData).map(([resource, records]) => (
                <div key={resource} className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-[rgb(var(--color-text))] capitalize">
                            {resource}
                            <span className="text-sm font-normal text-[rgb(var(--color-text-muted))] ml-3">
                                ({records.length} records)
                            </span>
                        </h2>
                        <div className="flex gap-3">
                            <button
                                onClick={() => copyJSON(records)}
                                className="btn-secondary flex items-center gap-2 px-4 py-2"
                            >
                                <FileJson className="w-4 h-4" />
                                Copy JSON
                            </button>
                            <button
                                onClick={() => handleExportCSV(resource, records)}
                                disabled={exporting !== null}
                                className="btn-primary flex items-center gap-2 px-4 py-2"
                            >
                                {exporting === resource ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Exporting...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        Export CSV
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Data Preview Table */}
                    {records.length > 0 && (
                        <div className="overflow-x-auto scrollbar-thin">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[rgb(var(--color-border))]">
                                        {Object.keys(records[0]).slice(0, 6).map((key) => (
                                            <th
                                                key={key}
                                                className="text-left py-3 px-4 font-semibold text-[rgb(var(--color-text))]"
                                            >
                                                {key}
                                            </th>
                                        ))}
                                        {Object.keys(records[0]).length > 6 && (
                                            <th className="text-left py-3 px-4 font-semibold text-[rgb(var(--color-text))]">
                                                ...
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.slice(0, 10).map((record, idx) => (
                                        <tr
                                            key={idx}
                                            className="border-b border-[rgb(var(--color-border))]/50 hover:bg-[rgb(var(--color-bg-hover))]/30"
                                        >
                                            {Object.entries(record).slice(0, 6).map(([key, value]) => (
                                                <td
                                                    key={key}
                                                    className="py-3 px-4 text-[rgb(var(--color-text-muted))]"
                                                >
                                                    {typeof value === 'object'
                                                        ? JSON.stringify(value).substring(0, 50) + '...'
                                                        : String(value).substring(0, 50)}
                                                </td>
                                            ))}
                                            {Object.keys(record).length > 6 && (
                                                <td className="py-3 px-4 text-[rgb(var(--color-text-muted))]">
                                                    +{Object.keys(record).length - 6} more
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {records.length > 10 && (
                                <div className="text-center py-4 text-sm text-[rgb(var(--color-text-muted))]">
                                    Showing first 10 of {records.length} records
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
