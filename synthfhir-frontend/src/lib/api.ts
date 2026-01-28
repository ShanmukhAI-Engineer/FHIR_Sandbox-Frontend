import type {
    AppConfig,
    GenerationRequest,
    GenerationResponse,
    KnowledgeStatus,
    IndexResponse,
    LLMStatus,
    ExportRequest,
    ExportResponse,
    FHIRResource,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class APIClient {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const error = await response.json().catch(() => ({
                    detail: response.statusText,
                }));
                throw new Error(error.detail || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unknown error occurred');
        }
    }

    // Health Check
    async healthCheck(): Promise<{ status: string; timestamp: string }> {
        return this.request('/api/health');
    }

    // Configuration
    async getConfig(): Promise<AppConfig> {
        return this.request('/api/config');
    }

    // Generation
    async generate(request: GenerationRequest): Promise<GenerationResponse> {
        return this.request('/api/generate', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    // Knowledge Base
    async getKnowledgeStatus(): Promise<KnowledgeStatus> {
        return this.request('/api/knowledge/status');
    }

    async indexResource(resource: FHIRResource): Promise<IndexResponse> {
        return this.request('/api/knowledge/index', {
            method: 'POST',
            body: JSON.stringify({ resource }),
        });
    }

    async indexAllResources(): Promise<IndexResponse> {
        return this.request('/api/knowledge/index/all', {
            method: 'POST',
        });
    }

    async uploadDocument(
        file: File,
        targetResource: FHIRResource | 'global'
    ): Promise<IndexResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('target_resource', targetResource);

        return this.request('/api/knowledge/upload', {
            method: 'POST',
            body: formData,
            headers: {}, // Let browser set Content-Type for FormData
        });
    }

    // LLM Status
    async getLLMStatus(): Promise<LLMStatus> {
        return this.request('/api/llm/status');
    }

    // Export
    async exportToCSV(request: ExportRequest): Promise<ExportResponse> {
        return this.request(`/api/export/${request.resource}`, {
            method: 'POST',
            body: JSON.stringify({
                data: request.data,
                apply_md5: request.apply_md5,
            }),
        });
    }

    async downloadCSV(filepath: string): Promise<Blob> {
        const url = `${this.baseURL}/api/download/${encodeURIComponent(filepath)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Download failed: ${response.statusText}`);
        }

        return await response.blob();
    }
}

export const apiClient = new APIClient();
export default apiClient;
