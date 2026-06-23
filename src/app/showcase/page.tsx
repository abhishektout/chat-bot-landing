"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Play, Pause, RotateCcw, ChevronRight, MessageSquare, 
  BarChart2, Users, Target, Shield, Layers, HelpCircle, 
  ArrowRight, Sparkles, Zap, Award, Activity 
} from "lucide-react";

interface Scene {
  id: number;
  title: string;
  subtitle: string;
  duration: number; // in ms
}

const SCENES: Scene[] = [
  { id: 1, title: "Next-Gen AI Platform", subtitle: "Introducing Assistly Autopilot", duration: 7000 },
  { id: 2, title: "AI Chat Assistant", subtitle: "Real-time conversational streaming", duration: 8000 },
  { id: 3, title: "Live Analytics Dashboard", subtitle: "Real-time metrics and telemetry", duration: 8000 },
  { id: 4, title: "Lead Qualification", subtitle: "Automated intent classification", duration: 7500 },
  { id: 5, title: "Team Collaboration", subtitle: "Seamless human agent handover", duration: 7500 },
  { id: 6, title: "Enterprise Workspaces", subtitle: "Multi-tenant configuration", duration: 7000 },
  { id: 7, title: "Promotional Launch", subtitle: "Maximize efficiency & conversion", duration: 8000 },
];

