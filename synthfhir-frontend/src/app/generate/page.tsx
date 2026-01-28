'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2, Settings as SettingsIcon } from 'lucide-react';
import apiClient from '@/lib/api';
import type {
    AppConfig,
    FHIRResource,
    GenerateFormState,
    GenerationResponse,
    LoadingState,
} from '@/lib/types';

export default function GeneratePage() {
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [loadingState, setLoadingState] = useState<LoadingState>('idle');
    const [formState, setFormState] = useState<GenerateFormState>({
        prompt: '',
        resources: [],
        recordCount: 5,
        quickInputs: {
            ageMin: 18,
            ageMax: 65,
            gender: 'Any',
            state: 'Any',
            insuranceType: 'Any',
        },
        llmSettings: {
            temperature: 0.7,
            maxTokens: 4000,
        },
        outputOptions: {
            applyMD5: true,
            validateOutput: true,
        },
    });
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [generationResult, setGenerationResult] = useState<GenerationResponse | null>(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const data = await apiClient.getConfig();
            setConfig(data);
            // Set default resource if available
            if (data.enabled_resources.length > 0 && formState.resources.length === 0) {
                setFormState(prev => ({
                    ...prev,
                    resources: [data.enabled_resources[0]],
                }));
            }
        } catch (error) {
            console.error('Failed to fetch config:', error);
        }
    };

    const handleGenerate = async () => {
        if (!formState.prompt.trim() || formState.resources.length === 0) {
            alert('Please enter a prompt and select at least one resource');
            return;
        }

        setLoadingState('loading');
        setGenerationResult(null);

        try {
            const quickInputs: any = {};
            if (formState.quickInputs.ageMin > 0 || formState.quickInputs.ageMax < 120) {
                quickInputs.age_min = formState.quickInputs.ageMin;
                quickInputs.age_max = formState.quickInputs.ageMax;
            }
            if (formState.quickInputs.gender !== 'Any') {
                quickInputs.gender = formState.quickInputs.gender;
            }
            if (formState.quickInputs.state !== 'Any') {
                quickInputs.state = formState.quickInputs.state;
            }
            if (formState.quickInputs.insuranceType !== 'Any') {
                quickInputs.insurance_type = formState.quickInputs.insuranceType;
            }

            const result = await apiClient.generate({
                user_prompt: formState.prompt,
                resources: formState.resources,
                record_count: formState.recordCount,
                quick_inputs: Object.keys(quickInputs).length > 0 ? quickInputs : undefined,
                temperature: formState.llmSettings.temperature,
                max_tokens: formState.llmSettings.maxTokens,
            });

            setGenerationResult(result);
            setLoadingState('success');
        } catch (error) {
            console.error('Generation failed:', error);
            setLoadingState('error');
            alert(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    if (!config) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--color-primary))]" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-accent))] to-[rgb(var(--color-primary))]">
                    Generate Synthetic Data
                </h1>
                <p className="text-[rgb(var(--color-text-muted))] mt-2">
                    Describe what data you need and let the AI generate FHIR-compliant synthetic healthcare records
                </p>
            </div>

            {/* Main Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Prompt & Resources */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Prompt */}
                    <div className="glass-card p-6">
                        <label className="block text-sm font-medium text-[rgb(var(--color-text))] mb-2">
                            💬 Describe Your Data
                        </label>
                        <textarea
                            value={formState.prompt}
                            onChange={(e) => setFormState(prev => ({ ...prev, prompt: e.target.value }))}
                            placeholder="Generate 5 diabetic patients in Texas with linked coverage and claims..."
                            className="input-field min-h-[120px] resize-none"
                            rows={5}
                        />
                    </div>

                    {/* Resources Selection */}
                    <div className="glass-card p-6">
                        <label className="block text-sm font-medium text-[rgb(var(--color-text))] mb-4">
                            📋 Select Resources
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {config.enabled_resources.map((resource) => (
                                <label
                                    key={resource}
                                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${formState.resources.includes(resource)
                                            ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10'
                                            : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))]/50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formState.resources.includes(resource)}
                                        onChange={(e) => {
                                            setFormState(prev => ({
                                                ...prev,
                                                resources: e.target.checked
                                                    ? [...prev.resources, resource]
                                                    : prev.resources.filter(r => r !== resource),
                                            }));
                                        }}
                                        className="w-4 h-4 accent-[rgb(var(--color-primary))]"
                                    />
                                    <span className="font-medium text-[rgb(var(--color-text))]">
                                        {config.display_names[resource]}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* LLM Settings (Collapsible) */}
                    <div className="glass-card p-6">
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-text))] mb-4"
                        >
                            <SettingsIcon className="w-4 h-4" />
                            LLM Settings
                            <span className="text-[rgb(var(--color-text-muted))]">
                                ({showAdvanced ? 'Hide' : 'Show'})
                            </span>
                        </button>

                        {showAdvanced && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-[rgb(var(--color-text))] mb-2">
                                        Temperature: {formState.llmSettings.temperature}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={formState.llmSettings.temperature}
                                        onChange={(e) => setFormState(prev => ({
                                            ...prev,
                                            llmSettings: { ...prev.llmSettings, temperature: parseFloat(e.target.value) },
                                        }))}
                                        className="w-full accent-[rgb(var(--color-primary))]"
                                    />
                                    <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1">
                                        Higher = more creative, Lower = more precise
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm text-[rgb(var(--color-text))] mb-2">
                                        Max Tokens: {formState.llmSettings.maxTokens}
                                    </label>
                                    <input
                                        type="range"
                                        min="500"
                                        max="8000"
                                        step="500"
                                        value={formState.llmSettings.maxTokens}
                                        onChange={(e) => setFormState(prev => ({
                                            ...prev,
                                            llmSettings: { ...prev.llmSettings, maxTokens: parseInt(e.target.value) },
                                        }))}
                                        className="w-full accent-[rgb(var(--color-primary))]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Quick Inputs & Actions */}
                <div className="space-y-6">
                    {/* Record Count */}
                    <div className="glass-card p-6">
                        <label className="block text-sm font-medium text-[rgb(var(--color-text))] mb-2">
                            🔢 Record Count
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={formState.recordCount}
                            onChange={(e) => setFormState(prev => ({ ...prev, recordCount: parseInt(e.target.value) || 1 }))}
                            className="input-field"
                        />
                    </div>

                    {/* Quick Inputs */}
                    <div className="glass-card p-6 space-y-4">
                        <h3 className="text-sm font-medium text-[rgb(var(--color-text))] mb-4">
                            ⚡ Quick Filters
                        </h3>

                        {/* Age Range */}
                        <div>
                            <label className="block text-sm text-[rgb(var(--color-text))] mb-2">
                                Age Range
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={formState.quickInputs.ageMin}
                                    onChange={(e) => setFormState(prev => ({
                                        ...prev,
                                        quickInputs: { ...prev.quickInputs, ageMin: parseInt(e.target.value) || 0 },
                                    }))}
                                    className="input-field"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={formState.quickInputs.ageMax}
                                    onChange={(e) => setFormState(prev => ({
                                        ...prev,
                                        quickInputs: { ...prev.quickInputs, ageMax: parseInt(e.target.value) || 120 },
                                    }))}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm text-[rgb(var(--color-text))] mb-2">
                                Gender
                            </label>
                            <select
                                value={formState.quickInputs.gender}
                                onChange={(e) => setFormState(prev => ({
                                    ...prev,
                                    quickInputs: { ...prev.quickInputs, gender: e.target.value },
                                }))}
                                className="input-field"
                            >
                                <option>Any</option>
                                {config.quick_inputs.gender.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-sm text-[rgb(var(--color-text))] mb-2">
                                State
                            </label>
                            <select
                                value={formState.quickInputs.state}
                                onChange={(e) => setFormState(prev => ({
                                    ...prev,
                                    quickInputs: { ...prev.quickInputs, state: e.target.value },
                                }))}
                                className="input-field"
                            >
                                <option>Any</option>
                                {config.quick_inputs.states.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Insurance */}
                        <div>
                            <label className="block text-sm text-[rgb(var(--color-text))] mb-2">
                                Insurance Type
                            </label>
                            <select
                                value={formState.quickInputs.insuranceType}
                                onChange={(e) => setFormState(prev => ({
                                    ...prev,
                                    quickInputs: { ...prev.quickInputs, insuranceType: e.target.value },
                                }))}
                                className="input-field"
                            >
                                <option>Any</option>
                                {config.quick_inputs.insurance_types.map(i => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Output Options */}
                    <div className="glass-card p-6 space-y-3">
                        <h3 className="text-sm font-medium text-[rgb(var(--color-text))] mb-2">
                            📤 Output Options
                        </h3>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formState.outputOptions.applyMD5}
                                onChange={(e) => setFormState(prev => ({
                                    ...prev,
                                    outputOptions: { ...prev.outputOptions, applyMD5: e.target.checked },
                                }))}
                                className="w-4 h-4 accent-[rgb(var(--color-primary))]"
                            />
                            <span className="text-sm text-[rgb(var(--color-text))]">
                                Apply MD5 hashing to PHI fields
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formState.outputOptions.validateOutput}
                                onChange={(e) => setFormState(prev => ({
                                    ...prev,
                                    outputOptions: { ...prev.outputOptions, validateOutput: e.target.checked },
                                }))}
                                className="w-4 h-4 accent-[rgb(var(--color-primary))]"
                            />
                            <span className="text-sm text-[rgb(var(--color-text))]">
                                Validate generated data
                            </span>
                        </label>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={loadingState === 'loading' || formState.resources.length === 0}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingState === 'loading' ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Generate Data
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {generationResult && (
                <div className="glass-card p-6 mt-8">
                    <h2 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-4">
                        Generation Results
                    </h2>
                    <div className="space-y-4">
                        {Object.entries(generationResult.results).map(([resource, result]) => (
                            <div key={resource} className="border border-[rgb(var(--color-border))] rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-[rgb(var(--color-text))] capitalize">
                                        {resource}
                                    </h3>
                                    {result.success ? (
                                        <span className="badge-success">
                                            ✓ {result.data?.length || 0} records
                                        </span>
                                    ) : (
                                        <span className="badge-error">
                                            ✗ Failed
                                        </span>
                                    )}
                                </div>
                                {result.error && (
                                    <p className="text-sm text-red-400">{result.error}</p>
                                )}
                                {result.validation_errors && result.validation_errors.length > 0 && (
                                    <p className="text-sm text-yellow-400">
                                        {result.validation_errors.length} validation warnings
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <a href="/results" className="btn-primary">
                            View & Export Results →
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
