export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="glass-card p-8 border border-[var(--glass-border)] hover-lift">
        <div className="flex items-start justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-accent))] to-[rgb(var(--color-primary))]">
              Synthetic FHIR Data Generator
            </h1>
            <p className="text-lg text-[rgb(var(--color-text-muted))] mb-6">
              Generate synthetic healthcare data matching your Snowflake DDL structure using Enterprise LLM and RAG.
            </p>
            <div className="flex gap-4">
              <a
                href="/generate"
                className="btn-primary"
              >
                Start Generating
              </a>
              <a
                href="/knowledge"
                className="btn-secondary"
              >
                Manage Knowledge Base
              </a>
            </div>
          </div>
          <div className="text-6xl">🏥</div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon="🔗"
          title="FHIR R4 Compatible"
          description="Generate Patient, Coverage, Claim, and Observation resources"
        />
        <FeatureCard
          icon="📊"
          title="DDL-Driven"
          description="Output matches your Snowflake table structure exactly"
        />
        <FeatureCard
          icon="🤖"
          title="RAG-Enhanced"
          description="Uses your guidelines and documentation for accurate generation"
        />
        <FeatureCard
          icon="🔒"
          title="PHI Protection"
          description="MD5 hashing for sensitive fields to protect patient data"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Supported Resources" value="4" subtext="FHIR R4 Resource Types" />
        <StatCard label="Enterprise LLM" value="OAuth2" subtext="Secure Authentication" />
        <StatCard label="Export Formats" value="CSV" subtext="JSON & More Coming" />
      </div>

      {/* Getting Started */}
      <div className="glass-card p-8">
        <h2 className="text-2xl font-bold mb-6 text-[rgb(var(--color-text))]">
          Getting Started
        </h2>
        <div className="space-y-4">
          <Step number={1} title="Upload your DDL files" description="Add your Snowflake DDL files to the knowledge base" />
          <Step number={2} title="Add guidelines (Optional)" description="Upload documentation and guidelines for better generation" />
          <Step number={3} title="Generate data" description="Describe what data you need and let the AI generate it" />
          <Step number={4} title="Export & use" description="Download your synthetic data as CSV for use in your systems" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="glass-card p-6 hover-lift">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-[rgb(var(--color-text))]">{title}</h3>
      <p className="text-sm text-[rgb(var(--color-text-muted))]">{description}</p>
    </div>
  );
}

function StatCard({ label, value, subtext }: { label: string; value: string; subtext: string }) {
  return (
    <div className="glass-card p-6 text-center">
      <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-accent))] to-[rgb(var(--color-primary))] mb-2">
        {value}
      </div>
      <div className="text-sm font-medium text-[rgb(var(--color-text))] mb-1">{label}</div>
      <div className="text-xs text-[rgb(var(--color-text-muted))]">{subtext}</div>
    </div>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-primary-dark))] flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <div>
        <h4 className="font-semibold text-[rgb(var(--color-text))]">{title}</h4>
        <p className="text-sm text-[rgb(var(--color-text-muted))]">{description}</p>
      </div>
    </div>
  );
}
