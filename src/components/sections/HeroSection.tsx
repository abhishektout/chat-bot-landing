"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Play, Sparkles, MessageSquare, Database, User,
  BarChart3, Shield, Zap, FileText, Globe, Link, Cpu,
  CheckCircle, Headphones, ShieldCheck, Activity, Lock, Fingerprint, Check
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "ai" | "human" | "system" | "sentiment";
  text: string;
  isThinking?: boolean;
  isTyping?: boolean;
  options?: { label: string; actionValue?: string }[];
  isActionLink?: boolean;
  source?: string;
}

const liveMetrics = [
  { label: "AI Resolved Rate", value: "84%", change: "+3.2%" },
  { label: "Human Takeovers", value: "16%", change: "-1.5%" },
  { label: "Leads Captured", value: "1,204", change: "+14%" },
  { label: "Average Response Time", value: "0.8 sec", change: "Optimal" },
  { label: "Knowledge Sources", value: "5 Connected", change: "100%" },
  { label: "Active Conversations", value: "2,847", change: "+12%" },
];

function FlowPath({ d, active, color = "#4f7cff", speed = 1.5 }: { d: string; active: boolean; color?: string; speed?: number }) {
  return (
    <>
      {/* Background path */}
      <path d={d} stroke="var(--card-border)" strokeWidth="1.2" fill="none" opacity={0.3} />

      {/* Flow path */}
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={active ? 2.2 : 1.2}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: active ? 0.3 : 0.15, pathOffset: 0 }}
        animate={{ pathOffset: 1 }}
        transition={{
          repeat: Infinity,
          duration: active ? speed : 4,
          ease: "linear"
        }}
        style={{
          opacity: active ? 0.95 : 0.2,
          filter: active ? `drop-shadow(0 0 4px ${color})` : "none",
        }}
      />
    </>
  );
}

interface TooltipProps {
  title: React.ReactNode;
  description: string;
  position?: "top" | "bottom" | "left" | "right" | "top-right" | "top-left" | "bottom-right" | "bottom-left";
  isVisible: boolean;
}

function Tooltip({ title, description, position = "top", isVisible }: TooltipProps) {
  const positionStyles: React.CSSProperties = {
    position: "absolute",
    zIndex: 100,
    pointerEvents: "none",
    width: "160px",
    minWidth: "160px",
  };

  switch (position) {
    case "top":
      positionStyles.bottom = "calc(100% + 8px)";
      positionStyles.left = "50%";
      positionStyles.transform = "translateX(-50%)";
      break;
    case "bottom":
      positionStyles.top = "calc(100% + 8px)";
      positionStyles.left = "50%";
      positionStyles.transform = "translateX(-50%)";
      break;
    case "left":
      positionStyles.right = "calc(100% + 8px)";
      positionStyles.top = "50%";
      positionStyles.transform = "translateY(-50%)";
      break;
    case "right":
      positionStyles.left = "calc(100% + 8px)";
      positionStyles.top = "50%";
      positionStyles.transform = "translateY(-50%)";
      break;
    case "top-right":
      positionStyles.bottom = "calc(100% + 8px)";
      positionStyles.left = "50%";
      positionStyles.transform = "translateX(0%)";
      break;
    case "top-left":
      positionStyles.bottom = "calc(100% + 8px)";
      positionStyles.right = "50%";
      positionStyles.transform = "translateX(0%)";
      break;
    case "bottom-right":
      positionStyles.top = "calc(100% + 8px)";
      positionStyles.left = "50%";
      positionStyles.transform = "translateX(0%)";
      break;
    case "bottom-left":
      positionStyles.top = "calc(100% + 8px)";
      positionStyles.right = "50%";
      positionStyles.transform = "translateX(0%)";
      break;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{
            ...positionStyles,
            background: "var(--glass-bg)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid var(--glass-border)",
            borderRadius: "8px",
            padding: "8px 10px",
            boxShadow: "0 8px 30px var(--shadow)",
            textAlign: "left",
          }}
        >
          <div style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "var(--fg)",
            marginBottom: "3px",
            whiteSpace: "nowrap",
          }}>
            {title}
          </div>
          <div style={{
            fontSize: "9.5px",
            lineHeight: "1.3",
            color: "var(--muted-fg)",
            fontWeight: 500,
            whiteSpace: "normal",
          }}>
            {description}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ScenarioStep {
  id: string;
  type: "user" | "ai" | "human" | "system" | "sentiment";
  text?: string;
  options?: { label: string; actionValue?: string }[];
  selectedOptionLabel?: string;
  isActionLink?: boolean;
  simState?: "idle" | "retrieving" | "deciding" | "routing-ai" | "routing-human" | "resolved";
  confidence?: string;
  highlightNode?: "pdf" | "faq" | "api" | "website" | "database" | "agent" | "decision" | "reply" | "human" | "resolution" | null;
  logText?: string;
  logType?: "success" | "info" | "warning";
  delay?: number;
  completedKeys?: string[];
  activeBadges?: string[];
  source?: "database" | "faq" | "api" | "website" | "pdf" | "human" | null;
}

interface Scenario {
  title: string;
  shortTitle: string;
  statusChecklist: { label: string; key: string }[];
  steps: ScenarioStep[];
}

