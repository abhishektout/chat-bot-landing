export interface IndustryData {
  slug: string;
  name: string;
  badge: string;
  color: string;
  title: string;
  subtitle: string;
  stat: string;
  statLabel: string;
  description: string;
  capabilities: string[];
  useCases: { heading: string; body: string }[];
}

export const INDUSTRIES: IndustryData[] = [
  {
    slug: "e-commerce",
    name: "E-Commerce",
    badge: "E-Commerce",
    color: "#4f7cff",
    title: "AI Customer Support for E-Commerce",
    subtitle: "Automate tracking, returns, and order queries without losing the human touch.",
    stat: "45%",
    statLabel: "Fewer support tickets",
    description:
      "Integrate with Shopify, WooCommerce, or Magento in minutes. Let Assistly track deliveries, update order statuses, initiate refund procedures, and upsell products autonomously.",
    capabilities: [
      "Real-time order & delivery tracking",
      "Automated returns and refund workflows",
      "Product recommendation upselling",
      "Shopify / WooCommerce / Magento connectors",
      "Sentiment-triggered human escalation",
    ],
    useCases: [
      {
        heading: "Order Management",
        body: "Customers receive instant order status, estimated delivery windows, and proactive delay alerts without any agent involvement.",
      },
      {
        heading: "Returns & Refunds",
        body: "The AI walks customers through return eligibility checks, generates labels, and initiates refunds in one seamless conversation.",
      },
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    badge: "Healthcare",
    color: "#ec4899",
    title: "Secure AI Support for Healthcare & MedTech",
    subtitle: "HIPAA-compliant assistant to schedule appointments and answer patient inquiries.",
    stat: "60%",
    statLabel: "Faster response times",
    description:
      "Answer patient FAQs, coordinate scheduling systems, and pre-screen clinical queries securely. Ensure absolute confidentiality with insulated tenant vector search.",
    capabilities: [
      "HIPAA-compliant data handling",
      "Appointment scheduling & reminders",
      "Insurance query resolution",
      "Clinical FAQ pre-screening",
      "EHR system integration support",
    ],
    useCases: [
      {
        heading: "Patient Scheduling",
        body: "Patients book, reschedule, or cancel appointments 24/7 with zero hold times, synced directly to your clinic calendar.",
      },
      {
        heading: "Insurance Queries",
        body: "Instant resolution of coverage questions, co-pay lookups, and prior-authorization status checks.",
      },
    ],
  },
  {
    slug: "saas",
    name: "SaaS",
    badge: "SaaS",
    color: "#8b5cf6",
    title: "Automated Onboarding & Support for SaaS",
    subtitle: "Boost customer retention with setup walkthroughs and technical triage.",
    stat: "70%",
    statLabel: "Support cost reduction",
    description:
      "Help customers navigate user configuration dashboards, debug API keys, find developer documentation, and seamlessly escalate bugs directly into Jira or Linear.",
    capabilities: [
      "Interactive onboarding walkthroughs",
      "API key & configuration troubleshooting",
      "Auto-triage bug reports to Jira / Linear",
      "Proactive churn-risk detection",
      "In-app widget with context injection",
    ],
    useCases: [
      {
        heading: "Customer Onboarding",
        body: "New users receive step-by-step interactive guidance that adapts to their specific plan and configuration options.",
      },
      {
        heading: "Technical Support",
        body: "AI resolves Tier-1 issues instantly, and hands off to engineers with full conversation context attached.",
      },
    ],
  },
  {
    slug: "finance",
    name: "Finance",
    badge: "Finance",
    color: "#00d4ff",
    title: "Regulatory-Compliant AI for FinTech",
    subtitle: "Assist customers with transactions, account limits, and policy compliance.",
    stat: "99.9%",
    statLabel: "Compliance rate",
    description:
      "Handle complex queries regarding transaction logs, card activations, and fee disclosures safely. Isolation layers prevent security leaks and protect sensitive client records.",
    capabilities: [
      "Encrypted, SOC2-certified data handling",
      "Transaction history lookups",
      "Card activation & dispute filing",
      "Regulatory disclosure delivery",
      "AML / KYC query support",
    ],
    useCases: [
      {
        heading: "Transaction Disputes",
        body: "Customers file disputes, track resolution progress, and receive regulatory notifications — all within a single chat interface.",
      },
      {
        heading: "Account Management",
        body: "Instant balance inquiries, credit-limit changes, and statement requests without agent bottlenecks.",
      },
    ],
  },
  {
    slug: "insurance",
    name: "Insurance",
    badge: "Insurance",
    color: "#f59e0b",
    title: "Automate Claims & Support for Insurance",
    subtitle: "Resolve claim reports, policy checks, and premium inquiries instantly.",
    stat: "3.2×",
    statLabel: "More claims resolved",
    description:
      "Walk clients through filing new claims, retrieve policy numbers, and update renewal details automatically. Free up human adjusters to handle complex escalations.",
    capabilities: [
      "First-notice-of-loss (FNOL) intake",
      "Policy coverage lookup",
      "Claims status tracking",
      "Renewal & premium notifications",
      "Adjuster escalation with context",
    ],
    useCases: [
      {
        heading: "Claims Filing",
        body: "AI guides customers through FNOL intake, collects required documentation, and assigns an adjuster automatically.",
      },
      {
        heading: "Policy Lookups",
        body: "Policyholders instantly retrieve coverage summaries, deductibles, and renewal dates without hold queues.",
      },
    ],
  },
  {
    slug: "education",
    name: "Education",
    badge: "Education",
    color: "#10b981",
    title: "24/7 AI Assistants for Education & EdTech",
    subtitle: "Support student enrollment, course selection, and virtual campus FAQs.",
    stat: "40%",
    statLabel: "Enrollment increase",
    description:
      "Help prospective students find courses, retrieve fee schedules, guide enrollment forms, and answer daily campus questions instantly.",
    capabilities: [
      "Enrollment & admissions guidance",
      "Course catalog & fee lookups",
      "Scholarship & financial aid FAQs",
      "LMS & student portal integration",
      "Alumni & career services support",
    ],
    useCases: [
      {
        heading: "Admissions Support",
        body: "Prospective students get instant answers to course requirements, deadlines, and application status 24/7.",
      },
      {
        heading: "Campus FAQs",
        body: "Answer hundreds of recurring student queries on fee structures, timetables, and campus services without staff involvement.",
      },
    ],
  },
  {
    slug: "travel",
    name: "Travel",
    badge: "Travel",
    color: "#f97316",
    title: "Real-time Support for Travel & Hospitality",
    subtitle: "Manage flight details, hotel bookings, and travel changes 24/7.",
    stat: "4.8★",
    statLabel: "Average customer rating",
    description:
      "Automate booking retrieval, reservation alterations, local itineraries, and travel support inquiries. Scale instantly during peak seasonal travel windows.",
    capabilities: [
      "Booking management & modifications",
      "Real-time flight status integration",
      "Hotel & activity reservations",
      "Itinerary generation",
      "Multi-lingual traveller support",
    ],
    useCases: [
      {
        heading: "Booking Changes",
        body: "Travellers amend, cancel, or upgrade reservations in seconds with no call centre wait times.",
      },
      {
        heading: "Travel Assistance",
        body: "Real-time delay notifications, gate updates, and alternative routing suggestions delivered proactively.",
      },
    ],
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    badge: "Enterprise",
    color: "#3b82f6",
    title: "Enterprise-Grade AI Support Platform",
    subtitle: "Scale operations with white-labeled portals, custom LLMs, and dedicated SLAs.",
    stat: "SOC2",
    statLabel: "Certified & Custom SLA",
    description:
      "Built for high-volume organizations needing dedicated cloud environments, fine-tuned custom models, reseller white-labeling, and dedicated support engineering.",
    capabilities: [
      "Dedicated cloud tenancy & VPC isolation",
      "Custom LLM fine-tuning on private data",
      "White-label branding & subdomain routing",
      "Priority 24/7 support engineering",
      "Enterprise SSO & SAML integration",
    ],
    useCases: [
      {
        heading: "White-Label Portals",
        body: "Agencies and resellers deploy fully branded support experiences under their own domain in under 48 hours.",
      },
      {
        heading: "Custom AI Models",
        body: "Private Llama fine-tuning on your proprietary knowledge base ensures accurate, confidential, hallucination-resistant responses.",
      },
    ],
  },
];

export const INDUSTRY_MAP = new Map<string, IndustryData>(
  INDUSTRIES.map((ind) => [ind.slug, ind])
);
