"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/sections/Navbar";
import { FiCheckSquare, FiDollarSign, FiMapPin, FiClock } from "react-icons/fi";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["REVIEWING", "CANCELLED"],
  REVIEWING: ["OPTIONS_SENT", "CANCELLED"],
  OPTIONS_SENT: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PAYMENT_PENDING", "CANCELLED"],
  PAYMENT_PENDING: ["PAYMENT_RECEIVED", "CANCELLED"],
  PAYMENT_RECEIVED: ["BOOKING_IN_PROGRESS"],
  BOOKING_IN_PROGRESS: ["BOOKED", "CANCELLED"],
  BOOKED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: ["REFUNDED"],
  REFUNDED: [],
};

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("trips");
  const [bookings, setBookings] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    travelType: "FULL_PACKAGE",
    fromCity: "",
    toCity: "",
    departureDate: "",
    returnDate: "",
    adultsCount: 2,
    childrenCount: 0,
    budgetMin: 10000,
    budgetMax: 50000,
    specialRequests: "",
    occasion: "",
  });

  const [expenses, setExpenses] = useState<any[]>([]);
  const [fetchingExpenses, setFetchingExpenses] = useState(true);
  const [submittingExpense, setSubmittingExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ description: "", amount: "", category: "Food", paidBy: "Me" });

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  const fetchBookings = async () => {
    try {
      const RAW_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const API_URL = RAW_URL.replace(/\/+$/, "").replace(/\/api\/v1$/, "");
      const res = await fetch(`${API_URL}/api/v1/bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) setBookings(data.data.bookings || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setFetching(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const RAW_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const API_URL = RAW_URL.replace(/\/+$/, "").replace(/\/api\/v1$/, "");
      const res = await fetch(`${API_URL}/api/v1/expenses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (data.success) setExpenses(data.data.expenses || []);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    } finally {
      setFetchingExpenses(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchExpenses();
    }
  }, [user]);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: any = {
        travelType: formData.travelType,
        fromCity: formData.fromCity,
        toCity: formData.toCity,
        departureDate: formData.departureDate,
        adultsCount: Number(formData.adultsCount),
        childrenCount: Number(formData.childrenCount),
        budgetMin: Number(formData.budgetMin),
        budgetMax: Number(formData.budgetMax),
        budgetPerPerson: true,
      };
      if (formData.returnDate) payload.returnDate = formData.returnDate;
      if (formData.specialRequests) payload.specialRequests = formData.specialRequests;
      if (formData.occasion) payload.occasion = formData.occasion;

      const RAW_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const API_URL = RAW_URL.replace(/\/+$/, "").replace(/\/api\/v1$/, "");
      const res = await fetch(`${API_URL}/api/v1/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        setFormData({ travelType: "FULL_PACKAGE", fromCity: "", toCity: "", departureDate: "", returnDate: "", adultsCount: 2, childrenCount: 0, budgetMin: 10000, budgetMax: 50000, specialRequests: "", occasion: "" });
        fetchBookings();
        alert("✅ Trip request sent! Our concierge will contact you on WhatsApp within 2 hours.");
      } else {
        const errData = await res.json();
        alert(errData.error?.message || "Failed to submit request.");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingExpense(true);
    try {
      const payload = {
        description: expenseForm.description,
        amount: Number(expenseForm.amount),
        category: expenseForm.category,
        paidBy: expenseForm.paidBy,
      };
      const RAW_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const API_URL = RAW_URL.replace(/\/+$/, "").replace(/\/api\/v1$/, "");
      const res = await fetch(`${API_URL}/api/v1/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setExpenseForm({ description: "", amount: "", category: "Food", paidBy: "Me" });
        fetchExpenses();
      } else {
        alert("Failed to add expense");
      }
    } catch (err) {
      alert("Error adding expense");
    } finally {
      setSubmittingExpense(false);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    try {
      const RAW_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const API_URL = RAW_URL.replace(/\/+$/, "").replace(/\/api\/v1$/, "");
      await fetch(`${API_URL}/api/v1/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchExpenses();
    } catch (e) {
      console.error(e);
    }
  };

  const statusColor = (s: string) => {
    const map: Record<string, { bg: string; text: string }> = {
      PENDING: { bg: "rgba(255,193,7,0.12)", text: "#ffc107" },
      REVIEWING: { bg: "rgba(33,150,243,0.12)", text: "#2196f3" },
      OPTIONS_SENT: { bg: "rgba(0,188,212,0.12)", text: "#00bcd4" },
      CONFIRMED: { bg: "rgba(76,175,80,0.12)", text: "#4caf50" },
      PAYMENT_PENDING: { bg: "rgba(255,152,0,0.12)", text: "#ff9800" },
      BOOKED: { bg: "rgba(40,167,69,0.12)", text: "#28a745" },
      CANCELLED: { bg: "rgba(244,67,54,0.12)", text: "#f44336" },
    };
    return map[s] || { bg: "rgba(158,158,158,0.12)", text: "#9e9e9e" };
  };

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
        <div style={{ color: "var(--color-primary)", fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>Loading your portal...</div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(200,149,108,0.2)", borderRadius: "0.6rem", color: "white",
    fontSize: "0.9rem", fontFamily: "var(--font-body)", outline: "none", transition: "border-color 0.3s",
    colorScheme: "dark"
  };

  const labelStyle: React.CSSProperties = {
    display: "block", color: "var(--text-tertiary)", fontSize: "0.75rem", fontWeight: 600,
    letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.4rem",
    fontFamily: "var(--font-accent)",
  };

  return (
    <>
      <Navbar />

      {/* ── Trip Request Modal ── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" }}>
          <div style={{ background: "#111118", padding: "2.5rem", borderRadius: "1.25rem", width: "100%", maxWidth: "560px", border: "1px solid rgba(200,149,108,0.15)", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 64px rgba(0,0,0,0.6)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-primary-light)", marginBottom: "0.5rem", fontSize: "1.5rem" }}>Plan Your Dream Trip</h2>
            <p style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Fill in the details and our concierge will craft a personalized itinerary for you.</p>

            <form onSubmit={handleRequestSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div><label style={labelStyle}>From City</label><input required placeholder="e.g. Nagpur" value={formData.fromCity} onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })} style={inputStyle} /></div>
                <div><label style={labelStyle}>Destination</label><input required placeholder="e.g. Goa" value={formData.toCity} onChange={(e) => setFormData({ ...formData, toCity: e.target.value })} style={inputStyle} /></div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div><label style={labelStyle}>Departure Date</label><input required type="date" value={formData.departureDate} onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })} style={{ ...inputStyle, colorScheme: "dark" }} /></div>
                <div><label style={labelStyle}>Return Date (optional)</label><input type="date" value={formData.returnDate} onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })} style={{ ...inputStyle, colorScheme: "dark" }} /></div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div><label style={labelStyle}>Travel Type</label>
                  <select value={formData.travelType} onChange={(e) => setFormData({ ...formData, travelType: e.target.value })} style={{ ...inputStyle, background: "#111118" }}>
                    <option style={{ color: "white", background: "#111118" }} value="FULL_PACKAGE">Full Package</option>
                    <option style={{ color: "white", background: "#111118" }} value="FLIGHT">Flight Only</option>
                    <option style={{ color: "white", background: "#111118" }} value="TRAIN">Train Only</option>
                    <option style={{ color: "white", background: "#111118" }} value="HOTEL">Hotel Only</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Adults</label><input required type="number" min="1" max="20" value={formData.adultsCount} onChange={(e) => setFormData({ ...formData, adultsCount: Number(e.target.value) })} style={inputStyle} /></div>
                <div><label style={labelStyle}>Children</label><input type="number" min="0" max="10" value={formData.childrenCount} onChange={(e) => setFormData({ ...formData, childrenCount: Number(e.target.value) })} style={inputStyle} /></div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div><label style={labelStyle}>Min Budget (₹)</label><input required type="number" value={formData.budgetMin} onChange={(e) => setFormData({ ...formData, budgetMin: Number(e.target.value) })} style={inputStyle} /></div>
                <div><label style={labelStyle}>Max Budget (₹)</label><input required type="number" value={formData.budgetMax} onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })} style={inputStyle} /></div>
              </div>

              <div><label style={labelStyle}>Occasion (optional)</label>
                <select value={formData.occasion} onChange={(e) => setFormData({ ...formData, occasion: e.target.value })} style={{ ...inputStyle, background: "#111118" }}>
                  <option style={{ color: "white", background: "#111118" }} value="">Select occasion...</option>
                  <option style={{ color: "white", background: "#111118" }} value="HONEYMOON">Honeymoon</option>
                  <option style={{ color: "white", background: "#111118" }} value="ANNIVERSARY">Anniversary</option>
                  <option style={{ color: "white", background: "#111118" }} value="FAMILY">Family Trip</option>
                  <option style={{ color: "white", background: "#111118" }} value="BUSINESS">Business</option>
                  <option style={{ color: "white", background: "#111118" }} value="PILGRIMAGE">Pilgrimage</option>
                  <option style={{ color: "white", background: "#111118" }} value="GROUP_TOUR">Group Tour</option>
                  <option style={{ color: "white", background: "#111118" }} value="SOLO">Solo Adventure</option>
                </select>
              </div>

              <div><label style={labelStyle}>Special Requests</label><textarea placeholder="Any specific requirements, dietary needs, accessibility, etc." value={formData.specialRequests} onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })} style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} /></div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: "0.85rem", background: submitting ? "rgba(200,149,108,0.3)" : "linear-gradient(135deg, #c8956c, #d4a853)", border: "none", borderRadius: "0.6rem", color: "#0a0a0f", fontWeight: 700, cursor: submitting ? "wait" : "pointer", fontSize: "0.9rem" }}>{submitting ? "Submitting..." : "Submit Trip Request"}</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "0.85rem 1.5rem", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "0.6rem", color: "var(--text-secondary)", cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Dashboard Main ── */}
      <main style={{ minHeight: "100vh", position: "relative" }}>
        {/* Background Image */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
          <Image src="/images/dashboard-bg.png" alt="" fill style={{ objectFit: "cover" }} quality={80} priority />
          <div style={{ position: "absolute", inset: 0, background: "rgba(10, 10, 15, 0.88)", backdropFilter: "blur(8px)" }} />
        </div>

        <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: "120px", paddingBottom: "80px" }}>
          {/* Welcome Header */}
          <div style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", marginBottom: "0.5rem" }}>
                Welcome, <span className="text-gradient-gold">{user.name.split(" ")[0]}</span>
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>Here&apos;s an overview of your travel requests and account.</p>
            </div>
            {user.role === "CUSTOMER" && (
              <button onClick={() => setShowModal(true)} style={{ background: "linear-gradient(135deg, #c8956c, #d4a853)", color: "#0a0a0f", border: "none", padding: "0.85rem 2rem", borderRadius: "0.6rem", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem", transition: "transform 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}>
                + Request New Trip
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
            {[
              { label: "Total Requests", value: bookings.length, icon: "📋" },
              { label: "Active Trips", value: bookings.filter(b => !["CANCELLED", "COMPLETED"].includes(b.status)).length, icon: "✈️" },
              { label: "Completed", value: bookings.filter(b => b.status === "COMPLETED").length, icon: "✅" },
              { label: "Pending Review", value: bookings.filter(b => b.status === "PENDING").length, icon: "⏳" },
            ]
            .filter(stat => stat.value > 0 || stat.label === "Total Requests")
            .map((stat, i) => (
              <div key={i} style={{ background: "rgba(20,20,25,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(200,149,108,0.1)", borderRadius: "1rem", padding: "1.5rem" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{stat.icon}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, color: "var(--color-primary-light)" }}>{stat.value}</div>
                <div style={{ fontFamily: "var(--font-accent)", fontSize: "0.8rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Tab Switcher */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem", background: "rgba(20,20,25,0.5)", padding: "0.35rem", borderRadius: "0.75rem", width: "fit-content" }}>
            {[
              { id: "trips", label: user.role === "ADMIN" || user.role === "AGENT" ? "All Bookings" : "Request History" }, 
              { id: "tools", label: "Smart Travel Tools" },
              { id: "settings", label: "Profile & Settings" }
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: "0.6rem 1.5rem", borderRadius: "0.5rem", border: "none", cursor: "pointer",
                background: activeTab === tab.id ? "rgba(200,149,108,0.15)" : "transparent",
                color: activeTab === tab.id ? "var(--color-primary-light)" : "var(--text-tertiary)",
                fontFamily: "var(--font-accent)", fontSize: "0.85rem", fontWeight: activeTab === tab.id ? 600 : 400,
                transition: "all 0.3s ease",
              }}>{tab.label}</button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "trips" ? (
            <>
              {fetching ? (
                <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>Loading your trips...</div>
              ) : bookings.length === 0 ? (
                <div style={{ background: "rgba(20,20,25,0.6)", backdropFilter: "blur(12px)", border: "1px dashed rgba(200,149,108,0.2)", borderRadius: "1.25rem", padding: "4rem 2rem", textAlign: "center" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🌍</div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "0.75rem", color: "white" }}>
                    {user.role === "ADMIN" || user.role === "AGENT" ? "No bookings found" : "Your adventure starts here"}
                  </h3>
                  <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", maxWidth: "450px", margin: "0 auto 2rem", lineHeight: 1.7 }}>
                    {user.role === "ADMIN" || user.role === "AGENT" 
                      ? "There are no trip requests in the system currently." 
                      : "You haven't requested any trips yet. Click the button below to tell us your dream destination — we'll handle the rest."}
                  </p>
                  {user.role === "CUSTOMER" && (
                    <button onClick={() => setShowModal(true)} style={{ background: "linear-gradient(135deg, #c8956c, #d4a853)", color: "#0a0a0f", border: "none", padding: "0.85rem 2rem", borderRadius: "0.6rem", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
                      Plan My First Trip
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {bookings.map((b) => (
                    <div key={b._id} style={{ background: "rgba(20,20,25,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(200,149,108,0.1)", borderRadius: "1rem", padding: "1.5rem 2rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1rem", alignItems: "center" }}>
                      <div>
                        <h4 style={{ fontSize: "1.15rem", color: "white", marginBottom: "0.4rem", fontFamily: "var(--font-display)" }}>
                          {b.fromCity} → {b.toCity}
                        </h4>
                        {(user.role === "ADMIN" || user.role === "AGENT") && (
                          <div style={{ color: "var(--color-primary-light)", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: "bold" }}>
                            Requested By: {b.customerId?.name || b.guestName || "Unknown"} ({b.customerId?.email || b.guestEmail || "No email"}) | {b.customerId?.phone || b.guestPhone || "No phone"}
                          </div>
                        )}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                          <span>📅 {new Date(b.departureDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          <span>👥 {b.adultsCount} adults{b.childrenCount > 0 ? `, ${b.childrenCount} children` : ""}</span>
                          <span>💰 ₹{b.budgetMin?.toLocaleString()} – ₹{b.budgetMax?.toLocaleString()}</span>
                          <span>🏷️ {b.travelType?.replace("_", " ")}</span>
                        </div>
                        {b.specialRequests && <p style={{ color: "var(--text-tertiary)", fontSize: "0.8rem", marginTop: "0.5rem", fontStyle: "italic" }}>"{b.specialRequests}"</p>}
                      </div>
                      <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                        {(user.role === "ADMIN" || user.role === "AGENT") ? (
                          <select 
                            value={b.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              try {
                                const RAW_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
                                const API_URL = RAW_URL.replace(/\/+$/, "").replace(/\/api\/v1$/, "");
                                const res = await fetch(`${API_URL}/api/v1/bookings/${b._id}/status`, {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                                  body: JSON.stringify({ status: newStatus }),
                                });
                                if (res.ok) {
                                  fetchBookings();
                                } else {
                                  const err = await res.json();
                                  alert(`Error: ${err.error?.message || "Failed to update status"}`);
                                }
                              } catch (err) {
                                alert("Failed to update status.");
                              }
                            }}
                            style={{ padding: "0.4rem 0.8rem", borderRadius: "0.4rem", background: "#111118", color: statusColor(b.status).text, border: `1px solid ${statusColor(b.status).text}`, fontWeight: 700, outline: "none", cursor: "pointer", colorScheme: "dark" }}
                          >
                            <option value={b.status}>{b.status.replace(/_/g, " ")}</option>
                            {(ALLOWED_TRANSITIONS[b.status] || []).map(status => (
                              <option key={status} value={status}>{status.replace(/_/g, " ")}</option>
                            ))}
                          </select>
                        ) : (
                          <span style={{ padding: "0.3rem 0.9rem", borderRadius: "2rem", fontSize: "0.75rem", fontWeight: 700, background: statusColor(b.status).bg, color: statusColor(b.status).text, letterSpacing: "0.05em" }}>
                            {b.status?.replace(/_/g, " ")}
                          </span>
                        )}
                        <p style={{ color: "var(--text-tertiary)", fontSize: "0.75rem" }}>
                          Requested {new Date(b.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : activeTab === "tools" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              {/* Smart Packing Checklist */}
              <div style={{ background: "rgba(20,20,25,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(200,149,108,0.1)", borderRadius: "1.25rem", padding: "2.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ background: "rgba(200,149,108,0.15)", color: "var(--color-primary-light)", padding: "1rem", borderRadius: "50%" }}>
                    <FiCheckSquare size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--color-primary-light)", margin: 0 }}>Smart Packing Checklist</h3>
                    <p style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", margin: 0 }}>Auto-generated based on season & destination.</p>
                  </div>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "1.5rem" }}>
                  {[
                    { item: "Universal Power Adapter", checked: false },
                    { item: "Portable Power Bank (10,000mAh+)", checked: true },
                    { item: "Noise-cancelling Headphones", checked: false },
                    { item: "Offline Google Maps Downloaded", checked: false },
                    { item: "E-Visa & Passport Copies", checked: true },
                  ].map((task, i) => (
                    <label key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.8rem 1rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "0.5rem", cursor: "pointer", transition: "background 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    >
                      <input type="checkbox" defaultChecked={task.checked} style={{ accentColor: "var(--color-primary)" }} />
                      <span style={{ color: task.checked ? "var(--text-tertiary)" : "white", textDecoration: task.checked ? "line-through" : "none", fontSize: "0.9rem" }}>{task.item}</span>
                    </label>
                  ))}
                  <button style={{ marginTop: "1rem", background: "transparent", border: "1px dashed rgba(200,149,108,0.4)", color: "var(--color-primary-light)", padding: "0.8rem", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.85rem", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(200,149,108,0.1)"; e.currentTarget.style.borderStyle = "solid"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderStyle = "dashed"; }}
                  >
                    + Add Custom Item
                  </button>
                </div>
              </div>

              {/* Trip Cost Splitter */}
              <div style={{ background: "rgba(20,20,25,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(200,149,108,0.1)", borderRadius: "1.25rem", padding: "2.5rem", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ background: "rgba(33,150,243,0.15)", color: "#2196f3", padding: "1rem", borderRadius: "50%" }}>
                    <FiDollarSign size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--color-primary-light)", margin: 0 }}>Trip Expense Tracker</h3>
                    <p style={{ color: "var(--text-tertiary)", fontSize: "0.85rem", margin: 0 }}>Track and manage your expenses.</p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {fetchingExpenses ? (
                    <div style={{ color: "var(--text-tertiary)" }}>Loading expenses...</div>
                  ) : expenses.length === 0 ? (
                    <div style={{ padding: "1.5rem", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: "0.75rem" }}>
                      <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.9rem" }}>No expenses recorded yet.</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", maxHeight: "250px", overflowY: "auto", paddingRight: "0.5rem" }}>
                      {expenses.map((exp: any) => (
                        <div key={exp._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.8rem 1rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "0.5rem" }}>
                          <div>
                            <div style={{ color: "white", fontSize: "0.9rem", fontWeight: 600 }}>{exp.description}</div>
                            <div style={{ color: "var(--text-tertiary)", fontSize: "0.75rem" }}>{exp.category} • Paid by {exp.paidBy}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ color: "var(--color-primary-light)", fontWeight: 700, fontSize: "1rem" }}>₹{exp.amount}</div>
                            <button onClick={() => deleteExpense(exp._id)} style={{ background: "transparent", border: "none", color: "#f44336", cursor: "pointer", fontSize: "0.8rem" }}>✖</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleExpenseSubmit} style={{ marginTop: "1rem", padding: "1.2rem", background: "rgba(0,0,0,0.2)", borderRadius: "0.75rem", border: "1px dashed rgba(200,149,108,0.2)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "0.8rem" }}>
                      <input required placeholder="Description" value={expenseForm.description} onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })} style={{ width: "100%", padding: "0.6rem 0.8rem", background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.4rem", color: "white", fontSize: "0.85rem" }} />
                      <input required type="number" placeholder="Amount (₹)" value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })} style={{ width: "100%", padding: "0.6rem 0.8rem", background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.4rem", color: "white", fontSize: "0.85rem" }} />
                      <select value={expenseForm.category} onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })} style={{ width: "100%", padding: "0.6rem 0.8rem", background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.4rem", color: "white", fontSize: "0.85rem", colorScheme: "dark" }}>
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="Stay">Stay</option>
                        <option value="Other">Other</option>
                      </select>
                      <input placeholder="Paid By (e.g. Me)" value={expenseForm.paidBy} onChange={e => setExpenseForm({ ...expenseForm, paidBy: e.target.value })} style={{ width: "100%", padding: "0.6rem 0.8rem", background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.4rem", color: "white", fontSize: "0.85rem" }} />
                    </div>
                    <button type="submit" disabled={submittingExpense} style={{ width: "100%", padding: "0.7rem", background: submittingExpense ? "rgba(200,149,108,0.3)" : "rgba(200,149,108,0.15)", color: "var(--color-primary-light)", border: "1px solid rgba(200,149,108,0.3)", borderRadius: "0.4rem", fontWeight: 600, cursor: submittingExpense ? "wait" : "pointer", fontSize: "0.85rem", transition: "all 0.2s" }}>
                      {submittingExpense ? "Adding..." : "+ Add Expense"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: "rgba(20,20,25,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(200,149,108,0.1)", borderRadius: "1.25rem", padding: "2.5rem" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--color-primary-light)", marginBottom: "2rem" }}>Your Profile</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input disabled value={user.name} style={{ ...inputStyle, opacity: 0.7 }} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input disabled value={user.email} style={{ ...inputStyle, opacity: 0.7 }} />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input disabled value={user.phone || "Not provided"} style={{ ...inputStyle, opacity: 0.7 }} />
                </div>
                <div>
                  <label style={labelStyle}>Account Status</label>
                  <input disabled value={user.isVerified ? "✅ Verified" : "❌ Not Verified"} style={{ ...inputStyle, opacity: 0.7 }} />
                </div>
              </div>
              <div style={{ marginTop: "2rem", padding: "1rem 1.25rem", background: "rgba(200,149,108,0.06)", borderRadius: "0.75rem", border: "1px solid rgba(200,149,108,0.1)" }}>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  ℹ️ To update your profile details (name, phone, password), please contact your concierge directly on <a href="https://wa.me/917875132513" target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>WhatsApp</a> for security verification.
                </p>
              </div>
              <button onClick={logout} style={{ marginTop: "2rem", padding: "0.75rem 2rem", background: "rgba(244,67,54,0.1)", border: "1px solid rgba(244,67,54,0.3)", borderRadius: "0.6rem", color: "#f44336", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
