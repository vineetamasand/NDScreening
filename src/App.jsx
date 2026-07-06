// src/App.jsx
import React, { useState, useEffect } from 'react';
import logo from './assets/RSSB.png';
import './index.css';

import WelcomeScreeningModule from './components/WelcomeScreeningModule.jsx';
import WelcomeScreeningLogin from './components/WelcomeScreeningLogin.jsx';
import ScreeningLevel1Home from './components/ScreeningLevel1Home.jsx';
import ApplicantDetails from './components/ApplicantDetails.jsx';
import ScreeningQuestions from './components/ScreeningQuestions.jsx';
import ApplicantSummary from './components/ApplicantSummary.jsx';

import dataService from './data/dataService';

export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [sessionCd, setSessionCd] = useState(null);
  const [user, setUser] = useState(null);
  const [applicantId, setApplicantId] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [qError, setQError] = useState('');

  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState('en');
  const [screeningNumber, setScreeningNumber] = useState('');

  const emptyApplicant = {
    name: '',
    fatherName: '',
    spouseName: '',
    category: 'Male',
    age: '',
    maritalStatus: 'Single',
    occupation: '',
    country: 'India',
    state: '',
    area: '',
    phone: '',
    uid: '',
  };

  const [applicant, setApplicant] = useState(emptyApplicant);

  // const [decisions, setDecisions] = useState([]);   // per-question decisions
  const [answers, setAnswers] = useState([]);
  const [comments, setComments] = useState([]);
  const [checkOk, setCheckOk] = useState([]);
  const [decisionReason, setDecisionReason] = useState('');
  const [lastQuestionStep, setLastQuestionStep] = useState(1);

  const [finalDecision, setFinalDecision] = useState('');  // APPROVE | WAIT | ROUTE
  const [routeTo, setRouteTo] = useState('');

  const [newToken, setNewToken] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch session_cd once at app start
  useEffect(() => {
    (async () => {
      try {
        const cd = await dataService.getSessionCd();
        setSessionCd(cd);
      } catch (err) {
        console.error("Failed to load session_cd", err);
        setQError("Could not fetch session_cd from server");
      }
    })();
  }, []);

  // Load questions from backend
  useEffect(() => {
    (async () => {
      try {
        const qs = await dataService.getQuestions();
        setQuestions(qs || []);
      } catch (err) {
        console.error(err);
        setQError(String(err));
      }
    })();
  }, []);

  // Reset arrays when questions change
  useEffect(() => {
    if (questions.length > 0) {
      // setDecisions(Array(questions.length).fill(''));
      setAnswers(Array(questions.length).fill(''));
      setComments(Array(questions.length).fill(''));
      setCheckOk(Array(questions.length).fill(null));
    }
  }, [questions]);

  const TOTAL_QUESTIONS = questions.length;

  const nextStep = () => setStep((s) => Math.min(s + 1, TOTAL_QUESTIONS + 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));
  const goToStep = (n) => setStep(Math.max(1, Math.min(n, TOTAL_QUESTIONS)));
  const openSummaryFrom = (fromStep) => {
    setLastQuestionStep(Math.max(1, Math.min(fromStep, TOTAL_QUESTIONS)));
    setStep(TOTAL_QUESTIONS + 1);
  };
  const returnToLastQuestion = () => setStep(lastQuestionStep);

  // Reset everything for a new entry
  const resetApplicantState = () => {
    setApplicant(emptyApplicant);
    setApplicantId(null);
    setAnswers([]);
    setComments([]);
    // setDecisions([]);
    setCheckOk([]);
    setDecisionReason('');
    setFinalDecision('');
    setRouteTo('');
  };

  // Data Entry: Save applicant
  const handleSaveApplicant = async () => {
    try {
      if (!sessionCd) {
        alert("Session not loaded yet.");
        return;
      }

      const resp = await dataService.createTokenAndApplicant(sessionCd, applicant);

      if (resp) {
        setNewToken(resp.token_no || null);
        setApplicantId(resp.applicant_id ?? resp.applicantId ?? null);
        setShowSuccess(true);
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert('Failed to save applicant: ' + (err.message || err));
    }
  };

  // Screening: fetch existing applicant by token
  const handleFetchApplicant = async () => {
    try {
      const data = await dataService.getApplicantDetails(screeningNumber);
      if (!data) {
        alert('No applicant found for this screening number.');
        return;
      }

      let app = null;
      if (Array.isArray(data.applicants) && data.applicants.length > 0) {
        app = data.applicants[0];
      } else if (data.applicant_id || data.applicant_nm) {
        app = data;
      } else {
        app = data.applicant || null;
      }

      if (!app) {
        alert('No applicant found for this screening number.');
        return;
      }

      setApplicant({
        name: app.applicant_nm || app.name || "",
        fatherName: app.father_nm || app.fatherName || "",
        spouseName: app.spouse_nm || app.spouseName || "",
        category: app.category || "",
        age: app.dob ? new Date().getFullYear() - new Date(app.dob).getFullYear() : (app.age ?? ""),
        maritalStatus: app.marital_status || app.maritalStatus || "",
        occupation: app.occupation || "",
        country: app.country || "",
        state: app.state || "",
        area: app.village || app.area || "",
        phone: app.phone_no || app.phone || "",
        uid: app.uid || "",
      });

      setApplicantId(app.applicant_id ?? app.applicantId ?? null);
      prefillResponsesAndDecision(app);
    } catch (err) {
      console.error(err);
      alert('Error fetching applicant details.');
    }
  };

  const startFlowWithToken = async (token) => {
    if (!token?.trim()) return;
    setScreeningNumber(token.trim());
    try {
      const data = await dataService.getApplicantDetails(token.trim());

      if (data && data.applicants && data.applicants.length > 0) {
        const app = data.applicants[0];
        setApplicant({
          name: app.applicant_nm || "",
          fatherName: app.father_nm || "",
          spouseName: app.spouse_nm || "",
          category: app.category || "",
          age: app.dob ? new Date().getFullYear() - new Date(app.dob).getFullYear() : "",
          maritalStatus: app.marital_status || "",
          occupation: app.occupation || "",
          country: app.country || "",
          state: app.state || "",
          area: app.village || "",
          phone: app.phone_no || "",
          uid: app.uid || "",
        });
        setApplicantId(app.applicant_id || null);
        prefillResponsesAndDecision(app);
      } else {
        alert("No applicant found for this token.");
        return;
      }

      setStep(0);
      setScreen("flow");
    } catch (err) {
      console.error("Error fetching applicant for token", err);
      alert("Failed to load applicant details.");
    }
  };

  const prefillResponsesAndDecision = (app) => {
    if (questions.length > 0 && app.responses && app.responses.length > 0) {
      const answersArr = Array(questions.length).fill("");
      const commentsArr = Array(questions.length).fill("");
      // const decisionsArr = Array(questions.length).fill("");
      const checkOkArr = Array(questions.length).fill("");
  
      // Map DB responses into correct index by question_id
      app.responses.forEach((r) => {
        const idx = questions.findIndex((q) => q.question_id === r.question_id);
        if (idx >= 0) {
          answersArr[idx] = r.response || "";
          commentsArr[idx] = r.comment || "";
          // decisionsArr[idx] = r.decision || "";
          checkOkArr[idx] =
            r.decision === "OK" ? "OK" :
            r.decision === "NotOK" ? "NotOK" : "";
            r.decision === "Not OK" ? "NotOK" : "";
            r.decision === "NOTOK" ? "NotOK" : "";
        }
      });
  
      setAnswers(answersArr);
      setComments(commentsArr);
      // setDecisions(decisionsArr);
      setCheckOk(checkOkArr);
    }
  
    // Final decision
    if (app.final_decision) {
      setDecisionReason(app.final_decision.reason || "");
      setFinalDecision(app.final_decision.final_decision || "");
      setRouteTo(app.final_decision.additional_comments || "");
    } else {
      setDecisionReason('');
      setFinalDecision('');
      setRouteTo('');
    }
  };
  

  if (qError) {
    return <div style={{ color: 'red', padding: 20 }}>Failed to load questions: {qError}</div>;
  }

  return (
    <>
      {/* <div className="app-header" style={{ cursor: "pointer" }} onClick={() => setScreen('welcome')}>
        <img src={logo} alt="RSSB Logo" className="app-logo" />
        <h1 className="app-title">NaamDaan Screening</h1>
      </div> */}
      <div className="app-header" style={{ cursor: "pointer" }} onClick={() => setScreen('welcome')}>
      <div className="app-header-left">
        <img src={logo} alt="RSSB Logo" className="app-logo" />
        <h1 className="app-title">NaamDaan Screening</h1>
        </div>
      </div>

      {screen === 'flow' && (
        <div className="toolbar-below">
          {/* Back button only on summary */}
          {screen === 'flow' && step === TOTAL_QUESTIONS + 1 && (
            <button onClick={() => setStep(lastQuestionStep)} className="back-btn">
              {language === 'en' ? '← Back to Questions' : 'प्रश्नों पर वापस'}
            </button>
          )}

          {/* Language toggle always in flow */}
          <div className="language-toggle">
            <button onClick={() => setLanguage('en')} disabled={language === 'en'}>
              EN
            </button>
            <button onClick={() => setLanguage('hi')} disabled={language === 'hi'}>
              हि
            </button>
          </div>
        </div>
      )}

      <div className="app-content" style={{ marginTop: '60px' }}>
        {/* Language toggle */}
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
          {screen === 'flow' && step === TOTAL_QUESTIONS + 1 && (
            <button onClick={() => setStep(lastQuestionStep)}>
              {language === 'en' ? '← Back to Questions' : 'प्रश्नों पर वापस'}
            </button>
          )}
        </div>
        {/* Navigation */}
        {screen === 'welcome' && (
          <WelcomeScreeningModule
            sessionId={sessionCd}
            setSessionId={setSessionCd}
            onOpenSL1={() => setScreen('sl1login')}
            onOpenDataEntry={() => {
              resetApplicantState();
              setScreen('dataentry');
            }}
          />
        )}

        {screen === 'sl1login' && (
          <WelcomeScreeningLogin
            onBack={() => setScreen('welcome')}
            onLoginSuccess={(u) => { setUser(u); setScreen('sl1home'); }}
          />
        )}

        {screen === 'sl1home' && (
          <ScreeningLevel1Home
            onGoToken={startFlowWithToken}
            onStartScreening={startFlowWithToken}
            onRowGo={(row) => startFlowWithToken(row.token)}
          />
        )}

        {/* Data Entry Mode */}
        {screen === 'dataentry' && !showSuccess && (
          <ApplicantDetails
            applicant={applicant}
            setApplicant={setApplicant}
            sessionId={sessionCd}
            onSave={handleSaveApplicant}
            onCancel={() => setScreen('welcome')}
            mode="dataentry"
          />
        )}

        {screen === 'dataentry' && showSuccess && (
          <div>
            <h3>Applicant saved successfully!</h3>
            <p>Generated Token #: <strong>{newToken}</strong></p>
            <button
              onClick={() => {
                resetApplicantState();
                setShowSuccess(false);
                setNewToken(null);
              }}
            >
              OK (Start New Entry)
            </button>
          </div>
        )}

        {/* Screening Flow */}
        {screen === 'flow' && (
          <>
            {step === 0 && (
              <ApplicantDetails
                applicant={applicant}
                setApplicant={setApplicant}
                screeningNumber={screeningNumber}
                setScreeningNumber={setScreeningNumber}
                handleFetchApplicant={handleFetchApplicant}
                nextStep={nextStep}
                mode="screening"
                onCancel={() => {
                  setStep(0);
                  setScreen("sl1home");   // exit flow → ScreeningLevel1Home
                }}
              />
            )}

            {/* {TOTAL_QUESTIONS > 0 && step >= 1 && (
              <div className="language-toggle">
                <button onClick={() => setLanguage('en')} disabled={language === 'en'}>
                  EN
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  disabled={language === 'hi'}
                >
                  हि
                </button>
              </div>
            )} */}

            {TOTAL_QUESTIONS > 0 && step >= 1 && step <= TOTAL_QUESTIONS && (
              <ScreeningQuestions
                questions={questions}
                step={step}
                language={language}
                answers={answers}
                setAnswers={setAnswers}
                comments={comments}
                setComments={setComments}
                nextStep={nextStep}
                prevStep={prevStep}
                goToStep={goToStep}
                openSummaryFrom={openSummaryFrom}
                // decisions={decisions}
                // setDecisions={setDecisions}
                checkOk={checkOk}
                setCheckOk={setCheckOk}
              />
            )}

            {TOTAL_QUESTIONS > 0 && step === TOTAL_QUESTIONS + 1 && (
              <ApplicantSummary
                questions={questions}
                language={language}
                screeningNumber={screeningNumber}
                applicant={applicant}
                answers={answers}
                comments={comments}
                checkOk={checkOk}
                setCheckOk={setCheckOk}
                decisionReason={decisionReason}
                setDecisionReason={setDecisionReason}
                returnToLastQuestion={returnToLastQuestion}
                // decisions={decisions}
                applicantId={applicantId}
                sessionCd={sessionCd}
                user={user}
                defaultFinalDecision={finalDecision}
                defaultRouteTo={routeTo}
                onCloseSummary={() => {
                  setStep(0);        // reset step
                  setScreen("sl1home"); // go back to ScreeningLevel1Home
                }}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
