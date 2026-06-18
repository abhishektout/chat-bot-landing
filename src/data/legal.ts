export interface LegalDoc {
  slug: string;
  title: string;
  lastUpdated: string;
  sections: { heading: string; body: string }[];
}

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    lastUpdated: "June 18, 2026",
    sections: [
      {
        heading: "Data We Collect",
        body: "Assistly collects personal identification context, usage parameters, and conversational inputs strictly to provide automated customer support features to our enterprise tenants. We do not sell your data to third parties.",
      },
      {
        heading: "How We Use Your Data",
        body: "Conversational history and uploaded text records are securely parsed using isolated vector embeddings. Tenant data is sandboxed, and LLM context queries do not feed back into public baseline models.",
      },
      {
        heading: "Data Security",
        body: "We implement industry-standard AES-256 encryption and restrict infrastructure access to authorized DevOps personnel under strict security audits and signed NDAs.",
      },
      {
        heading: "Your Rights",
        body: "You may request access, correction, or deletion of your personal data at any time by contacting privacy@assistly.io. EU users have additional rights under GDPR as described in our GDPR policy.",
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    lastUpdated: "June 18, 2026",
    sections: [
      {
        heading: "Acceptance of Terms",
        body: "By accessing or using the Assistly customer support AI platform, you agree to comply with our usage guidelines and guarantee the authenticity of uploaded context information.",
      },
      {
        heading: "Billing & Subscriptions",
        body: "Accounts are billed dynamically based on chat thresholds, API request quotas, and dynamic database integrations specified in your selected pricing plan. Downgrades take effect at end of billing cycle.",
      },
      {
        heading: "Service Availability",
        body: "Assistly is provided 'as is' with commercially reasonable uptime guarantees. Tenants are responsible for configuring fallback human-agent notifications to handle planned maintenance windows.",
      },
      {
        heading: "Termination",
        body: "Either party may terminate this agreement with 30 days written notice. Upon termination, all tenant data is securely erased within 14 business days per our data retention schedule.",
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    lastUpdated: "June 18, 2026",
    sections: [
      {
        heading: "What Are Cookies",
        body: "Cookies are small text files stored on your device by your browser. We use them to maintain session state, remember your preferences, and analyze platform performance.",
      },
      {
        heading: "Cookies We Use",
        body: "We use persistent session cookies to authenticate users, save dashboard themes, and track widget sessions on tenant websites. Functional cookies are strictly necessary for the platform to operate.",
      },
      {
        heading: "Analytics Cookies",
        body: "Third-party analytical cookie trackers help us monitor system load performance and user flow navigation routes to optimize latency. These are always opt-in.",
      },
      {
        heading: "Managing Cookies",
        body: "Users can opt-out of cookie tracking configurations at any time via browser settings or our cookie preference center without affecting core platform functionality.",
      },
    ],
  },
  {
    slug: "gdpr",
    title: "GDPR Compliance",
    lastUpdated: "June 18, 2026",
    sections: [
      {
        heading: "Lawful Basis for Processing",
        body: "We process customer support and user context logs under the lawful bases of contractual necessity and legitimate interests. We obtain explicit consent before processing sensitive data categories.",
      },
      {
        heading: "Your GDPR Rights",
        body: "European Union users retain the right to access, erase, restrict, and export personal information. Submit requests to dpo@assistly.io and receive a response within 30 days.",
      },
      {
        heading: "Data Processing Agreements",
        body: "We execute Data Processing Agreements (DPAs) with all enterprise customers and guarantee that all subprocessors comply with EU privacy protection standards under Article 28.",
      },
      {
        heading: "International Transfers",
        body: "Cross-border data transfers are governed by Standard Contractual Clauses (SCCs) approved by the European Commission, ensuring equivalent protection outside the EU.",
      },
    ],
  },
  {
    slug: "security",
    title: "Security Standards",
    lastUpdated: "June 18, 2026",
    sections: [
      {
        heading: "Encryption",
        body: "All network requests to Assistly API endpoints are encrypted in transit using TLS 1.3. Data at rest is encrypted using AES-256 with key rotation on a 90-day schedule.",
      },
      {
        heading: "Access Controls",
        body: "We enforce role-based access controls (RBAC), least-privilege principles, and require multi-factor authentication (MFA) for all administrative console operations.",
      },
      {
        heading: "Compliance Audits",
        body: "We run daily automated security scans using industry-standard SAST/DAST tooling and hold annual SOC2 Type II audits. Reports are available to enterprise customers under NDA.",
      },
      {
        heading: "Vulnerability Disclosure",
        body: "We operate an active bug bounty program. To report a security vulnerability, contact security@assistly.io with a detailed description. We commit to a 48-hour initial response.",
      },
    ],
  },
];

export const LEGAL_DOC_MAP = new Map<string, LegalDoc>(
  LEGAL_DOCS.map((doc) => [doc.slug, doc])
);
