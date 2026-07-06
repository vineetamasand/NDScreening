// src/components/ScreeningQuestions.jsx
import React from "react";

export default function ScreeningQuestions({
  questions = [],
  step,
  language,
  answers,
  setAnswers,
  comments,
  setComments,
  nextStep,
  prevStep,
  goToStep,
  openSummaryFrom,
  checkOk = [],      // ✅ use checkOk instead of decisions
  setCheckOk,
}) {
  const q = questions[step - 1];

  if (!q) {
    return (
      <div>
        <p style={{ color: "red" }}>Invalid question step. Please go back.</p>
        {step > 1 && <button onClick={() => goToStep(1)}>Go to Question 1</button>}
      </div>
    );
  }

  const setCheckOkAt = (val) => {
    if (!setCheckOk) return;
    setCheckOk((prev) => {
      const copy = Array.isArray(prev) ? [...prev] : [];
      copy[step - 1] = val; // "OK" or "NotOK"
      return copy;
    });
  };

  // derive label + options
  const label = language === "hi" ? (q.label_hi || q.label_en) : q.label_en;
  const options = language === "hi" ? (q.options_hi || q.options_en) : q.options_en;
  const optionsEn = q.options_en || [];

  return (
    <div>
      {/* Header chips */}
      {step >= 2 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
          {questions.slice(1).map((item, i) => {
            const qStep = i + 2;
            const chipLabel = language === "hi" ? (item.label_hi || item.label_en) : item.label_en;
            const isMarked = checkOk[qStep - 1] === "OK" || checkOk[qStep - 1] === "NotOK";

            const bg = isMarked ? "#22c55e" : "#d1d5db";
            const fg = isMarked ? "#ffffff" : "#111111";
            const border = isMarked ? "#22c55e" : "#9ca3af";

            return (
              <div
                key={qStep}
                role="button"
                tabIndex={0}
                onClick={() => goToStep(qStep)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") goToStep(qStep);
                }}
                style={{
                  display: "inline-block",
                  backgroundColor: bg,
                  color: fg,
                  border: `1px solid ${border}`,
                  borderRadius: "9999px",
                  padding: "6px 10px",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  userSelect: "none",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                }}
                title={`Go to Question ${qStep}`}
              >
                {chipLabel}
              </div>
            );
          })}
        </div>
      )}

      {/* Current question */}
      <h3>{language === "en" ? `Question ${step}` : `प्रश्न ${step}`}</h3>
      <p>
        <strong>{label}</strong>
      </p>

      {/* Options */}
      {(options || []).map((optText, i) => {
        const displayText = optText;
        const storedEnglish = optionsEn[i] ?? optText;
        return (
          <div key={i} className="option-row">
            <label className="option-label">
              <input
                type="radio"
                name={`question-${step}`}
                value={storedEnglish}
                checked={answers[step - 1] === storedEnglish}
                onChange={() => {
                  const updated = [...answers];
                  updated[step - 1] = storedEnglish;
                  setAnswers(updated);
                }}
              />
              <span className="option-text">{displayText}</span>
            </label>
          </div>
        );
      })}

      {/* Decision buttons */}
      <div
        className="decision-row"
        style={{ display: "flex", alignItems: "center", gap: "18px", marginTop: "18px", flexWrap: "wrap" }}
      >
        <span style={{ fontWeight: 700 }}>
          {language === "en" ? "Decision" : "निर्णय"}:
        </span>
        <button
          type="button"
          onClick={() => setCheckOkAt("OK")}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            background: checkOk[step - 1] === "OK" ? "#22c55e" : "#f3f4f6",
            color: checkOk[step - 1] === "OK" ? "#fff" : "#111",
            cursor: "pointer",
          }}
        >
          OK
        </button>
        <button
          type="button"
          onClick={() => setCheckOkAt("NotOK")}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #ccc",
            background: checkOk[step - 1] === "NotOK" ? "#ef4444" : "#f3f4f6",
            color: checkOk[step - 1] === "NotOK" ? "#fff" : "#111",
            cursor: "pointer",
          }}
        >
          Not OK
        </button>
      </div>

      {/* Comment box */}
      <div style={{ marginTop: "10px" }}>
        <label>
          {language === "en" ? "Comment (optional)" : "टिप्पणी (ऐच्छिक)"}
          <textarea
            rows="2"
            style={{ width: "100%", marginTop: "5px" }}
            value={comments[step - 1] || ""}
            onChange={(e) => {
              const updated = [...comments];
              updated[step - 1] = e.target.value;
              setComments(updated);
            }}
          />
        </label>
      </div>

      {/* Navigation */}
      {step === 1 && (
        <div className="button-group">
          <button
            onClick={() => {
              const a0 = (answers[0] || "").trim().toLowerCase();
              if (a0 === "yes") {
                openSummaryFrom(step);
              } else {
                nextStep();
              }
            }}
          >
            {step === questions.length ? "Finish" : "Next"}
          </button>
        </div>
      )}

      {step >= 2 && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => openSummaryFrom(step)}>
            {language === "en" ? "Summary" : "सारांश"}
          </button>
        </div>
      )}
    </div>
  );
}
