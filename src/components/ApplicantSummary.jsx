// src/components/ApplicantSummary.jsx
import React, { useState, useEffect } from "react";
import tickImg from "../assets/tick.jpg";
import crossImg from "../assets/cross.jpg";
import dataService from "../data/dataService"; // must expose saveResponses and saveDecision

export default function ApplicantSummary({
  questions = [],
  language,
  screeningNumber,
  applicant = {},
  answers = [],
  comments = [],
  // decisions = [],    // question-level decisions
  checkOk = [],
  setCheckOk,
  decisionReason,
  setDecisionReason,
  returnToLastQuestion,
  sessionCd,
  applicantId,
  user,
  defaultFinalDecision = "",
  defaultRouteTo = "",
  onCloseSummary,
}) {
  // Local UI state, seeded from props
  const [finalDecision, setFinalDecision] = useState(defaultFinalDecision || "");
  const [routeTo, setRouteTo] = useState(defaultRouteTo || "");
  const [saving, setSaving] = useState(false);

  const [responsesSaved, setResponsesSaved] = useState(false);
  const [decisionSaved, setDecisionSaved] = useState(false);

  // When props change (e.g. user opens another applicant), update local state
  useEffect(() => {
    setFinalDecision(defaultFinalDecision || "");
    setRouteTo(defaultRouteTo || "");
    setDecisionReason((prev) => decisionReason || prev || "");
    if (defaultFinalDecision) {
      setDecisionSaved(true);
    }
  }, [defaultFinalDecision, defaultRouteTo]);

  // Cycle check state for each question
  const cycleState = (idx) => {
    if (responsesSaved) return;
    setCheckOk((prev) => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      const current = updated[idx] || "";
      if (current === "") updated[idx] = "OK";
      else if (current === "OK") updated[idx] = "NotOK";
      else updated[idx] = "";
      return updated;
    });
  };

  const mapQuestionDecisionForBackend = (v) => {
    if (!v) return null;
    const val = v.toString().trim().toUpperCase().replace(/\s+/g, "");
    if (val === "OK") return "OK";
    if (v === "Not OK" || v === "NotOK") return "NotOK";   // enforce canonical spelling
    return null;
  };

  const buildResponsesPayload = () => {
    const responses = (questions || []).map((q, i) => {
      if (!q || !q.question_id) return null;
      const decision = mapQuestionDecisionForBackend(checkOk[i]);
      return {
        question_id: q.question_id,
        response: answers[i] || null,
        decision,
        comment: comments[i] || null,
      };
    }).filter(Boolean);
    console.log("Payload being sent:", responses);  // 🔍 debug
    return { responses };
  };

  const handleSave = async () => {
    if (!applicantId || !sessionCd) {
      alert("Missing applicant or session info. Fetch applicant first.");
      return;
    }

    if (finalDecision === "ROUTE" && !routeTo) {
      alert("Please select a Route To destination before saving decision.");
      return;
    }

    setSaving(true);
    try {
      // 1. Save responses
      const responsesPayload = buildResponsesPayload();
      if (responsesPayload.responses.length > 0) {
        await dataService.saveResponses(applicantId, responsesPayload);
      }
      setResponsesSaved(true);

      // 2. Save decision (if provided)
      if (finalDecision && !decisionSaved) {
        const decisionPayload = {
          level: "SCREENER_L1",
          final_decision: finalDecision,
          reason: decisionReason || null,
          additional_comments: finalDecision === "ROUTE" ? routeTo : null,
          decided_by: user?.user_id || user?.id || null,
        };
        await dataService.saveDecision(applicantId, sessionCd, decisionPayload);
        setDecisionSaved(true);
      }

      alert(finalDecision ? "Responses and decision saved successfully." : "Responses saved successfully.");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed: " + (err?.message || String(err)));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="summary-container">
      {/* Applicant Details */}
      <div className="summary-section">
        <h3>{language === "en" ? "Applicant Details" : "आवेदक विवरण"}</h3>
        <div
          className="summary-applicant-grid"
          style={{
            backgroundColor:
              applicant.category === "Female"
                ? "#fdd835" // dark yellow
                : applicant.category === "Couple"
                ? "#fce4ec" // light pink
                : "#f3f4f6", // grey default
            borderRadius: "8px",
            padding: "16px",
            transition: "background-color 0.3s ease",
          }}
        >
          <div><label>{language === "en" ? "Token#" : "टोकन#"}</label><span>{screeningNumber}</span></div>
          <div><label>{language === "en" ? "Category" : "श्रेणी"}</label><span>{applicant.category}</span></div>
          <div><label>{language === "en" ? "Age" : "आयु"}</label><span>{applicant.age}</span></div>
          <div><label>{language === "en" ? "Name" : "नाम"}</label><span>{applicant.name}</span></div>
          <div><label>{language === "en" ? "Father's Name" : "पिता का नाम"}</label><span>{applicant.fatherName}</span></div>
          <div><label>{language === "en" ? "Marital Status" : "वैवाहिक स्थिति"}</label><span>{applicant.maritalStatus}</span></div>
          <div><label>{language === "en" ? "Occupation" : "पेशा"}</label><span>{applicant.occupation}</span></div>
          <div><label>{language === "en" ? "Area / Village" : "गांव/क्षेत्र"}</label><span>{applicant.area}</span></div>
          <div><label>{language === "en" ? "UID" : "यूआईडी"}</label><span>{applicant.uid}</span></div>
          <div><label>{language === "en" ? "Country" : "देश"}</label><span>{applicant.country}</span></div>
          <div><label>{language === "en" ? "State" : "राज्य"}</label><span>{applicant.state}</span></div>
          <div><label>{language === "en" ? "Tel. No." : "फोन"}</label><span>{applicant.phone}</span></div>
        </div>
      </div>

      {/* Questionnaire summary */}
      <div className="summary-section">
        <h3>{language === "en" ? "Questionnaire Summary" : "प्रश्नावली सारांश"}</h3>
        <div style={{ overflowX: "auto" }}>
          <table className="summary-table">
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th>{language === "en" ? "Question" : "प्रश्न"}</th>
                <th>{language === "en" ? "Answer" : "उत्तर"}</th>
                <th>{language === "en" ? "Comment" : "टिप्पणी"}</th>
                <th>{language === "en" ? "Tick OK" : "ठीक है"}</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, i) => {
                const label = language === "hi" ? (q.label_hi || q.label_en) : q.label_en;
                const answered = !!(answers && answers[i] && answers[i].toString().trim());
                const currentState = (checkOk && checkOk[i]) || "";
                  // (decisions && (decisions[i] === "OK" ? "OK" : 
                  //               decisions[i] === "NotOK" || decisions[i] === "Not OK" ? "NotOK" : ""));
                return (
                  <tr key={q.question_id ?? i}>
                    <td>{label}</td>
                    <td className={!answered ? "unanswered" : ""}>{answered ? answers[i] : ""}</td>
                    <td style={{ whiteSpace: "pre-wrap" }}>{comments && comments[i] ? comments[i] : ""}</td>
                    <td
                      style={{ textAlign: "center", cursor: responsesSaved ? "default" : "pointer" }}
                      onClick={() => { if (!responsesSaved) cycleState(i); }}
                    >
                      {currentState === "OK" && <img src={tickImg} alt="OK" style={{ width: 20, height: 20 }} />}
                      {currentState === "NotOK" && <img src={crossImg} alt="Not OK" style={{ width: 20, height: 20 }} />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Final Decision */}
      <div className="summary-section">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 750, color: "blue" }}>{language === "en" ? "Decision" : "निर्णय"}</span>

          <button
            disabled={decisionSaved}
            onClick={() => setFinalDecision("APPROVE")}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              fontWeight: 600,
              cursor: decisionSaved ? "not-allowed" : "pointer",
              backgroundColor: finalDecision === "APPROVE" ? "#22c55e" : "#d1d5db",
              color: finalDecision === "APPROVE" ? "#fff" : "#444",
            }}
          >APPROVE</button>

          <button
            disabled={decisionSaved}
            onClick={() => setFinalDecision("WAIT")}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              fontWeight: 600,
              cursor: decisionSaved ? "not-allowed" : "pointer",
              backgroundColor: finalDecision === "WAIT" ? "#ef4444" : "#d1d5db",
              color: finalDecision === "WAIT" ? "#fff" : "#444",
            }}
          >WAIT</button>

          <select
            disabled={decisionSaved}
            value={routeTo}
            onChange={(e) => { setFinalDecision("ROUTE"); setRouteTo(e.target.value); }}
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: finalDecision === "ROUTE" ? "#e0f2fe" : "#f3f4f6",
            }}
          >
            <option value="">Select Route To</option>
            <option value="H/I Block">H/I Block</option>
            <option value="Senior Screener">Senior Screener</option>
            <option value="HOD">HOD</option>
          </select>
        </div>

        <textarea
          rows={3}
          placeholder={language === "en" ? "Reason for decision" : "निर्णय का कारण"}
          value={decisionReason}
          onChange={(e) => setDecisionReason(e.target.value)}
          disabled={decisionSaved}
          style={{ marginTop: "10px", width: "100%" }}
        />

        <div className="button-group" style={{ marginTop: "12px", justifyContent: "center" }}>
          <button onClick={handleSave} disabled={saving || decisionSaved}>
            {saving ? "Saving..." : (decisionSaved ? "Saved" : "Save")}
          </button>
          <div style={{ marginLeft: 12 }}>
            {responsesSaved && !decisionSaved && <span style={{ color: "#0b74de" }}>Responses saved</span>}
            {decisionSaved && <strong style={{ color: "green" }}>
              Decision Saved: {finalDecision} {routeTo ? `→ ${routeTo}` : ""}
            </strong>}
          </div>
            {typeof onCloseSummary === "function" && (
              <button
                onClick={onCloseSummary}
                style={{ marginLeft: 12, padding: "6px 12px", borderRadius: "6px" }}
              >
                {language === "en" ? "Close" : "बंद करें"}
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
