// src/components/ScreeningQuestions.jsx
import React from 'react';
import questions from '../questions';

export default function ScreeningQuestions({
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
  decisions = [],
  setDecisions,
}) {
  const q = questions[step - 1];
  if (!q) {
    return (
      <div>
        <p style={{ color: 'red' }}>Invalid question step. Please go back.</p>
        {step > 1 && <button onClick={() => goToStep(1)}>Go to Question 1</button>}
      </div>
    );
  }

  const setDecisionAt = (val) => {
    if (!setDecisions) return;
    setDecisions((prev) => {
      const copy = Array.isArray(prev) ? [...prev] : [];
      copy[step - 1] = val; // "OK" or "Not OK"
      return copy;
    });
  };

  return (
    <div>
      {/* Header chips (Q2 onward) */}
      {step >= 2 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          {questions.slice(1).map((item, i) => {
            const qStep = i + 2; // Q2 onward
            const labelText = language === 'en' ? item.label : item.labelHi;
            const isMarked = (decisions[qStep - 1] || '') === 'OK' || (decisions[qStep - 1] || '') === 'Not OK';

            const bg = isMarked ? '#22c55e' : '#d1d5db';
            const fg = isMarked ? '#ffffff' : '#111111';
            const border = isMarked ? '#22c55e' : '#9ca3af';

            return (
              <div
                key={qStep}
                role="button"
                tabIndex={0}
                onClick={() => goToStep(qStep)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') goToStep(qStep);
                }}
                style={{
                  display: 'inline-block',
                  backgroundColor: bg,
                  color: fg,
                  border: `1px solid ${border}`,
                  borderRadius: '9999px',
                  padding: '6px 10px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  userSelect: 'none',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                }}
                title={`Go to Question ${qStep}`}
              >
                {labelText}
              </div>
            );
          })}
        </div>
      )}

      {/* Current question */}
      <h3>{language === 'en' ? `Question ${step}` : `प्रश्न ${step}`}</h3>
      <p><strong>{language === 'en' ? q.label : q.labelHi}</strong></p>

      {/* Options (one per line) */}
      {q.options.map((opt, i) => {
        const labelText = language === 'en' ? opt.en : opt.hi;
        return (
          <div key={i} className="option-row">
            <label className="option-label">
              <input
                type="radio"
                name={`question-${step}`}
                value={opt.en}
                checked={answers[step - 1] === opt.en}
                onChange={() => {
                  const updated = [...answers];
                  updated[step - 1] = opt.en;
                  setAnswers(updated);
                }}
              />
              <span className="option-text">{labelText}</span>
            </label>
          </div>
        );
      })}

      {/* Decision (moved BELOW options, single line) */}
      <div
        className="decision-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          marginTop: '18px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontWeight: 700 }}>
          {language === 'en' ? 'Decision' : 'निर्णय'}:
        </span>
        <button
          type="button"
          onClick={() => setDecisionAt('OK')}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #ccc',
            background: decisions[step - 1] === 'OK' ? '#22c55e' : '#f3f4f6',
            color: decisions[step - 1] === 'OK' ? '#fff' : '#111',
            cursor: 'pointer',
          }}
        >
          OK
        </button>
        <button
          type="button"
          onClick={() => setDecisionAt('Not OK')}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid #ccc',
            background: decisions[step - 1] === 'Not OK' ? '#ef4444' : '#f3f4f6',
            color: decisions[step - 1] === 'Not OK' ? '#fff' : '#111',
            cursor: 'pointer',
          }}
        >
          Not OK
        </button>
      </div>

      {/* Comment box */}
      <div style={{ marginTop: '10px' }}>
        <label>
          {language === 'en' ? 'Comment (optional)' : 'टिप्पणी (ऐच्छिक)'}
          <textarea
            rows="2"
            style={{ width: '100%', marginTop: '5px' }}
            value={comments[step - 1] || ''}
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
              const a0 = (answers[0] || '').trim().toLowerCase();
              if (a0 === 'yes') {
                openSummaryFrom(step); // jump to Summary
              } else {
                nextStep(); // go to Question 2
              }
            }}
          >
            {step === questions.length ? 'Finish' : 'Next'}
          </button>
        </div>
      )}

      {step >= 2 && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => openSummaryFrom(step)}>
            {language === 'en' ? 'Summary' : 'सारांश'}
          </button>
        </div>
      )}
    </div>
  );
}
