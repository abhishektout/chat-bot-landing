"use client";

import React, { useState, useEffect, useRef } from "react";
import { Trash2, Pencil, RefreshCw, HelpCircle, Clock } from "lucide-react";
import { Button } from "./ui";

export interface FaqItem {
  id: string | number;
  question: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
}

interface StoredQAListProps {
  faqs: FaqItem[];
  isLoading: boolean;
  onEdit: (faq: FaqItem) => void;
  onDelete: (faqId: string | number) => void;
  onRefresh: () => void;
}

function FAQAnswer({ answer }: { answer: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(answer.length > 150);

  useEffect(() => {
    const el = textRef.current;
    if (el && !isExpanded) {
      setHasMore(el.scrollHeight > el.clientHeight);
    }
  }, [answer, isExpanded]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      <div
        ref={textRef}
        style={{
          fontSize: "12px",
          color: "var(--muted-fg)",
          fontWeight: 500,
          lineHeight: 1.6,
          wordBreak: "break-word",
          display: !isExpanded ? "-webkit-box" : "block",
          WebkitLineClamp: !isExpanded ? 3 : undefined,
          WebkitBoxOrient: !isExpanded ? "vertical" : undefined,
          overflow: !isExpanded ? "hidden" : undefined,
        }}
      >
        A: {answer}
      </div>
      {(hasMore || isExpanded) && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          style={{
            background: "none",
            border: "none",
            color: "var(--accent)",
            fontSize: "11px",
            fontWeight: 700,
            cursor: "pointer",
            padding: "2px 0 0 0",
            marginTop: "2px",
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
}

export default function StoredQAList({
  faqs,
  isLoading,
  onEdit,
  onDelete,
  onRefresh,
}: StoredQAListProps) {
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return null;
    }
  };

  const cardSectionHeader = (
    icon: React.ReactNode,
    title: string,
    desc: string,
    color = "#10b981",
    bg = "rgba(16,185,129,0.1)",
    border = "rgba(16,185,129,0.15)"
  ) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "24px",
        paddingBottom: "18px",
        borderBottom: "1px solid var(--card-border)",
      }}
    >
      <div
        style={{
          padding: "10px",
          borderRadius: "12px",
          background: bg,
          border: `1px solid ${border}`,
          color,
          display: "flex",
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 800,
              color: "var(--fg)",
              margin: 0,
            }}
          >
            {title}
          </h3>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              background: "var(--accent-glow)",
              color: "var(--accent)",
              padding: "2px 8px",
              borderRadius: "20px",
              border: "1px solid rgba(79,124,255,0.15)",
            }}
          >
            {faqs.length} Records
          </span>
        </div>
        <p
          style={{
            fontSize: "12px",
            color: "var(--muted-fg)",
            fontWeight: 500,
            margin: "2px 0 0 0",
          }}
        >
          {desc}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        icon={<RefreshCw style={{ width: "12px", height: "12px" }} />}
        style={{ fontSize: "10px", padding: "10px 14px" } as React.CSSProperties}
      >
        Refresh
      </Button>
    </div>
  );

  return (
    <div
      className="card"
      style={{
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      {cardSectionHeader(
        <HelpCircle style={{ width: "20px", height: "20px" }} />,
        "Stored Q&A Records",
        "Trained templates active inside your agent's knowledge memory."
      )}

      <div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        style={{
          maxHeight: "480px",
          overflowY: "auto",
          padding: "4px",
        }}
      >
        {isLoading ? (
          <div
            className="col-span-full"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 16px",
              gap: "12px",
            }}
          >
            <div
              className="w-8 h-8 rounded-full border-3 border-[var(--accent-glow)] border-t-[var(--accent)] animate-spin"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "3px solid var(--accent-glow)",
                borderTopColor: "var(--accent)",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--muted-fg)",
              }}
            >
              Loading Q&A Records...
            </span>
          </div>
        ) : faqs.length === 0 ? (
          <div
            className="col-span-full"
            style={{
              padding: "36px 20px",
              border: "1px dashed var(--card-border)",
              borderRadius: "14px",
              textAlign: "center",
              background: "rgba(255,255,255,0.01)",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--fg)",
                marginBottom: "4px",
                margin: "0 0 4px 0",
              }}
            >
              No Q&A vectors added yet
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "var(--muted-fg)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Create your first Q&A entry to train the knowledge base.
            </p>
          </div>
        ) : (
          faqs.map((faq) => {
            const created = formatDate(faq.created_at);
            const updated = formatDate(faq.updated_at);
            
            return (
              <div
                key={faq.id}
                style={{
                  background: "var(--muted-bg)",
                  padding: "16px",
                  border: "1px solid var(--card-border)",
                  borderRadius: "14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                  height: "100%",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(79,124,255,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--card-border)";
                }}
              >
                {/* Content Area */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "6px",
                    flex: 1,
                    minWidth: 0,
                    height: "100%",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 850,
                        color: "var(--fg)",
                        lineHeight: 1.4,
                        wordBreak: "break-word",
                      }}
                    >
                      Q: {faq.question}
                    </div>
                    <FAQAnswer answer={faq.answer} />
                  </div>

                  {/* Audit Timestamps */}
                  {(created || updated) && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "12px",
                        marginTop: "8px",
                        fontSize: "9.5px",
                        color: "var(--muted-fg)",
                        fontWeight: 600,
                      }}
                    >
                      {created && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Clock style={{ width: "10px", height: "10px" }} />
                          <span>Created: {created}</span>
                        </div>
                      )}
                      {updated && updated !== created && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Clock style={{ width: "10px", height: "10px" }} />
                          <span>Updated: {updated}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions Area */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexShrink: 0,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => onEdit(faq)}
                    style={{
                      padding: "8px",
                      borderRadius: "10px",
                      background: "var(--accent-glow)",
                      border: "1px solid rgba(79,124,255,0.15)",
                      color: "var(--accent)",
                      cursor: "pointer",
                      display: "flex",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--accent)";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--accent-glow)";
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    title="Edit entry"
                  >
                    <Pencil style={{ width: "13px", height: "13px" }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(faq.id)}
                    style={{
                      padding: "8px",
                      borderRadius: "10px",
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.15)",
                      color: "#ef4444",
                      cursor: "pointer",
                      display: "flex",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ef4444";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                      e.currentTarget.style.color = "#ef4444";
                    }}
                    title="Delete entry"
                  >
                    <Trash2 style={{ width: "13px", height: "13px" }} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
