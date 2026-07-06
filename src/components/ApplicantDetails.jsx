// src/components/ApplicantDetails.jsx
import React from "react";
import AppHeader from "./AppHeader";

export default function ApplicantDetails({
  applicant,
  setApplicant,
  screeningNumber,
  setScreeningNumber,
  handleFetchApplicant,
  onSave,
  onCancel,
  nextStep,
  sessionId,
  mode = "screening", // "dataentry" | "screening"
}) {
  return (
    <>
      <AppHeader
        title="Applicant Details"
        user={mode === "dataentry" ? "Data Entry" : "Screener"}
        sessionCode={sessionId}
        onLogoClick={() => window.location.reload()} // or pass setScreen('welcome') from App.jsx
      />

      <div
        className="applicant-details-box"
        style={{
          backgroundColor:
            applicant.category === "Female"
              ? "#fdd835" // light yellow
              : applicant.category === "Couple"
              ? "#fce4ec" // light pink
              : "#f3f4f6", // grey (default)
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        {/* Header Row: Category + Token */}
        <div className="applicant-header-row">
          <div className="field-group">
            <label>Token#</label>
            <div className="token-input-group">
              <input
                value={screeningNumber || ""}
                readOnly={mode === "dataentry"} // ✅ only readonly in dataentry
                onChange={
                  mode === "screening"
                    ? (e) => setScreeningNumber(e.target.value)
                    : undefined
                }
              />
              {mode === "screening" && (
                <button type="button" onClick={handleFetchApplicant}>
                  GO
                </button>
              )}
            </div>
          </div>
          <div className="field-group">
            <label>Category</label>
            <select
              value={applicant.category || ""}
              onChange={(e) =>
                setApplicant((prev) => ({ ...prev, category: e.target.value }))
              }
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Couple</option>
            </select>
          </div>
        </div>

        {/* Applicant Fields */}
        <div className="applicant-grid">
          <div className="field-group">
            <label>Name</label>
            <input
              value={applicant.name || ""}
              onChange={(e) =>
                setApplicant((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          {applicant.category === "Couple" && (
            <div className="field-group">
              <label>Spouse Name</label>
              <input
                value={applicant.spouseName || ""}
                onChange={(e) =>
                  setApplicant((prev) => ({
                    ...prev,
                    spouseName: e.target.value,
                  }))
                }
              />
            </div>
          )}

          <div className="field-group">
            <label>Father's Name</label>
            <input
              value={applicant.fatherName || ""}
              onChange={(e) =>
                setApplicant((prev) => ({ ...prev, fatherName: e.target.value }))
              }
            />
          </div>

          <div className="field-group">
            <label>Country</label>
            <input
              value={applicant.country || ""}
              onChange={(e) =>
                setApplicant((prev) => ({ ...prev, country: e.target.value }))
              }
            />
          </div>

          <div className="field-group">
            <label>State</label>
            <input
              value={applicant.state || ""}
              onChange={(e) =>
                setApplicant((prev) => ({ ...prev, state: e.target.value }))
              }
            />
          </div>

          <div className="field-group">
            <label>Phone</label>
            <input
              value={applicant.phone || ""}
              onChange={(e) =>
                setApplicant((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>

          <div className="field-group">
            <label>Age</label>
            <input
              type="number"
              value={applicant.age || ""}
              onChange={(e) =>
                setApplicant((prev) => ({ ...prev, age: e.target.value }))
              }
            />
          </div>

          <div className="field-group">
            <label>Marital Status</label>
            <select
              value={applicant.maritalStatus || ""}
              onChange={(e) =>
                setApplicant((prev) => ({
                  ...prev,
                  maritalStatus: e.target.value,
                }))
              }
            >
              <option value="">Select</option>
              <option>Single</option>
              <option>Married</option>
              <option>Divorced</option>
              <option>Widowed</option>
            </select>
          </div>

          <div className="field-group">
            <label>Occupation</label>
            <select
              value={applicant.occupation || ""}
              onChange={(e) =>
                setApplicant((prev) => ({
                  ...prev,
                  occupation: e.target.value,
                }))
              }
            >
              <option value="">Select</option>
              <option>Business</option>
              <option>Military</option>
              <option>Service</option>
              <option>Other</option>
            </select>
          </div>

          <div className="field-group">
            <label>Village/Area</label>
            <input
              value={applicant.area || ""}
              onChange={(e) =>
                setApplicant((prev) => ({ ...prev, area: e.target.value }))
              }
            />
          </div>

          <div className="field-group">
            <label>UID</label>
            <input
              value={applicant.uid || ""}
              onChange={(e) =>
                setApplicant((prev) => ({ ...prev, uid: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div style={{ marginTop: 20 }}>
        {mode === "dataentry" && (
          <>
            <button type="button" onClick={onSave}>
              Save
            </button>
            <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>
              Cancel
            </button>
          </>
        )}

        {mode === "screening" && (
          <>
            <button type="button" onClick={onSave}>
              Save
            </button>
            <button type="button" onClick={onCancel} style={{ marginLeft: 10 }}>
              Cancel
            </button>
            <button type="button" onClick={nextStep} style={{ marginLeft: 10 }}>
              Next
            </button>
          </>
        )}
      </div>
    </>
  );
}
