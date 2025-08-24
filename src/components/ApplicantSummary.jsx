import React from 'react';
import questions from '../questions';
import tickImg from '../assets/tick.jpg';   // ✅ green tick image
import crossImg from '../assets/cross.jpg'; // ❌ red cross image

export default function ApplicantSummary({
  language,
  screeningNumber,
  applicant,
  answers,
  comments,
  decisions = [],        // defaults: "OK" | "Not OK" | ""
  checkOk,
  setCheckOk,            // summary override state: "OK" | "Not OK" | ""
  decisionReason,
  setDecisionReason,
  setDecision,
}) {
  // Click cycles: "" → "OK" → "Not OK" → ""
  const cycleState = (idx) => {
    setCheckOk(prev => {
      const updated = [...prev];
      const current = updated[idx] || '';
      if (current === '') updated[idx] = 'OK';
      else if (current === 'OK') updated[idx] = 'Not OK';
      else updated[idx] = '';
      return updated;
    });
  };

  return (
    <div className={`summary-container theme-${
        (applicant?.category || '').toLowerCase().replace(/\s+/g, '-')
      }`}>
      {/* Applicant Details */}
      <div className="summary-section">
        <h3>{language === 'en' ? 'Applicant Details' : 'आवेदक विवरण'}</h3>
        <div className="summary-applicant-grid">
          <div><label>{language === 'en' ? 'Token#' : 'स्टोकन#'}</label><span>{screeningNumber}</span></div>
          <div><label>{language === 'en' ? 'Category' : 'श्रेणी'}</label><span>{applicant.category}</span></div>
          <div><label>{language === 'en' ? 'Age' : 'आयु'}</label><span>{applicant.age}</span></div>
          <div><label>{language === 'en' ? 'Name' : 'नाम'}</label><span>{applicant.name}</span></div>
          <div><label>{language === 'en' ? "Father's Name" : 'पिता का नाम'}</label><span>{applicant.fatherName}</span></div>
          <div><label>{language === 'en' ? 'Marital Status' : 'वैवाहिक स्थिति'}</label><span>{applicant.maritalStatus}</span></div>
          <div><label>{language === 'en' ? 'Occupation' : 'पेशा'}</label><span>{applicant.occupation}</span></div>
          <div><label>{language === 'en' ? 'Area / Village' : 'गांव/क्षेत्र'}</label><span>{applicant.area}</span></div>
          <div><label>{language === 'en' ? 'UID' : 'यूआईडी'}</label><span>{applicant.uid}</span></div>
          <div><label>{language === 'en' ? 'Country' : 'देश'}</label><span>{applicant.country}</span></div>
          <div><label>{language === 'en' ? 'State' : 'राज्य'}</label><span>{applicant.state}</span></div>
          <div><label>{language === 'en' ? 'Tel. No.' : 'फोन'}</label><span>{applicant.phone}</span></div>
        </div>
      </div>

      {/* Questionnaire Summary Table */}
      <div className="summary-section">
        <h3>{language === 'en' ? 'Questionnaire Summary' : 'प्रश्नावली सारांश'}</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="summary-table">
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th>{language === 'en' ? 'Question' : 'प्रश्न'}</th>
                <th>{language === 'en' ? 'Answer' : 'उत्तर'}</th>
                <th>{language === 'en' ? 'Comment' : 'टिप्पणी'}</th>
                <th>{language === 'en' ? 'Tick OK' : 'ठीक है'}</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, i) => {
                const answered = !!(answers[i] && answers[i].trim());

                // Decide what to show: summary override or default from decisions
                const currentState = checkOk[i] || (decisions[i] === 'OK' ? 'OK' : decisions[i] === 'Not OK' ? 'Not OK' : '');

                return (
                  <tr key={i}>
                    <td>{language === 'en' ? q.label : q.labelHi}</td>

                    <td className={!answered ? 'unanswered' : ''}>
                      {answered ? answers[i] : ''}
                    </td>

                    <td style={{ whiteSpace: 'pre-wrap' }}>{comments[i] || ''}</td>

                    <td style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => cycleState(i)}>
                      {currentState === 'OK' && <img src={tickImg} alt="OK" style={{ width: 20, height: 20 }} />}
                      {currentState === 'Not OK' && <img src={crossImg} alt="Not OK" style={{ width: 20, height: 20 }} />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Age Verified Section */}
      <div className="summary-section">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '12px'
          }}
        >
          {/* Age Verified Label & Options */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 600, color: 'black' }}>
              {language === 'en' ? 'AGE VERIFIED' : 'आयु सत्यापित'}
            </span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input type="radio" name="ageVerified" value="OK" />
              OK
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input type="radio" name="ageVerified" value="Verified" />
              {language === 'en' ? 'Verified' : 'सत्यापित'}
            </label>
          </div>

          {/* DOB Document Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 600, color: 'black' }}>
              {language === 'en' ? 'DOB Document' : 'जन्म तिथि दस्तावेज'}
            </span>
            <select>
              <option value="">{language === 'en' ? 'Select the document' : 'दस्तावेज़ चुनें'}</option>
              <option value="Aadhar">{language === 'en' ? 'Aadhar Card' : 'आधार कार्ड'}</option>
              <option value="Passport">{language === 'en' ? 'Passport' : 'पासपोर्ट'}</option>
              <option value="BirthCertificate">{language === 'en' ? 'Birth Certificate' : 'जन्म प्रमाण पत्र'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Final Decision Section */}
      <div className="summary-section">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          {/* Decision Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 750, color: 'blue' }}>
              {language === 'en' ? 'Decision' : 'निर्णय'}
            </span>
            <button
              className="btn-approve"
              onClick={() => setDecision('Approve')}
              style={{
                padding: '4px 10px',
                backgroundColor: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              APPROVE
            </button>
            <button
              className="btn-wait"
              onClick={() => setDecision('Wait')}
              style={{
                padding: '4px 10px',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              WAIT
            </button>
          </div>

          {/* Route To Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 750, color: 'blue' }}>
              {language === 'en' ? 'Route To' : 'मार्ग निर्देश'}
            </span>
            <select
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
              onChange={(e) => console.log('Route to:', e.target.value)} // replace with setRouteTo
            >
              <option value="Select Route To">Select Route To</option>
              <option value="H/I Block">H/I Block</option>
              <option value="Senior Screener">Senior Screener</option>
              <option value="HOD">HOD</option>
            </select>
          </div>
        </div>

        {/* Reason Textarea */}
        <textarea
          rows={3}
          placeholder={language === 'en' ? 'Reason for decision' : 'निर्णय का कारण'}
          value={decisionReason}
          onChange={(e) => setDecisionReason(e.target.value)}
          style={{ marginTop: '10px', width: '100%' }}
        />
        {/* Additional Comments */}
        <textarea
          rows={3}
          placeholder={language === 'en' ? 'Additional comments' : 'अतिरिक्त टिप्पणियाँ'}
          style={{ marginTop: '10px', width: '100%' }}
          onChange={(e) => console.log('Comments:', e.target.value)} 
        />
        {/* Save and Close Buttons */}
        <div className="button-group" style={{ marginTop: '12px', justifyContent: 'center'}}>
          <button onClick={() => console.log('Save clicked')}>
            {language === 'en' ? 'Save' : 'सहेजें'}
          </button>
          <button onClick={() => console.log('Close clicked')}>
            {language === 'en' ? 'Close' : 'बंद करें'}
          </button>
        </div>
      </div>
    </div>
  );
}
