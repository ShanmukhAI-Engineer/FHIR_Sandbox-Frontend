// FHIR Resources
export type FHIRResource = 'patient' | 'coverage' | 'claim' | 'observation';

// Configuration Types
export interface ResourceConfig {
    enabled: boolean;
    display_name: string;
    description: string;
    ddl_file: string;
    knowledge_dir: string;
    template_file: string;
    exclude_columns: string[];
    md5_fields: string[];
    relationships: Array<{
        column: string;
        references: string;
    }>;
}

export interface AppConfig {
    resources: Record<FHIRResource, ResourceConfig>;
    enabled_resources: FHIRResource[];
    display_names: Record<FHIRResource, string>;
    quick_inputs: QuickInputOptions;
    llm_settings: LLMSettings;
}

export interface QuickInputOptions {
    gender: string[];
    states: string[];
    insurance_types: string[];
    age_range: {
        min: number;
        max: number;
        default_min: number;
        default_max: number;
    };
}

export interface LLMSettings {
    default_temperature: number;
    default_max_tokens: number;
    timeout_seconds: number;
}

// Generation Types
export interface GenerationRequest {
    user_prompt: string;
    resources: FHIRResource[];
    record_count: number;
    quick_inputs?: {
        age_min?: number;
        age_max?: number;
        gender?: string;
        state?: string;
        insurance_type?: string;
    };
    temperature?: number;
    max_tokens?: number;
}

export interface GenerationResult {
    success: boolean;
    data?: any[];
    error?: string;
    validation_errors?: string[];
}

export interface GenerationResponse {
    results: Record<FHIRResource, GenerationResult>;
    timestamp: string;
}

// Knowledge Base Types
export interface KnowledgeStatus {
    total_documents: number;
    resources: Record<FHIRResource, {
        ddl_exists: boolean;
        knowledge_exists: boolean;
        document_count: number;
    }>;
}

export interface IndexResponse {
    success: boolean;
    chunks_indexed: number;
    resource: string;
}

export interface UploadRequest {
    file: File;
    target_resource: FHIRResource | 'global';
}

// LLM Status
export interface LLMStatus {
    active_llm: string;
    enterprise_configured: boolean;
    enterprise_config?: {
        base_url: string;
        has_client_id: boolean;
        has_client_secret: boolean;
    };
    connection_status: 'connected' | 'disconnected' | 'error';
}

// Export Types
export interface ExportRequest {
    resource: FHIRResource;
    data: any[];
    apply_md5?: boolean;
}

export interface ExportResponse {
    success: boolean;
    filepath?: string;
    download_url?: string;
    error?: string;
}

// UI State Types
export interface GenerateFormState {
    prompt: string;
    resources: FHIRResource[];
    recordCount: number;
    quickInputs: {
        ageMin: number;
        ageMax: number;
        gender: string;
        state: string;
        insuranceType: string;
    };
    llmSettings: {
        temperature: number;
        maxTokens: number;
    };
    outputOptions: {
        applyMD5: boolean;
        validateOutput: boolean;
    };
}

export interface GeneratedData {
    [key: string]: any[];
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}