export default function ShowcasePage() {
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const timerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedBeforePauseRef = useRef<number>(0);

  // Chat Simulation State (Scene 2)
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "ai"; text: string; time?: string }>>([]);
  const [chatStep, setChatStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Lead Capture State (Scene 4)
  const [leadEmail, setLeadEmail] = useState("");
  const [leadStage, setLeadStage] = useState<"input" | "submitting" | "qualified">("input");

  // Reset helper states when switching scenes
  useEffect(() => {
    if (currentScene === 2) {
      setChatMessages([]);
      setChatStep(0);
      setIsTyping(false);
    } else if (currentScene === 4) {
      setLeadEmail("");
      setLeadStage("input");
    }
  }, [currentScene]);

  // Chat Scene Simulation Loop
  useEffect(() => {
    if (currentScene !== 2) return;

    const chatScript = [
      { delay: 800, sender: "user" as const, text: "Hi, can you explain the enterprise pricing plans?" },
      { delay: 1800, type: "typing", text: "Analyzing query..." },
      {
        delay: 3500,
        sender: "ai" as const,
        text: "Sure! Assistly Enterprise features flat-rate multi-tenant environments, custom SLA agreements, dedicated support agents, and advanced LLM orchestrators. Would you like to schedule an overview demo?"
      }
    ];

    if (chatStep < chatScript.length) {
      const step = chatScript[chatStep];
      const timer = setTimeout(() => {
        if (step.type === "typing") {
          setIsTyping(true);
          setChatStep(prev => prev + 1);
        } else {
          setIsTyping(false);
          setChatMessages(prev => [...prev, { sender: step.sender!, text: step.text }]);
          setChatStep(prev => prev + 1);
        }
      }, step.delay);
      return () => clearTimeout(timer);
    }
  }, [currentScene, chatStep]);

  // Lead capture simulation Loop
  useEffect(() => {
    if (currentScene !== 4) return;
    const emailInputTimer = setTimeout(() => {
      setLeadEmail("founder@acme-corp.com");
    }, 1200);

    const submitTimer = setTimeout(() => {
      setLeadStage("submitting");
    }, 3200);

    const qualifiedTimer = setTimeout(() => {
      setLeadStage("qualified");
    }, 4800);

    return () => {
      clearTimeout(emailInputTimer);
      clearTimeout(submitTimer);
      clearTimeout(qualifiedTimer);
    };
  }, [currentScene]);

  // Scene transition timeline orchestrator
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const activeScene = SCENES.find((s) => s.id === currentScene) || SCENES[0];
    const totalDuration = activeScene.duration;
    const startTime = Date.now() - elapsedBeforePauseRef.current;
    startTimeRef.current = startTime;

    // Timer to trigger next scene
    timerRef.current = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        elapsedBeforePauseRef.current = 0;
        setCurrentScene((prev) => (prev === SCENES.length ? 1 : prev + 1));
        setProgress(0);
      }, 200);
    }, totalDuration - elapsedBeforePauseRef.current);

    // Progress bar tick interval (100ms)
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(pct);
    }, 100);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentScene, isPlaying]);

  const selectScene = (sceneId: number) => {
    elapsedBeforePauseRef.current = 0;
    setCurrentScene(sceneId);
    setProgress(0);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      // Pause: capture elapsed time
      const elapsed = Date.now() - startTimeRef.current;
      elapsedBeforePauseRef.current = elapsed;
      setIsPlaying(false);
    } else {
      // Play: resume with remaining duration
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    elapsedBeforePauseRef.current = 0;
    setProgress(0);
    setIsPlaying(true);
    setCurrentScene(1);
  };

  return (
    <div style={styles.pageContainer}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        
        body {
          margin: 0;
          background-color: #0b0f19;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #f3f4f6;
          overflow-x: hidden;
        }

        /* Ambient Glow Animations */
        @keyframes orbit {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -60px) scale(1.2); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes orbit-alt {
          0% { transform: translate(0, 0) scale(1.2); }
          50% { transform: translate(-50px, 40px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1.2); }
        }

        /* Pulse and Float animation */
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        /* Draw SVG Path */
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }

        /* Fade/Zoom in for Scene Elements */
        @keyframes sceneEnter {
          from { opacity: 0; transform: scale(0.97); filter: blur(5px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }

        .scene-container {
          animation: sceneEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .gradient-text {
          background: linear-gradient(135deg, #60a5fa 0%, #c084fc 50%, #f472b6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass-card {
          background: rgba(17, 25, 40, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }

        .glow-blue {
          box-shadow: 0 0 40px rgba(59, 130, 246, 0.15);
        }

        .glow-purple {
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.15);
        }
      `}</style>

      {/* Decorative Blur Backgrounds */}
      <div style={styles.ambientBlob1} />
      <div style={styles.ambientBlob2} />

      {/* Showcase Wrapper */}
      <div style={styles.showcaseWrapper}>
        
        {/* Top Header */}
        <div style={styles.header}>
          <div style={styles.logoGroup}>
            <div style={styles.logoIcon}>
              <Sparkles style={{ width: "16px", height: "16px", color: "#fff" }} />
            </div>
            <div>
              <h1 style={styles.logoTitle}>Assistly <span style={{ color: "#3b82f6" }}>AI</span></h1>
              <p style={styles.logoSubtitle}>Product Showcase 2026</p>
            </div>
          </div>

          <div style={styles.sceneTitleGroup}>
            <span style={styles.sceneCounter}>SCENE {currentScene} OF {SCENES.length}</span>
            <h2 style={styles.sceneSubtitle}>{SCENES[currentScene - 1].subtitle}</h2>
          </div>
        </div>

        {/* 16:9 Video Canvas Container */}
        <div className="glass-card" style={styles.videoCanvas}>
          
          {/* SCENE 1: HERO PLATFORM INTRO */}
          {currentScene === 1 && (
            <div className="scene-container" style={styles.sceneWrapper}>
              <div style={styles.heroContent}>
                <div style={styles.badgeContainer}>
                  <Zap style={{ width: "12px", height: "12px", color: "#60a5fa" }} />
                  <span>ASSISTLY AUTOPILOT LAUNCH</span>
                </div>
                <h2 style={styles.heroTitle} className="gradient-text">
                  The Future of Customer Support is Fully Autonomous
                </h2>
                <p style={styles.heroParagraph}>
                  Deflect up to 85% of recurring tickets, capture inbound business leads, 
                  and automate workspaces using contextual AI models trained on your data.
                </p>

                <div style={styles.heroActionGroup}>
                  <div style={styles.primaryBtn}>
                    <span>Deploy Workspace</span>
                    <ArrowRight style={{ width: "16px", height: "16px" }} />
                  </div>
                  <div style={styles.secondaryBtn}>
                    <span>Read Docs</span>
                  </div>
                </div>
              </div>

              {/* Graphical Floating Mockup */}
              <div style={styles.heroGraphic}>
                <div className="glass-card" style={{ ...styles.floatingCard, animation: "float 4s ease-in-out infinite" }}>
                  <div style={styles.cardHeader}>
                    <div style={styles.cardDotGreen} />
                    <span style={styles.cardHeaderTitle}>Live AI Conversation</span>
                  </div>
                  <div style={styles.cardBody}>
                    <div style={styles.mockMsgUser}>Is my workspace ready?</div>
                    <div style={styles.mockMsgBot}>Yes! Workspace active.</div>
                  </div>
                </div>

                <div className="glass-card" style={{ ...styles.floatingCardSub, animation: "float 5s ease-in-out infinite alternate" }}>
                  <Activity style={{ width: "18px", height: "18px", color: "#a78bfa", marginBottom: "6px" }} />
                  <span style={styles.floatingMetricVal}>84.2%</span>
                  <span style={styles.floatingMetricLabel}>Deflection Rate</span>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 2: AI CHAT ASSISTANT */}
          {currentScene === 2 && (
            <div className="scene-container" style={styles.sceneWrapper}>
              <div style={styles.sceneSplitLeft}>
                <div style={styles.iconTag}><MessageSquare style={{ color: "#3b82f6" }} /></div>
                <h3 style={styles.featureTitle}>Contextual AI Chat Agent</h3>
                <p style={styles.featureDesc}>
                  Engage customers with lightning-fast, streaming message replies. 
                  Leverages vector-based knowledge databases to formulate accurate, multi-turn responses.
                </p>
                <div style={styles.bulletList}>
                  <div style={styles.bulletItem}><ChevronRight style={styles.bulletChevron} /> AI-to-Human Live Takeover</div>
                  <div style={styles.bulletItem}><ChevronRight style={styles.bulletChevron} /> Dynamic streaming chunks</div>
                  <div style={styles.bulletItem}><ChevronRight style={styles.bulletChevron} /> Text-to-speech audio reader</div>
                </div>
              </div>

              <div style={styles.sceneSplitRight}>
                {/* Chat window mockup */}
                <div className="glass-card glow-blue" style={styles.chatMockupWindow}>
                  <div style={styles.chatMockHeader}>
                    <div style={styles.chatMockHeaderLeft}>
                      <div style={styles.avatarBlob}>AI</div>
                      <div>
                        <span style={styles.chatMockName}>Assistly Copilot</span>
                        <div style={styles.chatStatusDot}><span style={styles.pulseDot} /><span>Streaming Response</span></div>
                      </div>
                    </div>
                  </div>

                  <div style={styles.chatMockBody}>
                    {chatMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        style={msg.sender === "user" ? styles.chatBubbleUser : styles.chatBubbleBot}
                      >
                        {msg.text}
                      </div>
                    ))}

                    {isTyping && (
                      <div style={styles.chatTypingBubble}>
                        <div style={styles.typingDots}>
                          <span style={styles.typingDot} />
                          <span style={styles.typingDot} />
                          <span style={styles.typingDot} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={styles.chatMockInputArea}>
                    <div style={styles.chatMockInput}>Ask a question...</div>
                    <div style={styles.chatMockSendBtn}>
                      <ArrowRight style={{ width: "14px", height: "14px", color: "#fff" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 3: ANALYTICS DASHBOARD */}
          {currentScene === 3 && (
            <div className="scene-container" style={styles.sceneWrapper}>
              <div style={styles.sceneFull}>
                <div style={styles.centerHeading}>
                  <div style={styles.iconTag}><BarChart2 style={{ color: "#a78bfa" }} /></div>
                  <h3 style={styles.featureTitle}>Performance Telemetry</h3>
                  <p style={styles.featureDesc}>
                    Gain insights with granular metrics measuring ticket volumes, active support agents, and AI resolution rates.
                  </p>
                </div>

                <div style={styles.analyticsMetricsRow}>
                  <div className="glass-card" style={styles.metricGridCard}>
                    <span style={styles.metricGridLabel}>Active Sessions</span>
                    <span style={styles.metricGridVal}>2,840</span>
                    <span style={styles.metricTrendUp}>+12.4% this week</span>
                  </div>
                  <div className="glass-card" style={styles.metricGridCard}>
                    <span style={styles.metricGridLabel}>Response Time</span>
                    <span style={styles.metricGridVal}>&lt; 1.2s</span>
                    <span style={styles.metricTrendUp}>-0.8s reduction</span>
                  </div>
                  <div className="glass-card" style={styles.metricGridCard}>
                    <span style={styles.metricGridLabel}>Customer CSAT</span>
                    <span style={styles.metricGridVal}>98.4%</span>
                    <span style={styles.metricTrendUp}>Highest rating month</span>
                  </div>
                </div>

                {/* SVG Live Chart Illustration */}
                <div className="glass-card" style={styles.svgChartContainer}>
                  <svg viewBox="0 0 500 120" style={styles.svgChart}>
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid Lines */}
                    <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.05)" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.05)" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.05)" />
                    
                    {/* Shaded Area */}
                    <path 
                      d="M0,120 L0,80 L80,50 L160,90 L240,30 L320,70 L400,20 L480,60 L500,60 L500,120 Z" 
                      fill="url(#chartGrad)" 
                    />

                    {/* Chart Line */}
                    <path 
                      d="M0,80 L80,50 L160,90 L240,30 L320,70 L400,20 L480,60 L500,60" 
                      fill="none" 
                      stroke="#60a5fa" 
                      strokeWidth="3" 
                      strokeDasharray="600"
                      strokeDashoffset="600"
                      style={{ animation: "draw 3.5s ease-out forwards" }}
                    />
                    
                    {/* Plot Points */}
                    <circle cx="80" cy="50" r="4" fill="#a78bfa" />
                    <circle cx="240" cy="30" r="4" fill="#a78bfa" />
                    <circle cx="400" cy="20" r="4" fill="#a78bfa" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 4: LEAD QUALIFICATION */}
          {currentScene === 4 && (
            <div className="scene-container" style={styles.sceneWrapper}>
              <div style={styles.sceneSplitLeft}>
                <div style={styles.iconTag}><Target style={{ color: "#10b981" }} /></div>
                <h3 style={styles.featureTitle}>Lead Capture & Qualification</h3>
                <p style={styles.featureDesc}>
                  Engage web visitors, collect business context, and qualify opportunities. 
                  Sync captured metadata directly to your HubSpot or Salesforce instances.
                </p>
                <div style={styles.bulletList}>
                  <div style={styles.bulletItem}><ChevronRight style={styles.bulletChevron} /> AI-driven qualification prompts</div>
                  <div style={styles.bulletItem}><ChevronRight style={styles.bulletChevron} /> Structured lead sync hooks</div>
                  <div style={styles.bulletItem}><ChevronRight style={styles.bulletChevron} /> High conversion landing overlays</div>
                </div>
              </div>

              <div style={styles.sceneSplitRight}>
                {/* Lead Form simulation */}
                <div className="glass-card glow-purple" style={styles.leadFormMock}>
                  <div style={styles.leadHeader}>
                    <Sparkles style={{ width: "16px", height: "16px", color: "#10b981" }} />
                    <span style={styles.leadHeaderTitle}>Assistly Lead Gen</span>
                  </div>

                  {leadStage === "input" && (
                    <div style={styles.leadFormBody}>
                      <span style={styles.leadLabel}>Enter Work Email</span>
                      <input 
                        type="text" 
                        value={leadEmail}
                        readOnly
                        placeholder="yourname@company.com" 
                        style={styles.leadInput}
                      />
                      <div style={styles.leadSubmitBtn}>Submit Business Query</div>
                    </div>
                  )}

                  {leadStage === "submitting" && (
                    <div style={styles.leadLoadingBody}>
                      <div style={styles.spinner} />
                      <span style={styles.leadLoadingText}>Running lead intelligence model...</span>
                    </div>
                  )}

                  {leadStage === "qualified" && (
                    <div style={styles.leadSuccessBody}>
                      <div style={styles.successIcon}>✓</div>
                      <span style={styles.leadSuccessHeading}>Lead Qualified!</span>
                      <div style={styles.qualificationTag}>Enterprise Opportunity</div>
                      <p style={styles.leadSuccessDesc}>
                        Acme Corp (500+ employees, SaaS niche) synced to Salesforce.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SCENE 5: TEAM COLLABORATION */}
          {currentScene === 5 && (
            <div className="scene-container" style={styles.sceneWrapper}>
              <div style={styles.sceneSplitLeft}>
                <div style={styles.iconTag}><Users style={{ color: "#3b82f6" }} /></div>
                <h3 style={styles.featureTitle}>Unified Agent Workspace</h3>
                <p style={styles.featureDesc}>
                  Allows human customer support agents to seamlessly takeover streams from the AI Copilot. 
                  View online status, audit chat logs, and resume AI control anytime.
                </p>
                <div style={styles.bulletList}>
                  <div style={styles.bulletItem}><ChevronRight style={styles.bulletChevron} /> Instant manual takeover triggers</div>
                  <div style={styles.bulletItem}><ChevronRight style={styles.bulletChevron} /> Dynamic status boards</div>
                  <div style={styles.bulletItem}><ChevronRight style={styles.bulletChevron} /> Context-aware chat handoff</div>
                </div>
              </div>

              <div style={styles.sceneSplitRight}>
                {/* Agent collaboration workspace mockup */}
                <div className="glass-card" style={styles.agentMockWindow}>
                  <div style={styles.agentHeader}>
                    <span>Active Support Agents</span>
                    <span style={styles.agentHeaderCount}>4 Online</span>
                  </div>

                  <div style={styles.agentList}>
                    <div style={styles.agentRow}>
                      <div style={styles.agentAvatar}>JD</div>
                      <div style={{ flex: 1 }}>
                        <span style={styles.agentName}>John Doe (You)</span>
                        <div style={styles.agentRole}>Human Agent &bull; Active</div>
                      </div>
                      <div style={styles.takeoverBtnActive}>Control Claimed</div>
                    </div>

                    <div style={styles.agentRow}>
                      <div style={styles.agentAvatarPurple}>AI</div>
                      <div style={{ flex: 1 }}>
                        <span style={styles.agentName}>Assistly Bot</span>
                        <div style={styles.agentRole}>AI Copilot &bull; Running</div>
                      </div>
                      <div style={styles.takeoverBtnInactive}>Take Over</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 6: ENTERPRISE WORKSPACES */}
          {currentScene === 6 && (
            <div className="scene-container" style={styles.sceneWrapper}>
              <div style={styles.sceneSplitLeft}>
                <div style={styles.iconTag}><Layers style={{ color: "#a78bfa" }} /></div>
                <h3 style={styles.featureTitle}>Multi-Tenant Configuration</h3>
                <p style={styles.featureDesc}>
                  Configure and isolate customer support databases, APIs, widget keys, 
                  and assistant parameters across unique product tenants and sub-brands.
                </p>
                <div style={styles.bulletList}>
                  <div style={styles.bulletItem}><ChevronRight style={styles.bulletChevron} /> Tenant database isolation</div>
                  <div style={styles.bulletItem}><ChevronRight style={styles.bulletChevron} /> Brand-specific custom styling</div>
                  <div style={styles.bulletItem}><ChevronRight style={styles.bulletChevron} /> API route segmentation</div>
                </div>
              </div>

              <div style={styles.sceneSplitRight}>
                {/* Visual grid of tenants */}
                <div style={styles.tenantGrid}>
                  <div className="glass-card" style={styles.tenantCard}>
                    <div style={styles.tenantCardHeader}>
                      <span style={styles.tenantBadgeBlue}>Workspace A</span>
                      <span style={styles.tenantStatus}>Active</span>
                    </div>
                    <span style={styles.tenantDomain}>support.tenant-a.com</span>
                  </div>

                  <div className="glass-card" style={styles.tenantCard}>
                    <div style={styles.tenantCardHeader}>
                      <span style={styles.tenantBadgePurple}>Workspace B</span>
                      <span style={styles.tenantStatus}>Active</span>
                    </div>
                    <span style={styles.tenantDomain}>support.tenant-b.com</span>
                  </div>

                  <div className="glass-card" style={styles.tenantCard}>
                    <div style={styles.tenantCardHeader}>
                      <span style={styles.tenantBadgeGray}>Workspace C</span>
                      <span style={styles.tenantStatus}>Standby</span>
                    </div>
                    <span style={styles.tenantDomain}>support.tenant-c.com</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 7: CTA LAUNCH */}
          {currentScene === 7 && (
            <div className="scene-container" style={styles.sceneWrapper}>
              <div style={styles.ctaContent}>
                <Award style={{ width: "36px", height: "36px", color: "#f472b6", marginBottom: "16px" }} />
                <h2 style={styles.ctaTitle} className="gradient-text">
                  Deploy Intelligent Customer Autopilots Today
                </h2>
                <p style={styles.ctaParagraph}>
                  Integrate the lightweight widget overlay on your landing pages 
                  and experience immediate improvements in ticket deflection, conversion, and CSAT scores.
                </p>

                <div style={styles.statsCtaRow}>
                  <div style={styles.ctaStatItem}>
                    <span style={styles.ctaStatVal}>-75%</span>
                    <span style={styles.ctaStatLabel}>Support Costs</span>
                  </div>
                  <div style={styles.ctaStatItem}>
                    <span style={styles.ctaStatVal}>10x</span>
                    <span style={styles.ctaStatLabel}>Resolution Speed</span>
                  </div>
                  <div style={styles.ctaStatItem}>
                    <span style={styles.ctaStatVal}>98%</span>
                    <span style={styles.ctaStatLabel}>Customer CSAT</span>
                  </div>
                </div>

                <div style={styles.heroActionGroup}>
                  <div style={styles.primaryBtn}>
                    <span>Create Free Account</span>
                    <ArrowRight style={{ width: "16px", height: "16px" }} />
                  </div>
                  <div style={styles.secondaryBtn}>
                    <span>Schedule Strategy Call</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Video Timeline controls */}
        <div className="glass-card" style={styles.controlBar}>
          <div style={styles.playControls}>
            <button onClick={handlePlayPause} style={styles.controlBtn}>
              {isPlaying ? <Pause style={styles.btnIcon} /> : <Play style={styles.btnIcon} />}
            </button>
            <button onClick={handleRestart} style={styles.controlBtn} title="Restart presentation">
              <RotateCcw style={styles.btnIcon} />
            </button>
          </div>

          {/* Timeline progress line */}
          <div style={styles.timelineWrapper}>
            <div style={{ ...styles.timelineProgress, width: `${progress}%` }} />
          </div>

          <div style={styles.timeLabel}>
            {isPlaying ? "LIVE PLAYBACK" : "PAUSED"}
          </div>
        </div>

        {/* Scene navigation tabs */}
        <div style={styles.sceneTabs}>
          {SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => selectScene(scene.id)}
              style={currentScene === scene.id ? styles.activeSceneTab : styles.inactiveSceneTab}
            >
              <span style={styles.sceneTabNum}>0{scene.id}</span>
              <span style={styles.sceneTabName}>{scene.title}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#070b13",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
  },
  ambientBlob1: {
    position: "absolute",
    top: "10%",
    left: "15%",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(59,130,246,0) 70%)",
    filter: "blur(60px)",
    pointerEvents: "none",
    zIndex: 1,
    animation: "orbit 20s linear infinite",
  },
  ambientBlob2: {
    position: "absolute",
    bottom: "10%",
    right: "15%",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(139,92,246,0) 70%)",
    filter: "blur(60px)",
    pointerEvents: "none",
    zIndex: 1,
    animation: "orbit-alt 25s linear infinite",
  },
  showcaseWrapper: {
    width: "100%",
    maxWidth: "960px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    zIndex: 10,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 8px",
  },
  logoGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
  },
  logoTitle: {
    fontSize: "18px",
    fontWeight: 800,
    margin: 0,
    letterSpacing: "-0.02em",
  },
  logoSubtitle: {
    fontSize: "10px",
    color: "#9ca3af",
    margin: 0,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  sceneTitleGroup: {
    textAlign: "right",
  },
  sceneCounter: {
    fontSize: "10px",
    color: "#60a5fa",
    fontWeight: 700,
    letterSpacing: "0.15em",
  },
  sceneSubtitle: {
    fontSize: "15px",
    fontWeight: 700,
    margin: "2px 0 0 0",
    color: "#f3f4f6",
  },
  videoCanvas: {
    aspectRatio: "16/9",
    width: "100%",
    borderRadius: "16px",
    overflow: "hidden",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sceneWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    padding: "40px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
  },
  sceneFull: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  heroContent: {
    maxWidth: "520px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  badgeContainer: {
    alignSelf: "flex-start",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(59, 130, 246, 0.15)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    padding: "6px 12px",
    borderRadius: "9999px",
    fontSize: "10px",
    fontWeight: 700,
    color: "#60a5fa",
    letterSpacing: "0.05em",
  },
  heroTitle: {
    fontSize: "30px",
    fontWeight: 800,
    lineHeight: 1.25,
    letterSpacing: "-0.02em",
    margin: 0,
  },
  heroParagraph: {
    fontSize: "13px",
    color: "#9ca3af",
    lineHeight: 1.6,
    margin: 0,
  },
  heroActionGroup: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "10px",
    fontSize: "12.5px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(59, 130, 246, 0.2)",
  },
  secondaryBtn: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#f3f4f6",
    padding: "10px 18px",
    borderRadius: "10px",
    fontSize: "12.5px",
    fontWeight: 600,
    cursor: "pointer",
  },
  heroGraphic: {
    position: "relative",
    width: "300px",
    height: "240px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingCard: {
    position: "absolute",
    width: "230px",
    top: "30px",
    left: "10px",
    borderRadius: "12px",
    padding: "12px",
    zIndex: 5,
  },
  floatingCardSub: {
    position: "absolute",
    width: "140px",
    bottom: "20px",
    right: "10px",
    borderRadius: "12px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    zIndex: 6,
  },
  floatingMetricVal: {
    fontSize: "24px",
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.1,
  },
  floatingMetricLabel: {
    fontSize: "10px",
    color: "#9ca3af",
    marginTop: "2px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    paddingBottom: "8px",
    marginBottom: "8px",
  },
  cardDotGreen: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
  },
  cardHeaderTitle: {
    fontSize: "10px",
    fontWeight: 600,
    color: "#9ca3af",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  mockMsgUser: {
    alignSelf: "flex-end",
    background: "#3b82f6",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "8px 8px 2px 8px",
    fontSize: "9.5px",
    maxWidth: "85%",
  },
  mockMsgBot: {
    alignSelf: "flex-start",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#f3f4f6",
    padding: "6px 10px",
    borderRadius: "8px 8px 8px 2px",
    fontSize: "9.5px",
    maxWidth: "85%",
  },
  sceneSplitLeft: {
    flex: 1.1,
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  sceneSplitRight: {
    flex: 0.9,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  iconTag: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
  },
  featureTitle: {
    fontSize: "22px",
    fontWeight: 800,
    margin: 0,
    color: "#fff",
    letterSpacing: "-0.01em",
  },
  featureDesc: {
    fontSize: "12.5px",
    color: "#9ca3af",
    lineHeight: 1.6,
    margin: 0,
  },
  bulletList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "4px",
  },
  bulletItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#e5e7eb",
  },
  bulletChevron: {
    width: "14px",
    height: "14px",
    color: "#60a5fa",
  },
  chatMockupWindow: {
    width: "280px",
    height: "260px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  chatMockHeader: {
    padding: "10px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.02)",
  },
  chatMockHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatarBlob: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    color: "#fff",
    fontSize: "9px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chatMockName: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#fff",
  },
  chatMockBody: {
    flex: 1,
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto",
  },
  chatBubbleUser: {
    alignSelf: "flex-end",
    background: "#3b82f6",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "12px 12px 2px 12px",
    fontSize: "10.5px",
    lineHeight: 1.4,
    maxWidth: "85%",
    boxShadow: "0 2px 6px rgba(59, 130, 246, 0.15)",
  },
  chatBubbleBot: {
    alignSelf: "flex-start",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    color: "#e5e7eb",
    padding: "8px 12px",
    borderRadius: "12px 12px 12px 2px",
    fontSize: "10.5px",
    lineHeight: 1.4,
    maxWidth: "85%",
  },
  chatTypingBubble: {
    alignSelf: "flex-start",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "8px 12px",
    borderRadius: "12px 12px 12px 2px",
  },
  typingDots: {
    display: "flex",
    gap: "3px",
    alignItems: "center",
  },
  typingDot: {
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    backgroundColor: "#9ca3af",
  },
  chatMockInputArea: {
    padding: "8px 10px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.01)",
  },
  chatMockInput: {
    fontSize: "10px",
    color: "#4b5563",
    fontWeight: 500,
  },
  chatMockSendBtn: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  centerHeading: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  },
  analyticsMetricsRow: {
    display: "flex",
    gap: "16px",
    width: "100%",
    maxWidth: "760px",
    justifyContent: "center",
  },
  metricGridCard: {
    flex: 1,
    padding: "16px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  metricGridLabel: {
    fontSize: "10px",
    fontWeight: 700,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  metricGridVal: {
    fontSize: "24px",
    fontWeight: 800,
    color: "#fff",
  },
  metricTrendUp: {
    fontSize: "9px",
    color: "#10b981",
    fontWeight: 600,
  },
  svgChartContainer: {
    width: "100%",
    maxWidth: "760px",
    marginTop: "16px",
    borderRadius: "12px",
    padding: "12px",
  },
  svgChart: {
    width: "100%",
    height: "100px",
  },
  leadFormMock: {
    width: "280px",
    borderRadius: "14px",
    overflow: "hidden",
  },
  leadHeader: {
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,0.02)",
  },
  leadHeaderTitle: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#fff",
  },
  leadFormBody: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  leadLabel: {
    fontSize: "9.5px",
    fontWeight: 700,
    color: "#9ca3af",
    textTransform: "uppercase",
  },
  leadInput: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    fontSize: "11.5px",
    color: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },
  leadSubmitBtn: {
    background: "#10b981",
    color: "#fff",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "11.5px",
    fontWeight: 700,
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)",
    marginTop: "4px",
  },
  leadLoadingBody: {
    padding: "36px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  spinner: {
    width: "24px",
    height: "24px",
    border: "2px solid rgba(255,255,255,0.1)",
    borderTopColor: "#10b981",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  leadLoadingText: {
    fontSize: "10.5px",
    color: "#9ca3af",
  },
  leadSuccessBody: {
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  successIcon: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    color: "#10b981",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
    marginBottom: "10px",
  },
  leadSuccessHeading: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#fff",
  },
  qualificationTag: {
    fontSize: "9px",
    fontWeight: 700,
    color: "#10b981",
    background: "rgba(16, 185, 129, 0.15)",
    padding: "3px 8px",
    borderRadius: "4px",
    marginTop: "6px",
    marginBottom: "8px",
  },
  leadSuccessDesc: {
    fontSize: "10.5px",
    color: "#9ca3af",
    margin: 0,
    lineHeight: 1.4,
  },
  agentMockWindow: {
    width: "280px",
    borderRadius: "14px",
    overflow: "hidden",
  },
  agentHeader: {
    padding: "12px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "11px",
    fontWeight: 700,
    color: "#fff",
    background: "rgba(255,255,255,0.01)",
  },
  agentHeaderCount: {
    color: "#10b981",
  },
  agentList: {
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  agentRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.04)",
  },
  agentAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontSize: "10px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  agentAvatarPurple: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "#8b5cf6",
    color: "#fff",
    fontSize: "10px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  agentName: {
    fontSize: "10.5px",
    fontWeight: 700,
    color: "#fff",
    display: "block",
  },
  agentRole: {
    fontSize: "9px",
    color: "#9ca3af",
    marginTop: "1px",
  },
  takeoverBtnActive: {
    padding: "4px 8px",
    borderRadius: "6px",
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    color: "#60a5fa",
    fontSize: "8.5px",
    fontWeight: 700,
  },
  takeoverBtnInactive: {
    padding: "4px 8px",
    borderRadius: "6px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#e5e7eb",
    fontSize: "8.5px",
    fontWeight: 700,
    cursor: "pointer",
  },
  tenantGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "260px",
  },
  tenantCard: {
    padding: "12px 14px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  tenantCardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tenantBadgeBlue: {
    fontSize: "9px",
    fontWeight: 700,
    color: "#3b82f6",
    background: "rgba(59, 130, 246, 0.12)",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  tenantBadgePurple: {
    fontSize: "9px",
    fontWeight: 700,
    color: "#a78bfa",
    background: "rgba(167, 139, 250, 0.12)",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  tenantBadgeGray: {
    fontSize: "9px",
    fontWeight: 700,
    color: "#9ca3af",
    background: "rgba(255,255,255,0.06)",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  tenantStatus: {
    fontSize: "8.5px",
    color: "#10b981",
    fontWeight: 600,
  },
  tenantDomain: {
    fontSize: "10.5px",
    color: "#6b7280",
    fontFamily: "monospace",
  },
  ctaContent: {
    maxWidth: "640px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  ctaTitle: {
    fontSize: "26px",
    fontWeight: 800,
    lineHeight: 1.25,
    margin: 0,
  },
  ctaParagraph: {
    fontSize: "13px",
    color: "#9ca3af",
    lineHeight: 1.65,
    margin: 0,
  },
  statsCtaRow: {
    display: "flex",
    gap: "36px",
    margin: "12px 0 16px 0",
  },
  ctaStatItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  ctaStatVal: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.1,
  },
  ctaStatLabel: {
    fontSize: "10px",
    color: "#9ca3af",
    marginTop: "2px",
    textTransform: "uppercase",
    fontWeight: 700,
    letterSpacing: "0.05em",
  },
  controlBar: {
    padding: "10px 16px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  playControls: {
    display: "flex",
    gap: "8px",
  },
  controlBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  btnIcon: {
    width: "12px",
    height: "12px",
  },
  timelineWrapper: {
    flex: 1,
    height: "4px",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: "9999px",
    position: "relative",
    overflow: "hidden",
  },
  timelineProgress: {
    height: "100%",
    background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
    borderRadius: "9999px",
    transition: "width 0.1s linear",
  },
  timeLabel: {
    fontSize: "9px",
    color: "#6b7280",
    fontWeight: 700,
    letterSpacing: "0.1em",
  },
  sceneTabs: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
    width: "100%",
  },
  activeSceneTab: {
    background: "rgba(59, 130, 246, 0.12)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    padding: "10px 6px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  inactiveSceneTab: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    padding: "10px 6px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  sceneTabNum: {
    fontSize: "9px",
    fontWeight: 800,
    color: "#60a5fa",
  },
  sceneTabName: {
    fontSize: "10px",
    color: "#9ca3af",
    fontWeight: 600,
    textAlign: "center",
    marginTop: "2px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
  },
};
const chatMockHeaderLeftStyle = { display: "flex", alignItems: "center", gap: "10px" };
const chatStatusDotStyle = { display: "flex", alignItems: "center", gap: "4px", fontSize: "9px", color: "#10b981", fontWeight: 600, marginTop: "1px" };