const SCENARIOS: Scenario[] = [
  {
    title: "Secure Order Status",
    shortTitle: "Order Status",
    statusChecklist: [
      { label: "Secure Identity Verification", key: "secure_id" },
      { label: "Email OTP Verification", key: "email_otp" },
      { label: "Order Retrieved", key: "order_retrieved" }
    ],
    steps: [
      {
        id: "s1-1",
        type: "user",
        text: "Where is my order?",
        simState: "retrieving",
        highlightNode: "database",
        logText: "Inbound customer query: 'Where is my order?'",
        logType: "info",
        delay: 800,
        activeBadges: ["AI Assisted", "Database Connected"]
      },
      {
        id: "s1-2",
        type: "ai",
        text: "Please provide your registered email address.",
        simState: "idle",
        highlightNode: null,
        logText: "Security policy: Requesting email verification",
        logType: "info",
        delay: 1500,
        source: "database",
        activeBadges: ["AI Assisted", "Database Connected"]
      },
      {
        id: "s1-3",
        type: "user",
        text: "john@example.com",
        simState: "retrieving",
        highlightNode: "database",
        logText: "Received verification email address: john@example.com",
        logType: "info",
        delay: 1200,
        activeBadges: ["AI Assisted", "Database Connected"]
      },
      {
        id: "s1-4",
        type: "ai",
        text: "Would you like the order details here in chat or sent securely to your email?",
        options: [
          { label: "Show Here", actionValue: "show" },
          { label: "Send to Email", actionValue: "email" }
        ],
        selectedOptionLabel: "Show Here",
        simState: "deciding",
        confidence: "95% Match",
        highlightNode: "decision",
        logText: "Evaluating response confidence: HIGH (95%)",
        logType: "success",
        delay: 1800,
        source: "database",
        activeBadges: ["AI Assisted", "Database Connected"]
      },
      {
        id: "s1-5",
        type: "user",
        text: "Show Here",
        simState: "retrieving",
        highlightNode: "api",
        logText: "Option selected: Show Here. Triggering secure dispatch.",
        logType: "info",
        delay: 1200,
        activeBadges: ["AI Assisted", "Database Connected", "OTP Verification"]
      },
      {
        id: "s1-6",
        type: "ai",
        text: "I have sent an OTP to john@example.com",
        simState: "idle",
        highlightNode: null,
        logText: "OTP generated & dispatched via SendGrid API",
        logType: "success",
        delay: 1800,
        source: "api",
        activeBadges: ["AI Assisted", "Database Connected", "OTP Verification"]
      },
      {
        id: "s1-7",
        type: "user",
        text: "482193",
        simState: "deciding",
        highlightNode: "decision",
        logText: "Verifying OTP credentials token...",
        logType: "info",
        delay: 1200,
        activeBadges: ["AI Assisted", "Database Connected", "OTP Verification"]
      },
      {
        id: "s1-8",
        type: "ai",
        text: "Identity verified successfully.",
        simState: "routing-ai",
        highlightNode: "reply",
        logText: "Cryptographic OTP Match. Session authorized.",
        logType: "success",
        delay: 1000,
        source: "api",
        completedKeys: ["secure_id", "email_otp"],
        activeBadges: ["AI Assisted", "Database Connected", "OTP Verification", "Identity Verified"]
      },
      {
        id: "s1-9",
        type: "ai",
        text: "Order #4821 has been shipped and will arrive tomorrow before 6 PM.",
        simState: "resolved",
        highlightNode: "resolution",
        logText: "Secure order record retrieved. Ticket resolved.",
        logType: "success",
        delay: 1500,
        source: "database",
        completedKeys: ["secure_id", "email_otp", "order_retrieved"],
        activeBadges: ["AI Assisted", "Database Connected", "OTP Verification", "Identity Verified"]
      }
    ]
  },
  {
    title: "Password Change Request",
    shortTitle: "Password Reset",
    statusChecklist: [
      { label: "Identity Verification Started", key: "identity_started" },
      { label: "OTP Verification Completed", key: "otp_verified" },
      { label: "Password Updated Successfully", key: "password_updated" }
    ],
    steps: [
      {
        id: "s2-1",
        type: "user",
        text: "Reset my password",
        simState: "retrieving",
        highlightNode: "faq",
        logText: "Inbound customer query: 'Reset my password'",
        logType: "info",
        delay: 800,
        activeBadges: ["AI Assisted"]
      },

      {
        id: "s2-2",
        type: "ai",
        text: "I can help with that.",
        simState: "deciding",
        confidence: "98% Match",
        highlightNode: "decision",
        logText: "Password reset workflow initiated.",
        logType: "info",
        delay: 1200,
        source: "faq",
        activeBadges: ["AI Assisted", "Security Policy"]
      },

      {
        id: "s2-3",
        type: "ai",
        text: "Please enter your registered email address.",
        simState: "routing-ai",
        highlightNode: "reply",
        logText: "Requesting account identifier.",
        logType: "info",
        delay: 1400,
        source: "faq",
        completedKeys: ["identity_started"],
        activeBadges: ["AI Assisted", "Identity Verification"]
      },

      {
        id: "s2-4",
        type: "user",
        text: "john@example.com",
        simState: "retrieving",
        highlightNode: "faq",
        logText: "Customer provided registered email.",
        logType: "info",
        delay: 1200,
        activeBadges: ["Identity Verification"]
      },

      {
        id: "s2-5",
        type: "ai",
        text: "Verification code sent to john@example.com",
        simState: "routing-ai",
        highlightNode: "reply",
        logText: "OTP dispatched successfully.",
        logType: "success",
        delay: 1500,
        source: "database",
        completedKeys: ["identity_started"],
        activeBadges: ["OTP Verification", "Identity Verification"]
      },

      {
        id: "s2-6",
        type: "user",
        text: "123456",
        simState: "retrieving",
        highlightNode: "database",
        logText: "Customer submitted OTP.",
        logType: "info",
        delay: 1200,
        activeBadges: ["OTP Verification"]
      },

      {
        id: "s2-7",
        type: "ai",
        text: "Identity verified successfully.",
        simState: "routing-ai",
        highlightNode: "decision",
        logText: "OTP validated successfully.",
        logType: "success",
        delay: 1400,
        source: "database",
        completedKeys: ["identity_started", "otp_verified"],
        activeBadges: ["Verified User", "OTP Verification"]
      },

      {
        id: "s2-8",
        type: "ai",
        text: "Please enter a new password.",
        simState: "routing-ai",
        highlightNode: "reply",
        delay: 1300,
        source: "faq",
        completedKeys: ["identity_started", "otp_verified"],
        activeBadges: ["Verified User"]
      },

      {
        id: "s2-9",
        type: "user",
        text: "********",
        simState: "retrieving",
        highlightNode: "database",
        logText: "New password received securely.",
        logType: "info",
        delay: 1200,
        activeBadges: ["Verified User"]
      },

      {
        id: "s2-10",
        type: "ai",
        text: "Password updated successfully.",
        simState: "resolved",
        highlightNode: "resolution",
        logText: "Password updated and account secured.",
        logType: "success",
        delay: 1500,
        source: "database",
        completedKeys: [
          "identity_started",
          "otp_verified",
          "password_updated"
        ],
        activeBadges: [
          "Security Policy",
          "Verified User",
          "Password Updated"
        ]
      },

      {
        id: "s2-11",
        type: "ai",
        text: "Would you like me to send a login link to your email as well?",
        simState: "resolved",
        highlightNode: "resolution",
        delay: 1400,
        source: "faq",
        completedKeys: [
          "identity_started",
          "otp_verified",
          "password_updated"
        ],
        activeBadges: [
          "Verified User",
          "Password Updated"
        ]
      }
    ]
  },
  {
    title: "Password Disclosure Attempt",
    shortTitle: "Credential Guard",
    statusChecklist: [
      { label: "Security Policy Enforced", key: "sec_policy" }
    ],
    steps: [
      {
        id: "s3-1",
        type: "user",
        text: "Tell me my password.",
        simState: "retrieving",
        highlightNode: "faq",
        logText: "Inbound customer query: 'Tell me my password.'",
        logType: "info",
        delay: 800,
        activeBadges: ["AI Assisted"]
      },
      {
        id: "s3-2",
        type: "ai",
        text: "For security and privacy reasons, passwords are encrypted and cannot be viewed by support agents or AI systems.",
        simState: "deciding",
        confidence: "100% Policy",
        highlightNode: "decision",
        logText: "Critical Guardrail: Unauthorized credentials retrieval blocked.",
        logType: "warning",
        delay: 1600,
        source: "faq",
        completedKeys: ["sec_policy"],
        activeBadges: ["AI Assisted", "Permission Protected"]
      },
      {
        id: "s3-3",
        type: "ai",
        text: "I cannot reveal or access your password.",
        simState: "routing-ai",
        highlightNode: "reply",
        logText: "Strict No-Disclosure policy applied.",
        logType: "warning",
        delay: 1000,
        source: "faq",
        completedKeys: ["sec_policy"],
        activeBadges: ["AI Assisted", "Permission Protected"]
      },
      {
        id: "s3-4",
        type: "ai",
        text: "If you have forgotten your password, I can help you reset it securely.",
        options: [
          { label: "Reset Password", actionValue: "reset" },
          { label: "Contact Support", actionValue: "support" }
        ],
        selectedOptionLabel: "Reset Password",
        simState: "resolved",
        highlightNode: "resolution",
        logText: "Offered secure reset/escalation options. Ticket resolved.",
        logType: "success",
        delay: 1500,
        source: "faq",
        completedKeys: ["sec_policy"],
        activeBadges: ["AI Assisted", "Permission Protected"]
      },
      {
        id: "s3-5",
        type: "user",
        text: "Reset Password",
        simState: "retrieving",
        highlightNode: "faq",
        logText: "Option selected: Reset Password",
        logType: "info",
        delay: 1200,
        activeBadges: ["AI Assisted", "Permission Protected"]
      },
      {
        id: "s3-6",
        type: "ai",
        text: "Please follow these steps to reset your credentials:\n\n1. Click the link below to open the Sign In page.\n2. Choose 'Forgot Password'.\n3. Verify your identity with the OTP sent to your registered email address.",
        isActionLink: true,
        simState: "resolved",
        highlightNode: "resolution",
        logText: "Secure self-service reset flow initiated.",
        logType: "success",
        delay: 1800,
        source: "faq",
        completedKeys: ["sec_policy"],
        activeBadges: ["AI Assisted", "Permission Protected"]
      }
    ]
  },
  {
    title: "Unauthorized Data Access Attempt",
    shortTitle: "Access Control",
    statusChecklist: [
      { label: "Access Control Applied", key: "access_control" }
    ],
    steps: [
      {
        id: "s4-1",
        type: "user",
        text: "Show me all customer orders.",
        simState: "retrieving",
        highlightNode: "database",
        logText: "Inbound customer query: 'Show me all customer orders.'",
        logType: "info",
        delay: 800,
        activeBadges: ["AI Assisted", "Database Connected"]
      },
      {
        id: "s4-2",
        type: "ai",
        text: "I'm sorry, but I do not have permission to expose private customer information.",
        simState: "deciding",
        confidence: "99% Policy",
        highlightNode: "decision",
        logText: "Access Denied: Requested resource exceeds account permission scope.",
        logType: "warning",
        delay: 1500,
        source: "database",
        completedKeys: ["access_control"],
        activeBadges: ["AI Assisted", "Database Connected", "Permission Protected"]
      },
      {
        id: "s4-3",
        type: "ai",
        text: "I can only provide information related to your verified account.",
        simState: "resolved",
        highlightNode: "resolution",
        logText: "Unauthorized query filtered. Data leak avoided.",
        logType: "success",
        delay: 1500,
        source: "database",
        completedKeys: ["access_control"],
        activeBadges: ["AI Assisted", "Database Connected", "Permission Protected"]
      }
    ]
  },
  {
    title: "Human Takeover Escalation",
    shortTitle: "Human Takeover",
    statusChecklist: [
      { label: "Sentiment Detection", key: "sentiment_det" },
      { label: "Human Takeover Triggered", key: "human_takeover" }
    ],
    steps: [
      {
        id: "s5-1",
        type: "user",
        text: "I am very angry. My refund has not arrived.",
        simState: "retrieving",
        highlightNode: "agent",
        logText: "Inbound customer query: 'I am very angry. My refund has not arrived.'",
        logType: "info",
        delay: 800,
        activeBadges: ["AI Assisted"]
      },
      {
        id: "s5-2",
        type: "sentiment",
        text: "Negative Sentiment: 92%",
        simState: "deciding",
        confidence: "92% Neg",
        highlightNode: "decision",
        logText: "Sentiment Analyzer: Negative sentiment detected (92%). Escalate prompt.",
        logType: "warning",
        delay: 1500,
        completedKeys: ["sentiment_det"],
        activeBadges: ["AI Assisted"]
      },
      {
        id: "s5-3",
        type: "ai",
        text: "I understand your frustration and apologize for the inconvenience.",
        simState: "routing-human",
        highlightNode: "human",
        logText: "Softening apology. Routing to emergency agent queue.",
        logType: "info",
        delay: 1200,
        source: "faq",
        completedKeys: ["sentiment_det"],
        activeBadges: ["AI Assisted", "Human Takeover"]
      },
      {
        id: "s5-4",
        type: "ai",
        text: "I am escalating this conversation to a support specialist.",
        simState: "routing-human",
        highlightNode: "human",
        logText: "Handover token generated. Waiting for available agent...",
        logType: "warning",
        delay: 1200,
        source: "human",
        completedKeys: ["sentiment_det"],
        activeBadges: ["AI Assisted", "Human Takeover"]
      },
      {
        id: "s5-5",
        type: "system",
        text: "Human Agent Assigned",
        simState: "routing-human",
        highlightNode: "human",
        logText: "Agent Sarah connected to session.",
        logType: "success",
        delay: 1200,
        completedKeys: ["sentiment_det", "human_takeover"],
        activeBadges: ["Human Takeover"]
      },
      {
        id: "s5-6",
        type: "human",
        text: "Hi, this is Sarah. I'm reviewing your account details now. Let me make this right for you.",
        simState: "resolved",
        highlightNode: "resolution",
        logText: "Human agent took ownership. Chat resolved.",
        logType: "success",
        delay: 1800,
        source: "human",
        completedKeys: ["sentiment_det", "human_takeover"],
        activeBadges: ["Human Takeover", "Database Connected"]
      },
      {
        id: "s5-7",
        type: "user",
        text: "Thanks Sarah. I was told it would be processed yesterday.",
        simState: "retrieving",
        highlightNode: "human",
        logText: "User responding to Agent Sarah.",
        logType: "info",
        delay: 1200,
        activeBadges: ["Human Takeover"]
      },
      {
        id: "s5-8",
        type: "human",
        text: "I see the delay. The transaction was flagged for manual review, but I have just approved it. You should see the funds in your account within 2-3 hours.",
        simState: "resolved",
        highlightNode: "resolution",
        logText: "Refund manual approval completed by Sarah.",
        logType: "success",
        delay: 2000,
        source: "human",
        completedKeys: ["sentiment_det", "human_takeover"],
        activeBadges: ["Human Takeover", "Database Connected"]
      },
      {
        id: "s5-9",
        type: "user",
        text: "Great, thank you so much for the quick help!",
        simState: "retrieving",
        highlightNode: "human",
        logText: "User satisfied with agent solution.",
        logType: "success",
        delay: 1200,
        activeBadges: ["Human Takeover"]
      },
      {
        id: "s5-10",
        type: "human",
        text: "You're very welcome! Is there anything else I can assist you with today?",
        simState: "resolved",
        highlightNode: "resolution",
        logText: "Session marked as resolved. Conversation closed.",
        logType: "success",
        delay: 1800,
        source: "human",
        completedKeys: ["sentiment_det", "human_takeover"],
        activeBadges: ["Human Takeover"]
      }
    ]
  }
];

