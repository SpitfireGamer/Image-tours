"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/sections/Navbar";

export default function Dashboard() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("trips");
  const [bookings, setBookings] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fromCity: "",
    toCity: "",
    departureDate: "",
    adultsCount: 2,
    budgetMin: 10000,
    budgetMax: 50000,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/bookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data.bookings || []);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setFetching(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        travelType: "FULL_PACKAGE",
        fromCity: formData.fromCity,
        toCity: formData.toCity,
        departureDate: formData.departureDate,
        adultsCount: Number(formData.adultsCount),
        budgetMin: Number(formData.budgetMin),
        budgetMax: Number(formData.budgetMax),
        budgetPerPerson: true,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        setShowModal(false);
        fetchBookings();
        alert("Trip request sent successfully! Our concierge will contact you shortly.");
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting.");
    }
  };

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
        <div style={{ color: "var(--color-primary)", fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>
          Loading your portal...
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100vh", paddingTop: "120px", paddingBottom: "80px", position: "relative" }}>
        
        {/* Request Modal */}
        {showModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999
          }}>
            <div style={{
              background: "#121216", padding: "2rem", borderRadius: "1rem",
              width: "90%", maxWidth: "500px", border: "1px solid rgba(200, 149, 108, 0.2)"
            }}>
              <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-primary)", marginBottom: "1rem" }}>Plan a Trip</h2>
              <form onSubmit={handleRequestSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <input required placeholder="From City" value={formData.fromCity} onChange={(e) => setFormData({...formData, fromCity: e.target.value})} style={{ padding: "0.8rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "white" }} />
                  <input required placeholder="Destination" value={formData.toCity} onChange={(e) => setFormData({...formData, toCity: e.target.value})} style={{ padding: "0.8rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "white" }} />
                </div>
                <input required type="date" value={formData.departureDate} onChange={(e) => setFormData({...formData, departureDate: e.target.value})} style={{ padding: "0.8rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "white", colorScheme: "dark" }} />
                <input required type="number" min="1" placeholder="Number of Adults" value={formData.adultsCount} onChange={(e) => setFormData({...formData, adultsCount: Number(e.target.value)})} style={{ padding: "0.8rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "white" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <input required type="number" placeholder="Min Budget (₹)" value={formData.budgetMin} onChange={(e) => setFormData({...formData, budgetMin: Number(e.target.value)})} style={{ padding: "0.8rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "white" }} />
                  <input required type="number" placeholder="Max Budget (₹)" value={formData.budgetMax} onChange={(e) => setFormData({...formData, budgetMax: Number(e.target.value)})} style={{ padding: "0.8rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "white" }} />
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" style={{ flex: 1, padding: "0.8rem", background: "var(--color-primary)", border: "none", borderRadius: "0.5rem", color: "white", fontWeight: "bold", cursor: "pointer" }}>Submit Request</button>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: "0.8rem", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0.5rem", color: "white", cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: "3rem" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", marginBottom: "0.5rem" }}>
              Welcome back, <span className="text-gradient-gold">{user.name.split(" ")[0]}</span>
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
              Manage your upcoming travel plans and requests.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "2rem" }}>
            {/* Sidebar */}
            <div style={{
              background: "rgba(20, 20, 25, 0.6)",
              border: "1px solid rgba(200, 149, 108, 0.1)",
              borderRadius: "1rem",
              padding: "1.5rem",
              height: "fit-content",
              backdropFilter: "blur(10px)"
            }}>
              <h3 style={{ color: "var(--color-primary-light)", marginBottom: "1.5rem", fontSize: "1.1rem" }}>Menu</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <li>
                  <button onClick={() => setActiveTab("trips")} style={{ background: "none", border: "none", color: activeTab === "trips" ? "white" : "var(--text-muted)", fontWeight: activeTab === "trips" ? 600 : 400, cursor: "pointer", padding: 0, fontSize: "1rem" }}>My Trips</button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("settings")} style={{ background: "none", border: "none", color: activeTab === "settings" ? "white" : "var(--text-muted)", fontWeight: activeTab === "settings" ? 600 : 400, cursor: "pointer", padding: 0, fontSize: "1rem" }}>Profile & Settings</button>
                </li>
              </ul>
            </div>

            {/* Main Content */}
            <div>
              {activeTab === "trips" ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>Your Trips</h2>
                    <button
                      style={{
                        background: "var(--color-primary)", color: "white", border: "none", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer", transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                      onClick={() => setShowModal(true)}
                    >
                      Request New Trip
                    </button>
                  </div>

                  {fetching ? (
                    <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>Loading your trips...</div>
                  ) : bookings.length === 0 ? (
                    <div style={{
                      background: "rgba(20, 20, 25, 0.4)", border: "1px dashed rgba(200, 149, 108, 0.2)", borderRadius: "1rem", padding: "4rem 2rem", textAlign: "center",
                    }}>
                      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✈️</div>
                      <h3 style={{ fontSize: "1.3rem", marginBottom: "0.5rem", color: "white" }}>No trips booked yet</h3>
                      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", maxWidth: "400px", margin: "0 auto 1.5rem auto" }}>
                        You haven't requested any custom itineraries yet. Let's plan your next adventure!
                      </p>
                      <button
                        onClick={() => setShowModal(true)}
                        style={{
                          background: "transparent", color: "var(--color-primary)", border: "1px solid var(--color-primary)", padding: "0.5rem 1.25rem", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer",
                        }}
                      >
                        Start Planning
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {bookings.map((booking) => (
                        <div key={booking._id} style={{
                          background: "rgba(20, 20, 25, 0.6)", border: "1px solid rgba(200, 149, 108, 0.1)", borderRadius: "1rem", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                          <div>
                            <h4 style={{ fontSize: "1.2rem", marginBottom: "0.25rem", color: "white" }}>{booking.toCity} <span style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 400 }}>from {booking.fromCity}</span></h4>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                              Departure: {new Date(booking.departureDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <span style={{
                              padding: "0.25rem 0.75rem", borderRadius: "1rem", fontSize: "0.8rem", fontWeight: 600,
                              background: booking.status === "PENDING" ? "rgba(255, 193, 7, 0.1)" : "rgba(40, 167, 69, 0.1)",
                              color: booking.status === "PENDING" ? "#ffc107" : "#28a745",
                            }}>
                              {booking.status}
                            </span>
                            {booking.status === "PAYMENT_PENDING" && (
                              <button style={{ display: "block", marginTop: "0.5rem", padding: "0.3rem 0.8rem", background: "#d4a853", color: "black", border: "none", borderRadius: "0.25rem", fontSize: "0.8rem", cursor: "pointer", fontWeight: "bold" }}>
                                Pay Now
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem" }}>Profile & Settings</h2>
                  </div>
                  <div style={{ background: "rgba(20, 20, 25, 0.6)", border: "1px solid rgba(200, 149, 108, 0.1)", borderRadius: "1rem", padding: "2rem" }}>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Full Name</label>
                      <input disabled value={user.name} style={{ width: "100%", padding: "0.8rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "white" }} />
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Email Address</label>
                      <input disabled value={user.email} style={{ width: "100%", padding: "0.8rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "white" }} />
                    </div>
                    <div style={{ marginBottom: "2rem" }}>
                      <label style={{ display: "block", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.5rem" }}>Phone Number</label>
                      <input disabled value={user.phone || "Not provided"} style={{ width: "100%", padding: "0.8rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "white" }} />
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span>ℹ️</span> To update your secure profile information, please contact your concierge on WhatsApp.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
