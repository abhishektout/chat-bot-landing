"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, FileText, Trash2, RefreshCw, UploadCloud, Plus, HelpCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Input, Textarea, Button } from "@/components/ui";
import { adminService } from "@/services/admin.service";

interface DocumentItem { id: string | number; name?: string; display_name?: string; }
interface FaqItem { id: string | number; question: string; answer: string; }

export default function KnowledgeBasePage() {
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [docName, setDocName] = useState("");
  const [faqQuestion, setFaqQuestion] = useState("");
  const [faqAnswer, setFaqAnswer] = useState("");
  const [isSubmittingFaq, setIsSubmittingFaq] = useState(false);

  const fetchDocuments = async () => {
    try {
      const data = await adminService.getUploadedDocuments();
      setDocuments(data.documents || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFaqs = async () => {
    try {
      const data = await adminService.getFaqs();
      setFaqs(data.faqs || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchDocuments(); fetchFaqs(); }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !docName.trim()) { showToast("error", "Error", "File and Document Name are required."); return; }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("files", file);
    formData.append("display_names", docName.trim());
    try {
      await adminService.uploadDocuments(formData);
      showToast("success", "Success", "PDF trained successfully!");
      setFile(null); setDocName("");
      (e.target as HTMLFormElement).reset();
      fetchDocuments();
    } catch (error: any) {
      const errMsg = error.response?.data?.detail || "Failed to upload document.";
      showToast("error", "Upload Failed", errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Delete all trained knowledge? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await adminService.deleteVectors();
      showToast("success", "Deleted", "All knowledge deleted successfully.");
      fetchDocuments();
    } catch {
      showToast("error", "Delete Failed", "Failed to delete knowledge.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteDoc = async (docId: string | number) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await adminService.deleteDocument(docId);
      showToast("success", "Deleted", "Document deleted.");
      fetchDocuments();
    } catch {
      showToast("error", "Error", "Error deleting document.");
    }
  };

  const handleFAQSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;
    setIsSubmittingFaq(true);
    try {
      await adminService.addFaq(faqQuestion.trim(), faqAnswer.trim());
      showToast("success", "FAQ Saved", "FAQ saved successfully!");
      setFaqQuestion(""); setFaqAnswer("");
      fetchFaqs();
    } catch {
      showToast("error", "Failed", "Failed to save FAQ.");
    } finally {
      setIsSubmittingFaq(false);
    }
  };

  const handleDeleteFAQ = async (faqId: string | number) => {
    if (!window.confirm("Delete this FAQ?")) return;
    try {
      await adminService.deleteFaq(faqId);
      showToast("success", "Deleted", "FAQ deleted.");
      fetchFaqs();
    } catch {
      showToast("error", "Error", "Error deleting FAQ.");
    }
  };

  const cardSection = (icon: React.ReactNode, title: string, desc: string, color = "var(--accent)", bg = "var(--accent-glow)", border = "rgba(79,124,255,0.15)") => (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px", paddingBottom: "18px", borderBottom: "1px solid var(--card-border)" }}>
      <div style={{ padding: "10px", borderRadius: "12px", background: bg, border: `1px solid ${border}`, color, display: "flex" }}>{icon}</div>
      <div>
        <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--fg)", marginBottom: "2px" }}>{title}</h3>
        <p style={{ fontSize: "12px", color: "var(--muted-fg)", fontWeight: 500 }}>{desc}</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span className="badge"><BookOpen style={{ width: "12px", height: "12px" }} />Intelligence Center</span>
        <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1.2 }}>
          Knowledge <span className="gradient-text">Base</span>
        </h2>
        <p style={{ fontSize: "14px", color: "var(--muted-fg)", fontWeight: 500, lineHeight: 1.6 }}>
          Train your AI agent with business manuals and custom FAQs to respond to customers accurately.
        </p>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        <style>{`@media (min-width: 1024px) { .knowledge-grid { grid-template-columns: 1fr 380px !important; } }`}</style>
        <div className="knowledge-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>

          {/* Upload + Document List Card */}
          <div className="card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "28px" }}>
            {cardSection(<UploadCloud style={{ width: "20px", height: "20px" }} />, "Upload PDF Manuals", "Upload business handbooks, pricing guides, or service docs.")}

            <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                {/* File Input */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-fg)" }}>Select PDF Document</label>
                  <div style={{
                    padding: "12px 16px", background: "var(--card-bg)", border: "1px dashed var(--card-border)",
                    borderRadius: "12px", cursor: "pointer", transition: "border-color 0.15s",
                  }}>
                    <input
                      type="file" accept="application/pdf"
                      onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                      required
                      style={{ width: "100%", fontSize: "12px", color: "var(--muted-fg)", cursor: "pointer" }}
                    />
                  </div>
                </div>
                <Input label="Document Identifier / Title" type="text" value={docName} onChange={e => setDocName(e.target.value)} placeholder="e.g. Q3 Pricing Guide" required />
              </div>
              <div>
                <Button type="submit" isLoading={isUploading} icon={<Plus style={{ width: "15px", height: "15px" }} />}
                  style={{ padding: "12px 24px", fontSize: "13px" } as React.CSSProperties}>
                  Train Model Vector
                </Button>
              </div>
            </form>

            {/* Trained Documents List */}
            <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h4 style={{ fontSize: "12px", fontWeight: 800, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Trained Vector Corpus ({documents.length})
                </h4>
                <Button variant="outline" size="sm" onClick={fetchDocuments} icon={<RefreshCw style={{ width: "12px", height: "12px" }} />}
                  style={{ fontSize: "10px", padding: "7px 14px" } as React.CSSProperties}>
                  Refresh
                </Button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "240px", overflowY: "auto", padding: "4px" }}>
                {documents.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 16px", fontSize: "12px", color: "var(--muted-fg)", fontStyle: "italic", border: "1px dashed var(--card-border)", borderRadius: "12px" }}>
                    No vectors loaded. Upload a PDF above to begin.
                  </div>
                ) : (
                  documents.map((doc, idx) => (
                    <div key={idx} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "var(--muted-bg)", padding: "12px 16px", borderRadius: "12px",
                      border: "1px solid var(--card-border)",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                        <FileText style={{ width: "16px", height: "16px", color: "var(--accent)", flexShrink: 0 }} />
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {doc.name || doc.display_name || String(doc)}
                        </span>
                      </div>
                      <button type="button" onClick={() => handleDeleteDoc(doc.id || String(doc))}
                        style={{ padding: "7px", borderRadius: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", cursor: "pointer", display: "flex", flexShrink: 0 }}>
                        <Trash2 style={{ width: "13px", height: "13px" }} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {documents.length > 0 && (
                <button type="button" disabled={isDeleting} onClick={handleDeleteAll}
                  style={{
                    marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "8px",
                    padding: "9px 18px", borderRadius: "10px", fontSize: "12px", fontWeight: 700,
                    color: "#ef4444", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
                    cursor: "pointer", transition: "all 0.15s",
                  }}>
                  <AlertTriangle style={{ width: "13px", height: "13px" }} />
                  {isDeleting ? "Wiping Database..." : "Clear Workspace Knowledge"}
                </button>
              )}
            </div>
          </div>

          {/* FAQs Card */}
          <div className="card" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "24px" }}>
            {cardSection(<HelpCircle style={{ width: "20px", height: "20px" }} />, "Manage Training FAQs", "Train specific QA templates directly.", "#10b981", "rgba(16,185,129,0.1)", "rgba(16,185,129,0.15)")}

            <form onSubmit={handleFAQSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "20px", background: "var(--muted-bg)", borderRadius: "14px", border: "1px solid var(--card-border)" }}>
              <Input label="User Question Template" type="text" value={faqQuestion} onChange={e => setFaqQuestion(e.target.value)} placeholder="e.g. Do you offer refunds?" required />
              <Textarea label="Target Agent Response" rows={3} value={faqAnswer} onChange={e => setFaqAnswer(e.target.value)} placeholder="e.g. Yes! We have a 14-day refund policy." required />
              <Button type="submit" isLoading={isSubmittingFaq} style={{ width: "100%", padding: "11px", fontSize: "12px", background: "linear-gradient(135deg, #10b981, #059669)" } as React.CSSProperties}>
                Add QA Vector
              </Button>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h4 style={{ fontSize: "11px", fontWeight: 800, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Active FAQ Prompts ({faqs.length})
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "320px", overflowY: "auto" }}>
                {faqs.length === 0 ? (
                  <div style={{ padding: "24px", border: "1px dashed var(--card-border)", borderRadius: "12px", textAlign: "center", fontSize: "12px", color: "var(--muted-fg)", fontStyle: "italic" }}>
                    No FAQs registered yet.
                  </div>
                ) : (
                  faqs.map((faq, idx) => (
                    <div key={idx} style={{ background: "var(--card-bg)", padding: "14px 16px", border: "1px solid var(--card-border)", borderRadius: "12px", position: "relative" }}>
                      <button type="button" onClick={() => handleDeleteFAQ(faq.id)}
                        style={{ position: "absolute", top: "12px", right: "12px", padding: "6px", borderRadius: "7px", color: "var(--muted-fg)", background: "transparent", border: "none", cursor: "pointer", display: "flex", transition: "all 0.15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-fg)"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                        <Trash2 style={{ width: "13px", height: "13px" }} />
                      </button>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)", paddingRight: "28px", marginBottom: "4px" }}>Q: {faq.question}</div>
                      <div style={{ fontSize: "11.5px", color: "var(--muted-fg)", fontWeight: 500, paddingRight: "28px", lineHeight: 1.6 }}>A: {faq.answer}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
