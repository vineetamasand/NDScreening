// src/components/AppHeader.jsx
import React from "react";
import logo from "../assets/RSSB.png";

export default function AppHeader({ title, user, sessionCode, onLogoClick }) {
  return (
    <header
      className="app-header"
      style={{
        borderBottom: "1px solid #ddd",
        background: "#f9f9f9",
      }}
    >
      {/* Row 1: Logo + Title (left) | Session (right) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // ✅ full width split
          alignItems: "center",
          padding: "0px 0px",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Left: Logo + App title */}
        <div
          style={{
            display: "flex",
            alignItems: "left",
            cursor: onLogoClick ? "pointer" : "default",
          }}
          onClick={onLogoClick}
        >
          <img src={logo} alt="RSSB Logo" style={{ height: 44, marginRight: 0 }} />
          <span style={{ fontSize: "1.45rem", fontWeight: 700, color: "#111" }}>
            NaamDaan Screening
          </span>
        </div>

        {/* Right: Session */}
        {sessionCode && (
          <div style={{ fontSize: "0.5rem", color: "#333", alignItems: "right"}}>
            <strong>{sessionCode}</strong>
          </div>
        )}
      </div>

      {/* Row 2: Screen Title (left) | User (right) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between", // ✅ left/right split
          alignItems: "center",
          padding: "10px 10px",
          borderTop: "1px solid #eee",
          background: "#fff",
        //   marginLeft: 40
        }}
      >
        <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#4fb2cf"}}>
          {title}
        </span>
        
        {user && (
          <span style={{ fontSize: "0.95rem", color: "#555" }}>
            User: <strong>{user}</strong>
          </span>
        )}
      </div>
    </header>
  );
}
