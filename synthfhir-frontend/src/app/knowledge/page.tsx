'use client';

import { useState, useEffect } from 'react';
import { Upload, RefreshCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api';
import type { KnowledgeStatus, FHIRResource } from '@/lib/types';

export default function KnowledgePage() {
    const [status, setStatus] = useState<KnowledgeStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [indexing, setIndexing] = useState<string | null>(null);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadTarget, setUploadTarget] = useState<FHIRResource | 'global'>('global');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const data = await apiClient.getKnowledgeStatus();
            setStatus(data);
        } catch (error) {
            console.error('Failed to fetch knowledge status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIndex = async (resource: FHIRResource) => {
        setIndexing(resource);
        try {
            await apiClient.indexResource(resource);
            await fetchStatus();
        } catch (error) {
            console.error(`Failed to index ${resource}:`, error);
            alert(`Indexing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIndexing(null);
        }
    };

    const handleIndexAll = async () => {
        setIndexing('all');
        try {
            await apiClient.indexAllResources();
            await fetchStatus();
        } catch (error) {
            console.error('Failed to index all resources:', error);
            alert(`Indexing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIndexing(null);
        }
    };

    const handleUpload = async () => {
        if (!uploadFile) return;

        setUploading(true);
        try {
            await apiClient.uploadDocument(uploadFile, uploadTarget);
            setUploadFile(null);
            await fetchStatus();
            alert('File uploaded and indexed successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
            alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-accent))] to-[rgb(var(--color-primary))]">
                        Knowledge Base Management
                    </h1>
                    <p className="text-[rgb(var(--color-text-muted))] mt-2">
                        Manage DDL files and guidelines for RAG-enhanced generation
                    </p>
                </div>
                <button
                    onClick={handleIndexAll}
                    disabled={indexing !== null}
                    className="btn-secondary flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${indexing === 'all' ? 'animate-spin' : ''}`} />
                    Reindex All
                </button>
            </div>

            {/* Stats Card */}
            {status && (
                <div className="glass-card p-6">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-accent))] to-[rgb(var(--color-primary))]">
                            {status.total_documents}
                        </div>
                        <div className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
                            Total Documents Indexed
                        </div>
                    </div>
                </div>
            )}

            {/* Resources Status */}
            <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-[rgb(var(--color-text))] mb-4">
                    📚 Resources Status
                </h2>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--color-primary))]" />
                    </div>
                ) : status ? (
                    <div className="space-y-3">
                        {Object.entries(status.resources).map(([resource, info]) => (
                            <div
                                key={resource}
                                className="flex items-center justify-between p-4 bg-[rgb(var(--color-bg-card))] rounded-lg border border-[rgb(var(--color-border))]"
                            >
                                <div className="flex-1">
                                    <h3 className="font-semibold text-[rgb(var(--color-text))] capitalize mb-2">
                                        {resource}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            {info.ddl_exists ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-400" />
                                            )}
                                            <span className="text-[rgb(var(--color-text-muted))]">DDL</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {info.knowledge_exists ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <span className="w-4 h-4 rounded-full bg-[rgb(var(--color-border))]" />
                                            )}
                                            <span className="text-[rgb(var(--color-text-muted))]">Guidelines</span>
                                        </div>
                                        <div className="text-[rgb(var(--color-text-muted))]">
                                            {info.document_count} chunks indexed
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleIndex(resource as FHIRResource)}
                                    disabled={indexing !== null}
                                    className="btn-secondary flex items-center gap-2 px-4 py-2"
                                >
                                    {indexing === resource ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-4 h-4" />
                                    )}
                                    Index
                                </button>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>

            {/* Upload Section */}
            <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-[rgb(var(--color-text))] mb-4">
                    📤 Upload Documents
                </h2>
                <p className="text-sm text-[rgb(var(--color-text-muted))] mb-4">
                    Upload guidelines, documentation, or additional context files (TXT, PDF, CSV)
                </p>
                <div className="space-y-4">
                    {/* File Input */}
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text))] mb-2">
                            Select File
                        </label>
                        <div className="flex items-center gap-3">
                            <label className="flex-1 cursor-pointer">
                                <div className="input-field flex items-center justify-between">
                                    <span className={uploadFile ? 'text-[rgb(var(--color-text))]' : 'text-[rgb(var(--color-text-muted))]'}>
                                        {uploadFile ? uploadFile.name : 'Choose file...'}
                                    </span>
                                    <Upload className="w-5 h-5 text-[rgb(var(--color-text-muted))]" />
                                </div>
                                <input
                                    type="file"
                                    accept=".txt,.pdf,.csv"
                                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Target Resource */}
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--color-text))] mb-2">
                            Target Resource
                        </label>
                        <select
                            value={uploadTarget}
                            onChange={(e) => setUploadTarget(e.target.value as FHIRResource | 'global')}
                            className="input-field"
                        >
                            <option value="global">Global (all resources)</option>
                            {status && Object.keys(status.resources).map((resource) => (
                                <option key={resource} value={resource} className="capitalize">
                                    {resource}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        disabled={!uploadFile || uploading}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Upload & Index
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="glass-card p-6 bg-[rgb(var(--color-info))]/10 border-[rgb(var(--color-info))]/30">
                <h3 className="font-semibold text-[rgb(var(--color-text))] mb-2">
                    💡 Folder Structure
                </h3>
                <div className="text-sm text-[rgb(var(--color-text-muted))] space-y-1 font-mono">
                    <div>- <span className="text-[rgb(var(--color-accent))]">ddl/</span> - DDL files (e.g., patient.sql)</div>
                    <div>- <span className="text-[rgb(var(--color-accent))]">knowledge/</span> - Guidelines and documentation</div>
                </div>
            </div>
        </div>
    );
}
