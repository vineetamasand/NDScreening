import React, { useState } from 'react';
import logo from './assets/RSSB.png';
import questions from './questions';
import './index.css';

const mockData = {
  '216': {
    name: 'RAVINDER SHARMA',
    fatherName: 'SURESH SHARMA',
    category: 'Male',
    age: '26',
    maritalStatus: 'Married',
    occupation: 'Business',
    country: 'India',
    state: 'Maharashtra',
    area: 'Jangoan',
    phone: '9868123456 / 9892498765',
    uid: '123456987023'
  }
};

const thStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  textAlign: 'left',
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '8px',
  border: '1px solid #ccc',
  verticalAlign: 'top',
};

function App() {
  const [step, setStep] = useState(0); // 0 = Applicant details, 1+ = Questions
  const [language, setLanguage] = useState('en');
  const [screeningNumber, setScreeningNumber] = useState('');
  const [applicant, setApplicant] = useState({
    name: '',
    fatherName: '',
    category: 'Male',
    age: '',
    maritalStatus: 'Single',
    occupation: '',
    country: 'India',
    state: '',
    area: '',
    phone: '',
    uid: ''
  });
  
  const [checkOk, setCheckOk] = useState(Array(questions.length).fill(false));
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [comments, setComments] = useState(Array(questions.length).fill(''));
  const [decisionReason, setDecisionReason] = useState('');

  const handleFetchApplicant = () => {
    if (mockData[screeningNumber]) {
      setApplicant(mockData[screeningNumber]);
    } else {
      alert('No applicant found for this screening number.');
    }
  };

  const handleChange = (e) => {
    const updated = [...answers];
    updated[step - 1] = e.target.value;
    setAnswers(updated);
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };
  

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const renderApplicantDetails = () => (
    <div className="applicant-details-box">
  
      {/* Header Row: Category + Screening No */}
      <div className="applicant-header-row">
        <div className="field-group" style={{ flex: 1, marginRight: '12px' }}>
          <label>Category</label>
          <select
            value={applicant.category}
            onChange={e => setApplicant(prev => ({ ...prev, category: e.target.value }))}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
  
        <div className="field-group" style={{ flex: 2 }}>
          <label>Token#</label>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <input
              style={{ maxWidth: '100px' }}
              value={screeningNumber}
              onChange={(e) => setScreeningNumber(e.target.value)}
            />
            <button
              onClick={handleFetchApplicant}
              style={{ padding: '6px 6px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
            >
              GO
            </button>
          </div>
        </div>
      </div>
  
      {/* Applicant Fields */}
      <div className="applicant-grid">
        <div className="field-group">
          <label>Name</label>
          <input value={applicant.name} onChange={e => setApplicant(prev => ({ ...prev, name: e.target.value }))} />
        </div>
  
        <div className="field-group">
          <label>Father's Name</label>
          <input value={applicant.fatherName} onChange={e => setApplicant(prev => ({ ...prev, fatherName: e.target.value }))} />
        </div>
  
        <div className="field-group">
          <label>Country</label>
          <input value={applicant.country} onChange={e => setApplicant(prev => ({ ...prev, country: e.target.value }))} />
        </div>
  
        <div className="field-group">
          <label>State</label>
          <input value={applicant.state} onChange={e => setApplicant(prev => ({ ...prev, state: e.target.value }))} />
        </div>
  
        <div className="field-group">
          <label>Phone</label>
          <input value={applicant.phone} onChange={e => setApplicant(prev => ({ ...prev, phone: e.target.value }))} />
        </div>
  
        <div className="field-group">
          <label>Age</label>
          <input value={applicant.age} onChange={e => setApplicant(prev => ({ ...prev, age: e.target.value }))} />
        </div>
  
        <div className="field-group">
          <label>Marital Status</label>
          <select value={applicant.maritalStatus} onChange={e => setApplicant(prev => ({ ...prev, maritalStatus: e.target.value }))}>
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
            <option>Widowed</option>
          </select>
        </div>
  
        <div className="field-group">
          <label>Occupation</label>
          <select value={applicant.occupation} onChange={e => setApplicant(prev => ({ ...prev, occupation: e.target.value }))}>
            <option>Business</option>
            <option>Military</option>
            <option>Service</option>
            <option>Other</option>
          </select>
        </div>
  
        <div className="field-group">
          <label>Village/Area</label>
          <input value={applicant.area} onChange={e => setApplicant(prev => ({ ...prev, area: e.target.value }))} />
        </div>
  
        <div className="field-group">
          <label>UID</label>
          <input value={applicant.uid} onChange={e => setApplicant(prev => ({ ...prev, uid: e.target.value }))} />
        </div>
      </div>
    </div>
  );
  

  const renderSummary = () => (
    <div className="summary-container">
  
      {/* Applicant Detail Section */}
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
              {questions.map((q, i) => (
                <tr key={i}>
                  <td>{language === 'en' ? q.label : q.labelHi}</td>
                  <td>{answers[i] || '-'}</td>
                  <td style={{ whiteSpace: 'pre-wrap' }}>{comments[i] || '-'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={checkOk[i]}
                      onChange={(e) => {
                        const updated = [...checkOk];
                        updated[i] = e.target.checked;
                        setCheckOk(updated);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  
      {/* Decision Section */}
      <div className="summary-section">
        <h3>{language === 'en' ? 'Final Decision' : 'अंतिम निर्णय'}</h3>
        <div className="button-decision">
        <button className="btn-approve" onClick={() => setDecision('Approve')}>Approve</button>
        <button className="btn-wait" onClick={() => setDecision('Wait')}>Wait</button>
        <button className="btn-refer" onClick={() => alert('Routing...')}>Refer to Senior Screener</button>
        </div>
  
        <textarea
          rows={3}
          placeholder={language === 'en' ? 'Reason for decision' : 'निर्णय का कारण'}
          value={decisionReason}
          onChange={(e) => setDecisionReason(e.target.value)}
        />
        
      </div>
    </div>
  );


  return (
    <>
      {/* Fixed Header - stays on top */}
      <div className="app-header">
        <img src={logo} alt="RSSB Logo" className="app-logo" />
        <h1 className="app-title">NaamDaan Screening</h1>
      </div>
  
      {/* Main scrollable content, offset from fixed header */}
      <div className="app-content" style={{
        padding: '12px',
        fontFamily: 'Arial',
        fontSize: '1rem',
        maxWidth: '100%',
        overflowX: 'hidden',
        marginTop: '60px'  // ⚠️ Match the header height
      }}>
        {/* Language Toggle */}
        <div style={{marginBottom: '10px' }}>
          <button onClick={() => setLanguage('en')} disabled={language === 'en'}>English</button>
          <button onClick={() => setLanguage('hi')} disabled={language === 'hi'} style={{ marginLeft: '10px' }}>हिंदी</button>
        </div>
  
        {/* Step 0: Applicant Details */}
        {step === 0 && (
          <>
            <h2>Applicant Details</h2>
            {renderApplicantDetails()}
            <button onClick={nextStep}>Next</button>
          </>
        )}
  
        {/* Step 1-N: Questions */}
        {step > 0 && step <= questions.length && (
          <div>
            <h3>{language === 'en' ? `Question ${step}` : `प्रश्न ${step}`}</h3>
            <p><strong>{language === 'en' ? questions[step - 1].label : questions[step - 1].labelHi}</strong></p>
  
            {questions[step - 1].options.map((opt, i) => (
              <label key={i} style={{ display: 'block', marginBottom: '8px' }}>
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
                {language === 'en' ? opt.en : opt.hi}
              </label>
            ))}
  
            <div style={{ marginTop: '10px' }}>
              <label>
                {language === 'en' ? 'Comment (optional)' : 'टिप्पणी (ऐच्छिक)'}
                <textarea
                  rows="2"
                  style={{ width: '100%', marginTop: '5px' }}
                  value={comments[step - 1]}
                  onChange={(e) => {
                    const updated = [...comments];
                    updated[step - 1] = e.target.value;
                    setComments(updated);
                  }}
                />
              </label>
            </div>
  
            <div className="button-group">
              {step > 1 && <button onClick={prevStep}>Previous</button>}
              <button onClick={nextStep}>{step === questions.length ? 'Finish' : 'Next'}</button>
            </div>
          </div>
        )}
  
        {/* Step N+1: Summary */}
        {step === questions.length + 1 && renderSummary()}
      </div>
    </>
  );
}

export default App;
