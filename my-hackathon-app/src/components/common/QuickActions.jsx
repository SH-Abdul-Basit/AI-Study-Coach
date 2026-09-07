import React from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Calendar, ClipboardList, Upload } from "lucide-react";

/**
 * Standalone Quick Actions card — sits ABOVE the AI Study Coach chat card
 * in the dashboard's right column. Deliberately separate from the chatbot:
 * these are navigation shortcuts, not chat content, so they shouldn't live
 * inside a scrolling conversation.
 */
const ACTIONS = [
  { label: "Chat with Coach", icon: Bot, path: "/ai-coach" },
  { label: "Study Plan", icon: Calendar, path: "/study-plan" },
  { label: "Take a Quiz", icon: ClipboardList, path: "/practice" },
  { label: "Upload Material", icon: Upload, path: "/materials" },
];

export default function QuickActionsCard() {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ padding: "16px", marginBottom: "14px" }}>
      <div style={{ marginBottom: "12px" }}>
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 650,
            color: "#202033",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Quick Actions
        </h2>
        <p style={{ fontSize: "12px", color: "#6F7182", marginTop: "3px" }}>
          Jump straight into what you need
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px",
        }}
      >
        {ACTIONS.map(({ label, icon: Icon, path }) => (
          <button
            key={path}
            type="button"
            onClick={() => navigate(path)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "10px",
              padding: "14px",
              background: "#FCFCFE",
              border: "1px solid #ECECF2",
              borderRadius: "10px",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.15s ease, border-color 0.15s ease, transform 0.1s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F0ECFF";
              e.currentTarget.style.borderColor = "#EEEAFE";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FCFCFE";
              e.currentTarget.style.borderColor = "#ECECF2";
            }}
          >
            <span
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "#EEEAFE",
                color: "#6347F5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={19} />
            </span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 650,
                color: "#202033",
                lineHeight: 1.25,
              }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}