"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, FileText, Trash2, RefreshCw, UploadCloud, Plus, HelpCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/Toast";
import { Input, Textarea, Button, ConfirmModal } from "@/components/ui";
import { adminService } from "@/services/admin.service";
import StoredQAList, { FaqItem } from "@/components/StoredQAList";

interface DocumentItem { id: string | number; name?: string; display_name?: string; }

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
  const [uploadErrors, setUploadErrors] = useState<{ file?: string; docName?: string }>({});
  const [faqErrors, setFaqErrors] = useState<{ question?: string; answer?: string }>({});
  const [isSubmittingFaq, setIsSubmittingFaq] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | number | null>(null);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
  });

  const fetchDocuments = async () => {
    try {
      const data = await adminService.getUploadedDocuments();
      setDocuments(Array.isArray(data) ? data : (data.documents || data.data || []));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFaqs = async () => {
    setIsLoadingFaqs(true);
    try {
      const data = await adminService.getFaqs();
      setFaqs(Array.isArray(data) ? data : (data.faqs || data.data || []));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingFaqs(false);
    }
  };

  useEffect(() => { fetchDocuments(); fetchFaqs(); }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tempErrors: typeof uploadErrors = {};
    if (!file) tempErrors.file = "Please select a PDF document.";
    if (!docName.trim()) tempErrors.docName = "Document title is required.";

    if (Object.keys(tempErrors).length > 0) {
      setUploadErrors(tempErrors);
      showToast("error", "Validation Failed", "Please resolve all marked errors.");
      return;
    }

    setUploadErrors({});
    setIsUploading(true);
    const formData = new FormData();
    formData.append("files", file!);
    formData.append("display_names", docName.trim());
    try {
      await adminService.uploadDocuments(formData);
      showToast("success", "Success", "PDF trained successfully!");
      setFile(null); setDocName("");
      setUploadErrors({});
      (e.target as HTMLFormElement).reset();
      fetchDocuments();
    } catch (error: any) {
      const errMsg = error.response?.data?.detail || "Failed to upload document.";
      showToast("error", "Upload Failed", errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAll = () => {
    setConfirmModal({
      isOpen: true,
      title: "Wipe Knowledge Base",
      message: "Are you sure you want to delete all trained knowledge vectors? This action cannot be undone.",
      confirmText: "Wipe Workspace",
      onConfirm: async () => {
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
      },
    });
  };

  const handleDeleteDoc = (docId: string | number) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Document Vector",
      message: "Are you sure you want to delete this document from the agent's knowledge memory?",
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          await adminService.deleteDocument(docId);
          showToast("success", "Deleted", "Document deleted.");
          fetchDocuments();
        } catch {
          showToast("error", "Error", "Error deleting document.");
        }
      },
    });
  };

  const handleFAQSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tempErrors: typeof faqErrors = {};
    if (!faqQuestion.trim()) tempErrors.question = "User Question is required.";
    if (!faqAnswer.trim()) tempErrors.answer = "Target Agent Response is required.";

    if (Object.keys(tempErrors).length > 0) {
      setFaqErrors(tempErrors);
      showToast("error", "Validation Failed", "Please resolve all marked errors.");
      return;
    }

    setFaqErrors({});
    setIsSubmittingFaq(true);
    try {
      if (editingFaqId) {
        await adminService.updateFaq(editingFaqId, faqQuestion.trim(), faqAnswer.trim());
        showToast("success", "FAQ Updated", "FAQ updated successfully!");
        setEditingFaqId(null);
      } else {
        await adminService.addFaq(faqQuestion.trim(), faqAnswer.trim());
        showToast("success", "FAQ Saved", "FAQ saved successfully!");
      }
      setFaqQuestion(""); setFaqAnswer("");
      setFaqErrors({});
      fetchFaqs();
    } catch {
      showToast("error", "Failed", "Failed to process FAQ.");
    } finally {
      setIsSubmittingFaq(false);
    }
  };

  const handleDeleteFAQ = (faqId: string | number) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete FAQ Template",
      message: "Are you sure you want to delete this FAQ template? The agent will no longer respond with this vector.",
      confirmText: "Delete",
      onConfirm: async () => {
        try {
          await adminService.deleteFaq(faqId);
          showToast("success", "Deleted", "FAQ deleted.");
          if (editingFaqId === faqId) {
            setEditingFaqId(null);
            setFaqQuestion("");
            setFaqAnswer("");
          }
          fetchFaqs();
        } catch {
          showToast("error", "Error", "Error deleting FAQ.");
        }
      },
    });
  };

  const handleEditFAQ = (faq: FaqItem) => {
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
    setEditingFaqId(faq.id);
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
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", alignItems: "flex-start" }}>
        <span className="badge" style={{ width: "fit-content" }}>
          <h2 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1.2 }}>
            Knowledge <span className="gradient-text">Base</span>
          </h2>
        </span>

      </div>

      {/* Main Grid Wrapper */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <style>{`@media (min-width: 1024px) { .knowledge-grid { grid-template-columns: 1fr 380px !important; } }`}</style>
        <div className="knowledge-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>

          {/* Upload + Document List Card */}
          <div className="card" style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "28px" }}>
            {cardSection(<UploadCloud style={{ width: "20px", height: "20px" }} />, "Upload PDF Manuals", "Upload business handbooks, pricing guides, or service docs.")}

            <form onSubmit={handleUpload} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                {/* File Input */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-fg)" }}>Select PDF Document</label>
                  <div style={{
                    padding: "12px 16px", background: "var(--card-bg)",
                    border: uploadErrors.file ? "1.5px solid #ef4444" : "1px dashed var(--card-border)",
                    borderRadius: "12px", cursor: "pointer", transition: "all 0.15s",
                  }}>
                    <input
                      type="file" accept="application/pdf"
                      onChange={e => {
                        setFile(e.target.files ? e.target.files[0] : null);
                        if (uploadErrors.file) setUploadErrors(prev => ({ ...prev, file: "" }));
                      }}
                      style={{ width: "100%", fontSize: "12px", color: "var(--muted-fg)", cursor: "pointer" }}
                    />
                  </div>
                  {uploadErrors.file && (
                    <span style={{ fontSize: "12px", fontWeight: 500, color: "#ef4444", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <AlertCircle style={{ width: "13px", height: "13px" }} />
                      {uploadErrors.file}
                    </span>
                  )}
                </div>
                <Input
                  label="Document Identifier / Title"
                  type="text"
                  value={docName}
                  onChange={e => {
                    setDocName(e.target.value);
                    if (uploadErrors.docName) setUploadErrors(prev => ({ ...prev, docName: "" }));
                  }}
                  placeholder="e.g. Q3 Pricing Guide"
                  error={uploadErrors.docName}
                />
              </div>
              <div>
                <Button type="submit" isLoading={isUploading} icon={<Plus style={{ width: "15px", height: "15px" }} />}
                  style={{ padding: "10px 20px", fontSize: "13px" } as React.CSSProperties}>
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
                  style={{ fontSize: "10px", padding: "10px 14px" } as React.CSSProperties}>
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

            </div>
          </div>

          {/* Manage Training FAQs Card */}
          <div className="card" style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "24px" }}>
            {cardSection(<HelpCircle style={{ width: "20px", height: "20px" }} />, "Manage Training FAQs", "Train specific QA templates directly.", "#10b981", "rgba(16,185,129,0.1)", "rgba(16,185,129,0.15)")}

            <form onSubmit={handleFAQSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "20px", background: "var(--muted-bg)", borderRadius: "14px", border: "1px solid var(--card-border)" }}>
              <Input
                label="User Question Template"
                type="text"
                value={faqQuestion}
                onChange={e => {
                  setFaqQuestion(e.target.value);
                  if (faqErrors.question) setFaqErrors(prev => ({ ...prev, question: "" }));
                }}
                placeholder="e.g. Do you offer refunds?"
                error={faqErrors.question}
              />
              <Textarea
                label="Target Agent Response"
                rows={3}
                value={faqAnswer}
                onChange={e => {
                  setFaqAnswer(e.target.value);
                  if (faqErrors.answer) setFaqErrors(prev => ({ ...prev, answer: "" }));
                }}
                placeholder="e.g. Yes! We have a 14-day refund policy."
                error={faqErrors.answer}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                {editingFaqId && (
                  <Button type="button" variant="outline" onClick={() => { setEditingFaqId(null); setFaqQuestion(""); setFaqAnswer(""); setFaqErrors({}); }} style={{ flex: 1, padding: "10px", fontSize: "12px" } as React.CSSProperties}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" isLoading={isSubmittingFaq} style={{ flex: 1, padding: "10px", fontSize: "12px", background: editingFaqId ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "linear-gradient(135deg, #10b981, #059669)" } as React.CSSProperties}>
                  {editingFaqId ? "Update QA Vector" : "Add QA Vector"}
                </Button>
              </div>
            </form>
          </div>

        </div>

        {/* Stored Q&A Records Card */}
        <StoredQAList
          faqs={faqs}
          isLoading={isLoadingFaqs}
          onEdit={handleEditFAQ}
          onDelete={handleDeleteFAQ}
          onRefresh={fetchFaqs}
        />
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
      />
    </div>
  );
}
