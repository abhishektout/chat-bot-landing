"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, Calendar, MessageSquare, Building2, ChevronDown } from "lucide-react";
import SubpageLayout from "@/components/layouts/SubpageLayout";
import Link from "next/link";
import { useToast } from "@/components/Toast";

const BENEFITS = [
  "Live walkthrough tailored to your industry",
  "See real data from your own website",
  "Ask questions directly to our engineers",
  "No sales pressure — just a real demo",
];

const SLOTS = [
  "11:00 AM IST",
  "12:00 PM IST",
  "01:00 PM IST",
  "02:00 PM IST",
  "03:00 PM IST",
  "04:00 PM IST",
  "05:00 PM IST",
  "06:00 PM IST",
  "07:00 PM IST",
  "08:00 PM IST",
];

const INDUSTRIES_LIST = [
  "E-Commerce",
  "Healthcare",
  "SaaS",
  "Finance",
  "Insurance",
  "Education",
  "Travel",
  "Enterprise / Other",
];

function parseSlotToTime(slot: string): { hour: number; minute: number } {
  const match = slot.match(/^(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return { hour: 0, minute: 0 };
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && hour < 12) {
    hour += 12;
  } else if (ampm === "AM" && hour === 12) {
    hour = 0;
  }
  return { hour, minute };
}

function isSlotValid(dateString: string, slot: string): boolean {
  if (!dateString || !slot) return true;
  const selectedDate = new Date(dateString);
  const today = new Date();

  // If the selected date is in the future (not today), slot is valid
  const isSelectedToday =
    selectedDate.getFullYear() === today.getFullYear() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getDate() === today.getDate();

  if (!isSelectedToday) {
    return true;
  }

  // If selected date is today, check if slot is at least 2 hours in the future
  const { hour, minute } = parseSlotToTime(slot);
  const slotTime = new Date(today);
  slotTime.setHours(hour, minute, 0, 0);

  const minAllowedTime = new Date();
  minAllowedTime.setHours(minAllowedTime.getHours() + 2);

  return slotTime >= minAllowedTime;
}

interface FormFields {
  name: string;
  email: string;
  company: string;
  industry: string;
  date: string;
  slot: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  industry?: string;
  date?: string;
  slot?: string;
}

export default function BookDemoPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState<FormFields>({
    name: "",
    email: "",
    company: "",
    industry: "",
    date: "",
    slot: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isOpenSlotDropdown, setIsOpenSlotDropdown] = useState(false);
  const [isOpenIndustryDropdown, setIsOpenIndustryDropdown] = useState(false);

  const slotDropdownRef = useRef<HTMLDivElement>(null);
  const industryDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (slotDropdownRef.current && !slotDropdownRef.current.contains(target)) {
        setIsOpenSlotDropdown(false);
      }
      if (industryDropdownRef.current && !industryDropdownRef.current.contains(target)) {
        setIsOpenIndustryDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live validator on change
  function validateField(field: keyof FormFields, value: string) {
    let errMessage = "";
    if (field === "name") {
      if (!value.trim()) errMessage = "Name is required.";
      else if (value.trim().length < 2) errMessage = "Name must be at least 2 characters.";
    }
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) errMessage = "Work email is required.";
      else if (!emailRegex.test(value)) errMessage = "Please enter a valid work email.";
    }
    if (field === "company") {
      if (!value.trim()) errMessage = "Company name is required.";
    }
    if (field === "industry") {
      if (!value) errMessage = "Please select an industry.";
    }
    if (field === "date") {
      if (!value) errMessage = "Please pick a date for the demo.";
      else {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);

        if (selectedDate < today) {
          errMessage = "Date cannot be in the past.";
        } else if (selectedDate > maxDate) {
          errMessage = "Date cannot be more than 1 year in the future.";
        } else if (form.slot) {
          if (!isSlotValid(value, form.slot)) {
            setErrors((prev) => ({
              ...prev,
              slot: "For today, slot must be at least 2 hours in the future.",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              slot: undefined,
            }));
          }
        }
      }
    }
    if (field === "slot") {
      if (!value) {
        errMessage = "Please select a preferred time slot.";
      } else if (!isSlotValid(form.date, value)) {
        errMessage = "For today, slot must be at least 2 hours in the future.";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [field]: errMessage ? errMessage : undefined,
    }));
  }

  function handleInputChange(field: keyof FormFields, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  }

  const validateAll = React.useCallback(() => {
    const tempErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) tempErrors.name = "Name is required.";
    if (!form.email.trim()) {
      tempErrors.email = "Work email is required.";
    } else if (!emailRegex.test(form.email)) {
      tempErrors.email = "Please enter a valid work email.";
    }
    if (!form.company.trim()) tempErrors.company = "Company name is required.";
    if (!form.industry) tempErrors.industry = "Please select an industry.";
    if (!form.date) {
      tempErrors.date = "Please pick a date for the demo.";
    } else {
      const selectedDate = new Date(form.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);

      if (selectedDate < today) {
        tempErrors.date = "Date cannot be in the past.";
      } else if (selectedDate > maxDate) {
        tempErrors.date = "Date cannot be more than 1 year in the future.";
      }
    }
    if (!form.slot) {
      tempErrors.slot = "Please select a preferred time slot.";
    } else if (!isSlotValid(form.date, form.slot)) {
      tempErrors.slot = "For today, slot must be at least 2 hours in the future.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }, [form]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateAll()) {
      showToast("error", "Form Validation Failed", "Please fix the marked fields before submitting.");
      return;
    }

    try {
      // Simulate successful API response
      showToast("success", "Demo booked successfully!", `We scheduled your demo on ${form.date} at ${form.slot}.`);
      setForm({
        name: "",
        email: "",
        company: "",
        industry: "",
        date: "",
        slot: "",
        message: "",
      });
      setErrors({});
    } catch {
      showToast("error", "Network Error", "Could not complete request. Please try again.");
    }
  }

  return (
    <SubpageLayout accentColor="#4f7cff">
      {/* Breadcrumb */}
      <nav
        style={{ fontSize: "13px", color: "var(--muted-fg)", marginBottom: "32px", display: "flex", gap: "6px" }}
        aria-label="Breadcrumb"
      >
        <Link href="/" style={{ color: "var(--muted-fg)", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <span style={{ color: "var(--fg)", fontWeight: 600 }}>Book a Demo</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12" style={{ alignItems: "flex-start" }}>
        {/* Left: pitch panel */}
        <div style={{ gridColumn: "span 2" }}>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "16px",
            }}
          >
            See Assistly in <span className="gradient-text">Action</span>
          </h1>
          <p style={{ fontSize: "16px", color: "var(--muted-fg)", lineHeight: 1.7, marginBottom: "32px" }}>
            Book a free 30-minute personalised demo with our product engineers and see Assistly deployed with your own data.
          </p>

          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px", padding: 0 }}>
            {BENEFITS.map((b) => (
              <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", color: "var(--fg)" }}>
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    marginTop: "1px",
                    background: "rgba(79,124,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check style={{ width: "12px", height: "12px", color: "var(--accent)" }} />
                </div>
                {b}
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { icon: Calendar, label: "30 min focused session" },
              { icon: MessageSquare, label: "Live Q&A with engineers" },
              { icon: Building2, label: "Used by 2,800+ businesses" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--muted-fg)" }}>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    background: "var(--muted-bg)",
                    border: "1px solid var(--card-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon style={{ width: "16px", height: "16px", color: "var(--accent)" }} />
                </div>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: booking form */}
        <form
          onSubmit={handleSubmit}
          className="card-gradient-border"
          style={{ padding: "18px", gridColumn: "span 3", display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "4px" }}>Request Your Demo</h2>

          {/* Row 1: Name + Email (Side-by-side) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label htmlFor="name" style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                placeholder="Abhishek"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "var(--muted-bg)",
                  border: errors.name ? "1px solid #ef4444" : "1px solid var(--card-border)",
                  color: "var(--fg)",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
              {errors.name && (
                <span style={{ fontSize: "12px", fontWeight: 400, color: "#ef4444", marginTop: "2px" }}>
                  {errors.name}
                </span>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label htmlFor="email" style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Work Email *
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "var(--muted-bg)",
                  border: errors.email ? "1px solid #ef4444" : "1px solid var(--card-border)",
                  color: "var(--fg)",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
              {errors.email && (
                <span style={{ fontSize: "12px", fontWeight: 400, color: "#ef4444", marginTop: "2px" }}>
                  {errors.email}
                </span>
              )}
            </div>
          </div>

          {/* Row 2: Company + Custom Industry Dropdown (Side-by-side) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label htmlFor="company" style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Company Name *
              </label>
              <input
                id="company"
                type="text"
                placeholder="Throughout Technologies Pvt. Ltd."
                value={form.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "var(--muted-bg)",
                  border: errors.company ? "1px solid #ef4444" : "1px solid var(--card-border)",
                  color: "var(--fg)",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
              {errors.company && (
                <span style={{ fontSize: "12px", fontWeight: 400, color: "#ef4444", marginTop: "2px" }}>
                  {errors.company}
                </span>
              )}
            </div>

            {/* Custom Industry Dropdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={industryDropdownRef}>
              <label htmlFor="industry-btn" style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Industry *
              </label>
              <div style={{ position: "relative" }}>
                <button
                  id="industry-btn"
                  type="button"
                  onClick={() => setIsOpenIndustryDropdown((prev) => !prev)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "var(--muted-bg)",
                    border: errors.industry ? "1px solid #ef4444" : "1px solid var(--card-border)",
                    color: form.industry ? "var(--fg)" : "var(--muted-fg)",
                    fontSize: "14px",
                    outline: "none",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <span>{form.industry ? form.industry : "Select an industry…"}</span>
                  <ChevronDown
                    style={{
                      width: "16px",
                      height: "16px",
                      transform: isOpenIndustryDropdown ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      color: "var(--muted-fg)",
                    }}
                  />
                </button>

                <AnimatePresence>
                  {isOpenIndustryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        background: "var(--card-bg)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "8px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.16)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        style={{
                          maxHeight: "220px",
                          overflowY: "auto",
                          padding: "6px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        {INDUSTRIES_LIST.map((ind) => {
                          const isSelected = form.industry === ind;
                          return (
                            <button
                              key={ind}
                              type="button"
                              onClick={() => {
                                handleInputChange("industry", ind);
                                setIsOpenIndustryDropdown(false);
                              }}
                              style={{
                                padding: "8px 12px",
                                borderRadius: "6px",
                                fontSize: "13.5px",
                                textAlign: "left",
                                border: "none",
                                cursor: "pointer",
                                background: isSelected ? "var(--accent)" : "transparent",
                                color: isSelected ? "#fff" : "var(--fg)",
                                transition: "background 0.15s, color 0.15s",
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.background = "var(--muted-bg)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.background = "transparent";
                                }
                              }}
                            >
                              {ind}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {errors.industry && (
                <span style={{ fontSize: "12px", fontWeight: 400, color: "#ef4444", marginTop: "2px" }}>
                  {errors.industry}
                </span>
              )}
            </div>
          </div>

          {/* Row 3: Date Picker + Custom Slot Dropdown (Side-by-side) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label htmlFor="date" style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Demo Date *
              </label>
              <input
                id="date"
                type="date"
                value={form.date}
                min={new Date().toISOString().split("T")[0]}
                max={(() => {
                  const d = new Date();
                  d.setFullYear(d.getFullYear() + 1);
                  return d.toISOString().split("T")[0];
                })()}
                onChange={(e) => handleInputChange("date", e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "var(--muted-bg)",
                  border: errors.date ? "1px solid #ef4444" : "1px solid var(--card-border)",
                  color: "var(--fg)",
                  fontSize: "14px",
                  outline: "none",
                  cursor: "pointer",
                }}
              />
              {errors.date && (
                <span style={{ fontSize: "12px", fontWeight: 400, color: "#ef4444", marginTop: "2px" }}>
                  {errors.date}
                </span>
              )}
            </div>

            {/* Custom Time Slot Dropdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }} ref={slotDropdownRef}>
              <label htmlFor="slot-btn" style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Preferred Time Slot (IST) *
              </label>
              <div style={{ position: "relative" }}>
                <button
                  id="slot-btn"
                  type="button"
                  onClick={() => setIsOpenSlotDropdown((prev) => !prev)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    background: "var(--muted-bg)",
                    border: errors.slot ? "1px solid #ef4444" : "1px solid var(--card-border)",
                    color: form.slot ? "var(--fg)" : "var(--muted-fg)",
                    fontSize: "14px",
                    outline: "none",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <span>{form.slot ? form.slot : "Select a time slot…"}</span>
                  <ChevronDown
                    style={{
                      width: "16px",
                      height: "16px",
                      transform: isOpenSlotDropdown ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      color: "var(--muted-fg)",
                    }}
                  />
                </button>

                <AnimatePresence>
                  {isOpenSlotDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        background: "var(--card-bg)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "8px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.16)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        style={{
                          maxHeight: "220px",
                          overflowY: "auto",
                          padding: "6px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        {(() => {
                          const availableSlots = SLOTS.filter((slot) => isSlotValid(form.date, slot));
                          if (availableSlots.length === 0) {
                            return (
                              <div style={{ padding: "12px", fontSize: "13px", color: "var(--muted-fg)", textAlign: "center" }}>
                                No slots available for today. Please pick a future date.
                              </div>
                            );
                          }
                          return availableSlots.map((slot) => {
                            const isSelected = form.slot === slot;
                            return (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => {
                                  handleInputChange("slot", slot);
                                  setIsOpenSlotDropdown(false);
                                }}
                                style={{
                                  padding: "8px 12px",
                                  borderRadius: "6px",
                                  fontSize: "13.5px",
                                  textAlign: "left",
                                  border: "none",
                                  cursor: "pointer",
                                  background: isSelected ? "var(--accent)" : "transparent",
                                  color: isSelected ? "#fff" : "var(--fg)",
                                  transition: "background 0.15s, color 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.background = "var(--muted-bg)";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.background = "transparent";
                                  }
                                }}
                              >
                                {slot}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {errors.slot && (
                <span style={{ fontSize: "12px", fontWeight: 400, color: "#ef4444", marginTop: "2px" }}>
                  {errors.slot}
                </span>
              )}
            </div>
          </div>

          {/* Message (Full-width) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label htmlFor="message" style={{ fontSize: "12px", fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              What are you hoping to achieve?
            </label>
            <textarea
              id="message"
              rows={3}
              placeholder="Reduce support costs, automate FAQs, capture leads…"
              value={form.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                background: "var(--muted-bg)",
                border: "1px solid var(--card-border)",
                color: "var(--fg)",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: "0 12px 40px rgba(79,124,255,0.35)" }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary"
            style={{ padding: "14px", fontSize: "15px", justifyContent: "center", cursor: "pointer" }}
          >
            Book My Demo
            <Send style={{ width: "16px", height: "16px" }} />
          </motion.button>

          <p style={{ fontSize: "12px", color: "var(--muted-fg)", textAlign: "center" }}>
            No credit card required · We respond within 2 hours
          </p>
        </form>
      </div>
    </SubpageLayout>
  );
}