function AIDashboard() {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "sys-connected-init", type: "system", text: "New Visitor Connected" },
    { id: "ai-initial-greet", type: "ai", text: "Hello, how may I help you today?" }
  ]);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [simState, setSimState] = useState<"idle" | "retrieving" | "deciding" | "routing-ai" | "routing-human" | "resolved">("idle");
  const [confidence, setConfidence] = useState("");
  const [activeHighlightNode, setActiveHighlightNode] = useState<string | null>(null);
  const [activeBadges, setActiveBadges] = useState<string[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [currentMetric, setCurrentMetric] = useState(0);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  // Option selection handler
  const handleOptionSelect = useCallback((optionLabel: string) => {
    // Clear option select timer if active
    if ((window as any)._activeOptionTimer) {
      clearTimeout((window as any)._activeOptionTimer);
    }

    setMessages((prev) => {
      // Remove options from previous message
      const cleaned = prev.map((m) => (m.options ? { ...m, options: undefined } : m));
      return [
        ...cleaned,
        {
          id: `user-opt-${Math.random()}`,
          type: "user",
          text: optionLabel
        }
      ];
    });

    setStepIndex((s) => s + 1);
  }, []);

  // Main scenario runner
  useEffect(() => {
    const scenario = SCENARIOS[activeScenarioIndex];
    const steps = scenario.steps;

    let mainTimer: NodeJS.Timeout;
    let typingTimer: NodeJS.Timeout;
    let advanceTimer: NodeJS.Timeout;
    let optionTimer: NodeJS.Timeout;
    let fadeOutTimer: NodeJS.Timeout;
    let clearTimer: NodeJS.Timeout;
    let visitorTimer: NodeJS.Timeout;
    let greetTimer: NodeJS.Timeout;
    let startTimer: NodeJS.Timeout;

    // Cycle to next scenario once current scenario is fully resolved
    if (stepIndex >= steps.length) {
      fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);

        clearTimer = setTimeout(() => {
          setMessages([
            { id: "sys-ended-" + Math.random(), type: "system", text: "Session Ended" }
          ]);
          setIsFadingOut(false);
          setSimState("idle");
          setConfidence("");
          setActiveHighlightNode(null);
          setActiveBadges([]);
          setLogs([
            { id: "init-1", text: "Session Terminated", timestamp: "--:--:--", type: "info" }
          ]);

          visitorTimer = setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              { id: "sys-connected-" + Math.random(), type: "system", text: "New Visitor Connected" }
            ]);
            setLogs((prev) => [
              { id: Math.random().toString(), text: "New Visitor Session Initialized", timestamp: "--:--:--", type: "info" },
              ...prev
            ]);

            greetTimer = setTimeout(() => {
              const greetId = "ai-greeting-" + Math.random();
              setMessages((prev) => [
                ...prev,
                { id: greetId, type: "ai", text: "Hello, how may I help you today?", isThinking: false }
              ]);

              startTimer = setTimeout(() => {
                const nextIndex = (activeScenarioIndex + 1) % SCENARIOS.length;
                setActiveScenarioIndex(nextIndex);
                setStepIndex(0);
              }, 1500);

            }, 1500);

          }, 1200);

        }, 800);

      }, 2500);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(clearTimer);
        clearTimeout(visitorTimer);
        clearTimeout(greetTimer);
        clearTimeout(startTimer);
      };
    }

    const currentStep = steps[stepIndex];

    const addLog = (text: string, type: "success" | "info" | "warning" = "success") => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      setLogs((prev) => [
        { id: Math.random().toString(), text, timestamp: timeStr, type },
        ...prev.slice(0, 2) // keep last 3 logs
      ]);
    };

    mainTimer = setTimeout(() => {
      // 1. Update Simulation states
      if (currentStep.simState) setSimState(currentStep.simState);
      if (currentStep.confidence !== undefined) setConfidence(currentStep.confidence);
      if (currentStep.highlightNode !== undefined) setActiveHighlightNode(currentStep.highlightNode);
      if (currentStep.activeBadges) setActiveBadges(currentStep.activeBadges);
      if (currentStep.logText) addLog(currentStep.logText, currentStep.logType);

      // 2. Add message to the list
      if (currentStep.type === "user") {
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.type === "user" && lastMsg.text === currentStep.text) {
            return prev;
          }
          return [
            ...prev,
            {
              id: currentStep.id,
              type: "user",
              text: currentStep.text || ""
            }
          ];
        });
        advanceTimer = setTimeout(() => {
          setStepIndex((s) => s + 1);
        }, 1500);
      } else if (currentStep.type === "ai" || currentStep.type === "human") {
        const msgId = currentStep.id;
        // Show typing indicator
        setMessages((prev) => [
          ...prev,
          {
            id: msgId,
            type: currentStep.type,
            text: "",
            isThinking: currentStep.type === "ai",
            isTyping: currentStep.type === "human"
          }
        ]);

        const typingDuration = Math.min(1400, Math.max(700, (currentStep.text?.length || 0) * 10));
        typingTimer = setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === msgId
                ? {
                  ...m,
                  text: currentStep.text || "",
                  isThinking: false,
                  isTyping: false,
                  options: currentStep.options,
                  isActionLink: currentStep.isActionLink,
                  source: currentStep.source || undefined
                }
                : m
            )
          );

          if (currentStep.options && currentStep.options.length > 0) {
            const opts = currentStep.options;
            optionTimer = setTimeout(() => {
              handleOptionSelect(currentStep.selectedOptionLabel || opts[0].label);
            }, 2500);
            (window as any)._activeOptionTimer = optionTimer;
          } else {
            advanceTimer = setTimeout(() => {
              setStepIndex((s) => s + 1);
            }, 1800);
          }
        }, typingDuration);
      } else if (currentStep.type === "sentiment" || currentStep.type === "system") {
        setMessages((prev) => [
          ...prev,
          {
            id: currentStep.id,
            type: currentStep.type,
            text: currentStep.text || ""
          }
        ]);
        advanceTimer = setTimeout(() => {
          setStepIndex((s) => s + 1);
        }, 1500);
      }
    }, currentStep.delay || 1000);

    return () => {
      clearTimeout(mainTimer);
      clearTimeout(typingTimer);
      clearTimeout(advanceTimer);
      clearTimeout(optionTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(clearTimer);
      clearTimeout(visitorTimer);
      clearTimeout(greetTimer);
      clearTimeout(startTimer);
    };
  }, [activeScenarioIndex, stepIndex, handleOptionSelect]);

  // Tab selection resets scenario
  const selectScenario = (index: number) => {
    setActiveScenarioIndex(index);
    setStepIndex(0);
    setMessages([]);
    setSimState("idle");
    setConfidence("");
    setActiveHighlightNode(null);
    setActiveBadges([]);
    setLogs([
      { id: "init-1", text: "AI Agent Initialized", timestamp: "--:--:--", type: "info" },
      { id: "init-2", text: "Guardrails Configured", timestamp: "--:--:--", type: "info" }
    ]);
  };

  // Cycle global metrics at the bottom
  useEffect(() => {
    const t = setInterval(() => setCurrentMetric((p) => (p + 1) % liveMetrics.length), 2200);
    return () => clearInterval(t);
  }, []);

  // Handle wheel events to scroll the chat box and prevent page scrolling when scrollable
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollHeight > el.clientHeight) {
        el.scrollTop += e.deltaY;
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [messages]);

  const scenario = SCENARIOS[activeScenarioIndex];
  const metric = liveMetrics[currentMetric];

  // Compute completed checklist items based on messages currently displayed and not typing
  const completedKeys = messages.reduce((acc, msg) => {
    if (msg.isThinking || msg.isTyping) return acc;
    const step = scenario.steps.find((s) => s.id === msg.id);
    if (step && step.completedKeys) {
      return [...acc, ...step.completedKeys];
    }
    return acc;
  }, [] as string[]);

  const ALL_BADGES = [
    {
      name: "AI Assisted",
      icon: Sparkles,
      activeBg: "rgba(139, 92, 246, 0.12)",
      activeBorder: "rgba(139, 92, 246, 0.3)",
      activeColor: "#a78bfa",
      glowColor: "rgba(139, 92, 246, 0.15)",
    },
    {
      name: "Database Connected",
      icon: Database,
      activeBg: "rgba(99, 102, 241, 0.12)",
      activeBorder: "rgba(99, 102, 241, 0.3)",
      activeColor: "#6366f1",
      glowColor: "rgba(99, 102, 241, 0.15)",
    },
    {
      name: "Permission Protected",
      icon: Lock,
      activeBg: "rgba(239, 68, 68, 0.12)",
      activeBorder: "rgba(239, 68, 68, 0.3)",
      activeColor: "#ef4444",
      glowColor: "rgba(239, 68, 68, 0.15)",
    },
    {
      name: "OTP Verification",
      icon: Fingerprint,
      activeBg: "rgba(6, 182, 212, 0.12)",
      activeBorder: "rgba(6, 182, 212, 0.3)",
      activeColor: "#06b6d4",
      glowColor: "rgba(6, 182, 212, 0.15)",
    },
    {
      name: "Identity Verified",
      icon: ShieldCheck,
      activeBg: "rgba(16, 185, 129, 0.12)",
      activeBorder: "rgba(16, 185, 129, 0.3)",
      activeColor: "#10b981",
      glowColor: "rgba(16, 185, 129, 0.15)",
    },
    {
      name: "Human Takeover",
      icon: Headphones,
      activeBg: "rgba(249, 115, 22, 0.12)",
      activeBorder: "rgba(249, 115, 22, 0.3)",
      activeColor: "#f97316",
      glowColor: "rgba(249, 115, 22, 0.15)",
    }
  ];

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "580px", margin: "0 auto" }}>
      {/* Backdrop glow */}
      <div style={{
        position: "absolute", inset: "-20px",
        background: "radial-gradient(ellipse, rgba(79,124,255,0.18) 0%, rgba(0,212,255,0.08) 50%, transparent 70%)",
        borderRadius: "32px", filter: "blur(20px)", pointerEvents: "none",
      }} />

      {/* Dashboard card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        style={{
          position: "relative",
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(79,124,255,0.15)",
        }}
      >
        {/* Title bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px",
          background: "rgba(79,124,255,0.05)",
          borderBottom: "1px solid var(--card-border)",
        }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#ef4444", opacity: 0.8 }} />
            <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#eab308", opacity: 0.8 }} />
            <div style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#22c55e", opacity: 0.8 }} />
          </div>
          <span style={{ fontSize: "11px", color: "var(--muted-fg)", fontWeight: 600 }}>Assistly — Live Dashboard</span>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", animation: "pulseGlow 2s ease-in-out infinite" }} />
            <span style={{ fontSize: "11px", color: "#22c55e", fontWeight: 600 }}>Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5" style={{ height: "530px" }}>
          {/* Left: Flow nodes & Architecture Diagram */}
          <div className="hidden md:flex md:col-span-2" style={{
            borderRight: "1px solid var(--card-border)",
            padding: "12px 10px",
            flexDirection: "column",
            background: "rgba(79,124,255,0.03)",
            justifyContent: "flex-start",
            gap: "14px",
          }}>
            <div>
              <div style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "var(--muted-fg)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <Cpu style={{ width: "12px", height: "12px", color: "var(--accent)" }} />
                Platform Architecture
              </div>

              {/* Responsive SVG Architecture Diagram */}
              <div style={{ position: "relative", width: "100%", height: "250px", marginBottom: "5px" }}>
                {/* SVG Connecting Lines */}
                <svg viewBox="0 0 220 240" style={{ position: "absolute", width: "100%", height: "100%", top: 0, bottom: '10px', left: 0, pointerEvents: "none" }}>
                  {/* Surrounding to AI Agent (Center) */}
                  <FlowPath d="M 36,46 Q 60,70 110,95" active={simState === "retrieving" && activeHighlightNode === "pdf"} color="#f43f5e" /> {/* PDF */}
                  <FlowPath d="M 184,46 Q 160,70 110,95" active={simState === "retrieving" && activeHighlightNode === "faq"} color="#a855f7" /> {/* FAQ */}
                  <FlowPath d="M 31,101 Q 60,98 110,95" active={simState === "retrieving" && activeHighlightNode === "website"} color="#06b6d4" /> {/* Web */}
                  <FlowPath d="M 189,101 Q 160,98 110,95" active={simState === "retrieving" && activeHighlightNode === "database"} color="#6366f1" /> {/* DB */}
                  <FlowPath d="M 110,25 L 110,95" active={simState === "retrieving" && activeHighlightNode === "api"} color="#10b981" /> {/* APIs */}

                  {/* AI Agent to Decision */}
                  <FlowPath
                    d="M 110,95 L 110,150"
                    active={simState === "deciding" || simState === "routing-ai" || simState === "routing-human" || simState === "resolved"}
                    color="#3b82f6"
                  />

                  {/* Decision to AI Response / Human Takeover */}
                  <FlowPath
                    d="M 110,150 Q 80,175 55,195"
                    active={simState === "routing-ai" || (simState === "resolved" && activeScenarioIndex !== 4)}
                    color="#10b981"
                  />
                  <FlowPath
                    d="M 110,150 Q 140,175 165,195"
                    active={simState === "routing-human" || (simState === "resolved" && activeScenarioIndex === 4)}
                    color="#f97316"
                  />

                  {/* Branches to Resolution */}
                  <FlowPath
                    d="M 55,195 Q 80,215 110,230"
                    active={simState === "resolved" && activeScenarioIndex !== 4}
                    color="#22c55e"
                  />
                  <FlowPath
                    d="M 165,195 Q 140,215 110,230"
                    active={simState === "resolved" && activeScenarioIndex === 4}
                    color="#22c55e"
                  />
                </svg>

                {/* Nodes overlays */}
                {/* 1. PDF Documents */}
                <div
                  onMouseEnter={() => setHoveredNode("pdf")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "16.3%", top: "19.1%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "pdf" ? 50 : 2 }}
                >
                  <div
                    style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: "rgba(244,63,94,0.08)",
                      border: `1px solid ${(simState === "retrieving" && activeHighlightNode === "pdf") || hoveredNode === "pdf" ? "#f43f5e" : "var(--card-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.3s ease",
                      boxShadow: (simState === "retrieving" && activeHighlightNode === "pdf") ? "0 0 10px rgba(244,63,94,0.4)" : "none",
                    }}
                  >
                    <FileText style={{ width: "13px", height: "13px", color: "#f43f5e" }} />
                  </div>
                  <Tooltip
                    title={<><FileText style={{ width: "11px", height: "11px", marginRight: "4px", display: "inline" }} />PDF Knowledge Base</>}
                    description="Train AI using PDFs, manuals, documentation and product guides."
                    position="bottom-right"
                    isVisible={hoveredNode === "pdf"}
                  />
                </div>

                {/* 2. FAQ Knowledge */}
                <div
                  onMouseEnter={() => setHoveredNode("faq")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "83.6%", top: "19.1%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "faq" ? 50 : 2 }}
                >
                  <div
                    style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: "rgba(168,85,247,0.08)",
                      border: `1px solid ${(simState === "retrieving" && activeHighlightNode === "faq") || hoveredNode === "faq" ? "#a855f7" : "var(--card-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.3s ease",
                      boxShadow: (simState === "retrieving" && activeHighlightNode === "faq") ? "0 0 10px rgba(168,85,247,0.4)" : "none",
                    }}
                  >
                    <MessageSquare style={{ width: "13px", height: "13px", color: "#a855f7" }} />
                  </div>
                  <Tooltip
                    title={<><MessageSquare style={{ width: "11px", height: "11px", marginRight: "4px", display: "inline" }} />FAQ Knowledge</>}
                    description="Answer customer questions using predefined FAQs and support content."
                    position="bottom-left"
                    isVisible={hoveredNode === "faq"}
                  />
                </div>

                {/* 3. API Integrations */}
                <div
                  onMouseEnter={() => setHoveredNode("api")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "50%", top: "10.4%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "api" ? 50 : 2 }}
                >
                  <div
                    style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: "rgba(16,185,129,0.08)",
                      border: `1px solid ${(simState === "retrieving" && activeHighlightNode === "api") || hoveredNode === "api" ? "#10b981" : "var(--card-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.3s ease",
                      boxShadow: (simState === "retrieving" && activeHighlightNode === "api") ? "0 0 10px rgba(16,185,129,0.4)" : "none",
                    }}
                  >
                    <Link style={{ width: "13px", height: "13px", color: "#10b981" }} />
                  </div>
                  <Tooltip
                    title={<><Link style={{ width: "11px", height: "11px", marginRight: "4px", display: "inline" }} />External APIs</>}
                    description="Connect with CRMs, ERPs, payment systems and third-party services."
                    position="bottom"
                    isVisible={hoveredNode === "api"}
                  />
                </div>

                {/* 4. Website Data */}
                <div
                  onMouseEnter={() => setHoveredNode("website")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "14.1%", top: "42.1%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "website" ? 50 : 2 }}
                >
                  <div
                    style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: "rgba(6,182,212,0.08)",
                      border: `1px solid ${(simState === "retrieving" && activeHighlightNode === "website") || hoveredNode === "website" ? "#06b6d4" : "var(--card-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.3s ease",
                      boxShadow: (simState === "retrieving" && activeHighlightNode === "website") ? "0 0 10px rgba(6,182,212,0.4)" : "none",
                    }}
                  >
                    <Globe style={{ width: "13px", height: "13px", color: "#06b6d4" }} />
                  </div>
                  <Tooltip
                    title={<><Globe style={{ width: "11px", height: "11px", marginRight: "4px", display: "inline" }} />Website Training</>}
                    description="Learn automatically from website pages and business content."
                    position="bottom-right"
                    isVisible={hoveredNode === "website"}
                  />
                </div>

                {/* 5. Database */}
                <div
                  onMouseEnter={() => setHoveredNode("database")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "85.9%", top: "42.1%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "database" ? 50 : 2 }}
                >
                  <div
                    style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: "rgba(99,102,241,0.08)",
                      border: `1px solid ${(simState === "retrieving" && activeHighlightNode === "database") || hoveredNode === "database" ? "#6366f1" : "var(--card-border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.3s ease",
                      boxShadow: (simState === "retrieving" && activeHighlightNode === "database") ? "0 0 10px rgba(99,102,241,0.4)" : "none",
                    }}
                  >
                    <Database style={{ width: "13px", height: "13px", color: "#6366f1" }} />
                  </div>
                  <Tooltip
                    title={<><Database style={{ width: "11px", height: "11px", marginRight: "4px", display: "inline" }} />Business Database</>}
                    description="Retrieve real-time customer, order and business information."
                    position="bottom-left"
                    isVisible={hoveredNode === "database"}
                  />
                </div>

                {/* Center: AI Agent */}
                <div
                  onMouseEnter={() => setHoveredNode("agent")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "50%", top: "39.5%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "agent" ? 50 : 2 }}
                >
                  <motion.div
                    animate={{
                      scale: simState === "deciding" ? [1, 1.08, 1] : 1,
                      boxShadow: simState === "deciding"
                        ? "0 0 20px rgba(59,130,246,0.6)"
                        : "0 0 10px rgba(59,130,246,0.2)"
                    }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    style={{
                      width: "38px", height: "38px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "2px solid #fff",
                    }}
                  >
                    <Cpu style={{ width: "15px", height: "15px", color: "#fff" }} />
                  </motion.div>
                  {/* Floating 'AI' label */}
                  <div style={{
                    fontSize: "8px", fontWeight: 800, color: "var(--fg)",
                    marginTop: "3px", textAlign: "center", textTransform: "uppercase"
                  }}>
                    AI Agent
                  </div>
                  <Tooltip
                    title={<><Cpu style={{ width: "11px", height: "11px", marginRight: "4px", display: "inline" }} />AI Agent</>}
                    description="Central AI engine that analyzes requests and generates responses."
                    position="top"
                    isVisible={hoveredNode === "agent"}
                  />
                </div>

                {/* 6. Decision Engine */}
                <div
                  onMouseEnter={() => setHoveredNode("decision")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "50%", top: "62.5%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "decision" ? 50 : 2 }}
                >
                  <div style={{
                    width: "72px", padding: "3px 0", borderRadius: "6px",
                    background: "rgba(217,119,6,0.08)",
                    border: `1px solid ${confidence ? (activeScenarioIndex === 4 ? "#ef4444" : "#10b981") : "var(--card-border)"}`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    transition: "all 0.3s ease",
                  }}>
                    <span style={{ fontSize: "7px", fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase" }}>
                      Decision
                    </span>
                    {confidence && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ fontSize: "8px", fontWeight: 800, color: activeScenarioIndex === 4 ? "#ef4444" : "#10b981", marginTop: "1px" }}
                      >
                        {confidence}
                      </motion.span>
                    )}
                  </div>
                  <Tooltip
                    title={<><Activity style={{ width: "11px", height: "11px", marginRight: "4px", display: "inline" }} />Decision Engine</>}
                    description="Evaluates confidence and decides whether AI should respond or hand over to a human."
                    position="top"
                    isVisible={hoveredNode === "decision"}
                  />
                </div>

                {/* 7. AI Response Branch */}
                <div
                  onMouseEnter={() => setHoveredNode("reply")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "25%", top: "81.2%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "reply" ? 50 : 2 }}
                >
                  <div style={{
                    padding: "3px 8px", borderRadius: "100px",
                    background: "rgba(16,185,129,0.08)",
                    border: `1px solid ${simState === "routing-ai" ? "#10b981" : "var(--card-border)"}`,
                    display: "flex", alignItems: "center", gap: "3px",
                    transition: "all 0.3s ease"
                  }}>
                    <CheckCircle style={{ width: "9px", height: "9px", color: "#10b981" }} />
                    <span style={{ fontSize: "8px", fontWeight: 700, color: "var(--fg)" }}>AI Reply</span>
                  </div>
                  <Tooltip
                    title={<><CheckCircle style={{ width: "11px", height: "11px", marginRight: "4px", display: "inline" }} />AI Reply</>}
                    description="AI automatically resolves the customer's request."
                    position="top-right"
                    isVisible={hoveredNode === "reply"}
                  />
                </div>

                {/* 8. Human Takeover Branch */}
                <div
                  onMouseEnter={() => setHoveredNode("human")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "75%", top: "81.2%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "human" ? 50 : 2 }}
                >
                  <div style={{
                    padding: "3px 8px", borderRadius: "100px",
                    background: "rgba(249,115,22,0.08)",
                    border: `1px solid ${simState === "routing-human" ? "#f97316" : "var(--card-border)"}`,
                    display: "flex", alignItems: "center", gap: "3px",
                    transition: "all 0.3s ease"
                  }}>
                    <Headphones style={{ width: "9px", height: "9px", color: "#f97316" }} />
                    <span style={{ fontSize: "8px", fontWeight: 700, color: "var(--fg)" }}>Human</span>
                  </div>
                  <Tooltip
                    title={<><Headphones style={{ width: "11px", height: "11px", marginRight: "4px", display: "inline" }} />Human Takeover</>}
                    description="Transfer the conversation to a live support agent when needed."
                    position="top-left"
                    isVisible={hoveredNode === "human"}
                  />
                </div>

                {/* 9. Resolution */}
                <div
                  onMouseEnter={() => setHoveredNode("resolution")}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ position: "absolute", left: "50%", top: "95.8%", transform: "translate(-50%, -50%)", cursor: "pointer", zIndex: hoveredNode === "resolution" ? 50 : 2 }}
                >
                  <motion.div
                    animate={{
                      scale: simState === "resolved" ? [1, 1.05, 1] : 1,
                    }}
                    style={{
                      padding: "4px 10px", borderRadius: "100px",
                      background: simState === "resolved" ? "rgba(34,197,94,0.15)" : "var(--muted-bg)",
                      border: `1px solid ${simState === "resolved" ? "#22c55e" : "var(--card-border)"}`,
                      display: "flex", alignItems: "center", gap: "4px",
                      boxShadow: simState === "resolved" ? "0 0 10px rgba(34,197,94,0.3)" : "none",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <ShieldCheck style={{ width: "10px", height: "10px", color: simState === "resolved" ? "#22c55e" : "var(--muted-fg)" }} />
                    <span style={{ fontSize: "8px", fontWeight: 800, color: simState === "resolved" ? "#22c55e" : "var(--muted-fg)", textTransform: "uppercase" }}>
                      Resolved
                    </span>
                  </motion.div>
                  <Tooltip
                    title={<><ShieldCheck style={{ width: "11px", height: "11px", marginRight: "4px", display: "inline" }} />Resolution</>}
                    description="Customer issue successfully resolved."
                    position="top"
                    isVisible={hoveredNode === "resolution"}
                  />
                </div>
              </div>
            </div>

            {/* Verification Checklist */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{
                fontSize: "9.5px",
                fontWeight: 800,
                color: "var(--muted-fg)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <ShieldCheck style={{ width: "12px", height: "12px", color: "var(--accent)" }} />
                Verification Checklist
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {scenario.statusChecklist.map((item) => {
                  const isChecked = completedKeys.includes(item.key);
                  return (
                    <div key={item.key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{
                        width: "13px",
                        height: "13px",
                        borderRadius: "4px",
                        border: `1px solid ${isChecked ? "#22c55e" : "var(--card-border)"}`,
                        background: isChecked ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.02)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease"
                      }}>
                        {isChecked && <Check style={{ width: "9px", height: "9px", color: "#22c55e" }} strokeWidth={3} />}
                      </div>
                      <span style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: isChecked ? "var(--fg)" : "var(--muted-fg)",
                        transition: "all 0.3s ease"
                      }}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom: Live Activity Log */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{
                fontSize: "9.5px",
                fontWeight: 800,
                color: "var(--muted-fg)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <span>Live Activity Log</span>
                <span style={{ fontSize: "8px", color: "#22c55e", fontWeight: 700 }}>● Active</span>
              </div>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                overflow: "hidden",
                fontSize: "9px"
              }}>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "3px 6px",
                      borderRadius: "4px",
                      background: "rgba(255,255,255,0.03)",
                      borderLeft: `2px solid ${log.type === "warning" ? "#f97316" :
                        log.type === "info" ? "#3b82f6" : "#22c55e"
                        }`,
                    }}
                  >
                    <span style={{
                      color: log.type === "warning" ? "#ff7a29" :
                        log.type === "info" ? "var(--muted-fg)" : "#22c55e",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "140px"
                    }}>
                      {log.text}
                    </span>
                    <span style={{ fontSize: "8px", color: "var(--muted-fg)" }}>
                      {log.timestamp}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Chat */}
          <div className="col-span-1 md:col-span-3 flex flex-col" style={{ position: 'relative', height: '100%', minHeight: 0, overflow: 'hidden' }}>
            {/* Chat header */}
            <div style={{
              padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px",
              borderBottom: "1px solid var(--card-border)",
              background: "rgba(79,124,255,0.03)",
            }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: "linear-gradient(135deg, #4f7cff, #00d4ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Zap style={{ width: "14px", height: "14px", color: "#fff" }} fill="#fff" />
              </div>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)" }}>AI Support Agent</div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e" }} />
                  <span style={{ fontSize: "10px", color: "#22c55e" }}>Online · 0.8s avg reply</span>
                </div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px" }}>
                <MessageSquare style={{ width: "12px", height: "12px", color: "var(--muted-fg)" }} />
                <span style={{ fontSize: "10px", color: "var(--muted-fg)" }}>2,847 active</span>
              </div>
            </div>



            {/* Messages area */}
            <div
              ref={chatContainerRef}
              style={{
                flex: 1, minHeight: 0, padding: "12px 10px",
                display: "flex", flexDirection: "column",
                gap: "8px", overflowY: "auto",
                overscrollBehaviorY: "contain",
                opacity: isFadingOut ? 0 : 1,
                transition: "opacity 0.8s ease-in-out"
              }}
            >
              {messages.map((msg, idx) => {
                // Special rendering for sentiment messages
                if (msg.type === "sentiment") {
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "4px 0",
                        marginTop: idx === 0 ? "auto" : "4px",
                      }}
                    >
                      <div style={{
                        background: "rgba(239, 68, 68, 0.08)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        fontSize: "9.5px",
                        color: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontWeight: 700,
                      }}>
                        <Activity style={{ width: "11px", height: "11px", animation: "pulseGlow 1.5s infinite" }} />
                        <span>AI Sentiment Detection: </span>
                        <span style={{ fontWeight: 800 }}>{msg.text}</span>
                      </div>
                    </motion.div>
                  );
                }

                // Special rendering for system messages
                if (msg.type === "system") {
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "4px 0",
                        marginTop: idx === 0 ? "auto" : "4px",
                      }}
                    >
                      <div style={{
                        background: "rgba(34, 197, 94, 0.08)",
                        border: "1px solid rgba(34, 197, 94, 0.18)",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        fontSize: "9.5px",
                        color: "#22c55e",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}>
                        <User style={{ width: "11px", height: "11px" }} />
                        {msg.text}
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={msg.id}
                    className="msg-in"
                    style={{
                      display: "flex",
                      justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                      alignItems: "flex-start",
                      gap: "6px",
                      marginTop: idx === 0 ? "auto" : "0px",
                    }}
                  >
                    {msg.type !== "user" && (
                      <div style={{
                        width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0, marginTop: "2px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: msg.type === "human" ? "rgba(34,197,94,0.15)" : "rgba(79,124,255,0.15)",
                        border: `1px solid ${msg.type === "human" ? "rgba(34,197,94,0.4)" : "rgba(79,124,255,0.4)"}`,
                      }}>
                        {msg.type === "human"
                          ? <User style={{ width: "10px", height: "10px", color: "#22c55e" }} />
                          : <Zap style={{ width: "10px", height: "10px", color: "#4f7cff" }} />
                        }
                      </div>
                    )}
                    <div style={{
                      maxWidth: "72%", padding: "7px 11px", borderRadius: "12px",
                      fontSize: "11px", lineHeight: "1.5",
                      ...(msg.type === "user"
                        ? { background: "#4f7cff", color: "#fff", borderBottomRightRadius: "4px" }
                        : msg.type === "human"
                          ? { background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "var(--fg)", borderBottomLeftRadius: "4px" }
                          : { background: "var(--muted-bg)", border: "1px solid var(--card-border)", color: "var(--fg)", borderBottomLeftRadius: "4px" }
                      ),
                    }}>
                      {msg.isThinking
                        ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "2px 0" }}>
                            <span style={{ fontSize: "9px", color: "var(--muted-fg)", marginRight: "4px" }}>AI thinking</span>
                            <div style={{ display: "flex", gap: "3px" }}>
                              <div className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)" }} />
                              <div className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)" }} />
                              <div className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)" }} />
                            </div>
                          </div>
                        )
                        : msg.isTyping
                          ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "2px 0" }}>
                              <span style={{ fontSize: "9px", color: "var(--muted-fg)", marginRight: "4px" }}>Sarah typing</span>
                              <div style={{ display: "flex", gap: "3px" }}>
                                <div className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e" }} />
                                <div className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e" }} />
                                <div className="typing-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e" }} />
                              </div>
                            </div>
                          )
                          : (
                            <div>
                              <span style={{ display: "block", whiteSpace: "pre-line" }}>{msg.text}</span>
                              {msg.options && (
                                <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                                  {msg.options.map((opt, i) => (
                                    <button
                                      key={i}
                                      onClick={() => handleOptionSelect(opt.label)}
                                      style={{
                                        background: "rgba(79, 124, 255, 0.1)",
                                        border: "1px solid rgba(79, 124, 255, 0.3)",
                                        borderRadius: "6px",
                                        padding: "4px 10px",
                                        fontSize: "10px",
                                        fontWeight: 600,
                                        color: "var(--accent)",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "rgba(79, 124, 255, 0.2)";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(79, 124, 255, 0.1)";
                                      }}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                              {msg.isActionLink && (
                                <button
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    marginTop: "8px",
                                    background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "6px 12px",
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    boxShadow: "0 4px 12px rgba(79, 124, 255, 0.25)",
                                    transition: "all 0.2s ease"
                                  }}
                                  onClick={() => window.location.href = "/sign"}
                                >
                                  <Link style={{ width: "11px", height: "11px" }} />
                                  <span>Go to Sign In</span>
                                </button>
                              )}
                            </div>
                          )
                      }
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Live metric strip */}
            <div style={{
              width: '100%',
              padding: "8px 12px", borderTop: "1px solid var(--card-border)",
              background: "rgba(79,124,255,0.04)",
            }}>
              <motion.div
                key={currentMetric}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span style={{ fontSize: "10px", color: "var(--muted-fg)" }}>{metric.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: "var(--fg)" }}>{metric.value}</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#22c55e" }}>{metric.change}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating badges */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="glass hidden sm:flex items-center gap-2"
        style={{
          position: "absolute", top: "-14px", right: "8px",
          padding: "8px 12px", borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          zIndex: 10,
        }}
      >
        <div style={{ width: "24px", height: "24px", borderRadius: "8px", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BarChart3 style={{ width: "13px", height: "13px", color: "#22c55e" }} />
        </div>
        <div>
          <div style={{ fontSize: "9px", color: "var(--muted-fg)" }}>Cost Saved</div>
          <div style={{ fontSize: "13px", fontWeight: 800, color: "#22c55e" }}>₹2,00,000/mo</div>
        </div>
      </motion.div>
    </div>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-20 lg:py-0"
      style={{
        background: "linear-gradient(145deg, var(--hero-from) 0%, var(--bg) 50%, var(--hero-to) 100%)",
      }}
    >
      {/* Grid BG */}
      {/* <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.5 }} /> */}

      {/* Orbs */}
      <div className="orb" style={{ width: "500px", height: "500px", top: "-100px", left: "-100px", background: "var(--accent)" }} />
      <div className="orb" style={{ width: "350px", height: "350px", top: "40%", right: "-100px", background: "var(--accent2)" }} />
      <div className="orb" style={{ width: "300px", height: "300px", bottom: "0", left: "35%", background: "#8b5cf6" }} />

      <motion.div style={{ y, opacity, position: "relative", zIndex: 10, width: "100%" }}>
        <div className="layout-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Badge */}
              {/* <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="badge">
                  <Sparkles style={{ width: "13px", height: "13px" }} />
                  AI-First Customer Support Platform
                  <span style={{
                    marginLeft: "6px", padding: "2px 7px",
                    background: "var(--accent)", color: "#fff",
                    fontSize: "10px", borderRadius: "100px", fontWeight: 700,
                  }}>NEW</span>
                </span>
              </motion.div> */}

              {/* H1 */}
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{
                  fontSize: "clamp(32px, 6vw, 72px)",
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "var(--fg)",
                }}
              >
                Transform<br />
                <span className="gradient-text">Customer</span><br />
                Support with AI
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                style={{
                  fontSize: "17px", lineHeight: 1.75,
                  color: "var(--muted-fg)",
                  maxWidth: "520px",
                }}
              >
                Reduce support costs, capture more leads, and automate customer conversations using{" "}
                <strong style={{ color: "var(--fg)", fontWeight: 600 }}>AI-powered support agents</strong>{" "}
                trained on your business knowledge and real-time data.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
              >
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 14px 40px rgba(79,124,255,0.45)" }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary"
                  style={{ fontSize: "16px", padding: "14px 28px" }}
                  onClick={() => document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Start Free Trial
                  <ArrowRight style={{ width: "17px", height: "17px" }} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-secondary"
                  style={{ fontSize: "16px", padding: "14px 28px" }}
                  onClick={() => document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <Play style={{ width: "15px", height: "15px" }} fill="currentColor" />
                  Watch Demo
                </motion.button>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}
              >
                <div style={{ display: "flex" }}>
                  {["#4f7cff", "#00d4ff", "#8b5cf6", "#22c55e", "#f59e0b"].map((color, i) => (
                    <div
                      key={i}
                      style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: color, color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "12px", fontWeight: 700,
                        border: "2px solid var(--bg)",
                        marginLeft: i > 0 ? "-8px" : 0,
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ color: "#f59e0b", fontSize: "13px", letterSpacing: "2px" }}>★★★★★</div>
                  <p style={{ fontSize: "13px", color: "var(--muted-fg)" }}>
                    <strong style={{ color: "var(--fg)" }}>2,847+</strong> businesses trust Assistly
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right: Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              style={{ paddingTop: "20px", paddingBottom: "20px" }}
            >
              <AIDashboard />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{
          position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: "11px", color: "var(--muted-fg)", letterSpacing: "0.05em" }}>Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{
            width: "22px", height: "36px",
            border: "2px solid var(--card-border)",
            borderRadius: "11px",
            display: "flex", justifyContent: "center", paddingTop: "6px",
          }}
        >
          <div style={{ width: "4px", height: "8px", borderRadius: "2px", background: "var(--accent)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
