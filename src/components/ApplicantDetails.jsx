import React from 'react';

export default function ApplicantDetails({
  applicant,
  setApplicant,
  screeningNumber,
  setScreeningNumber,
  handleFetchApplicant,
  nextStep
}) {
  return (
    <>
      <h2>Applicant Details</h2>
      <div className="applicant-details-box">
        {/* Header Row: Category + Token */}
        <div className="applicant-header-row">
          <div className="field-group">
            <label>Category</label>
            <select
              value={applicant.category}
              onChange={e => setApplicant(prev => ({ ...prev, category: e.target.value }))}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Couple</option>
            </select>
          </div>

          <div className="field-group">
            <label>Token#</label>
            <div className="token-input-group">
              <input
                value={screeningNumber}
                onChange={(e) => setScreeningNumber(e.target.value)}
              />
              <button onClick={handleFetchApplicant}>GO</button>
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
            <select
              value={applicant.maritalStatus}
              onChange={e => setApplicant(prev => ({ ...prev, maritalStatus: e.target.value }))}
            >
              <option>Single</option>
              <option>Married</option>
              <option>Divorced</option>
              <option>Widowed</option>
            </select>
          </div>

          <div className="field-group">
            <label>Occupation</label>
            <select
              value={applicant.occupation}
              onChange={e => setApplicant(prev => ({ ...prev, occupation: e.target.value }))}
            >
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

      <button onClick={nextStep}>Next</button>
    </>
  );
}
