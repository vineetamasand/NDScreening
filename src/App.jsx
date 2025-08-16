import React, { useState } from 'react';
import logo from './assets/RSSB.png';
import './index.css';

import ApplicantDetails from './components/ApplicantDetails.jsx';
import ScreeningQuestions from './components/ScreeningQuestions.jsx';
import ApplicantSummary from './components/ApplicantSummary.jsx';

import questions from './questions';
import dataService from './data/dataService';

export default function App() {
  // 0 = applicant details, 1..N = questions, N+1 = summary
  const [step, setStep] = useState(0);
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
    uid: '',
  });

  const TOTAL_QUESTIONS = Array.isArray(questions) ? questions.length : 0;
  const [decisions, setDecisions] = useState(Array(TOTAL_QUESTIONS).fill(''));
  const [answers, setAnswers] = useState(Array(TOTAL_QUESTIONS).fill(''));
  const [comments, setComments] = useState(Array(TOTAL_QUESTIONS).fill(''));
  const [checkOk, setCheckOk] = useState(Array(TOTAL_QUESTIONS).fill(null));
  const [decisionReason, setDecisionReason] = useState('');

  // remember which question opened the summary
  const [lastQuestionStep, setLastQuestionStep] = useState(1);

  const nextStep = () => setStep((s) => Math.min(s + 1, TOTAL_QUESTIONS + 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const goToStep = (n) => {
    const clamped = Math.max(1, Math.min(n, TOTAL_QUESTIONS));
    setStep(clamped);
  };

  // open summary from a specific question step (remember origin)
  const openSummaryFrom = (fromStep) => {
    const clamped = Math.max(1, Math.min(fromStep, TOTAL_QUESTIONS));
    setLastQuestionStep(clamped);
    setStep(TOTAL_QUESTIONS + 1);
  };

  // go back to the remembered question step
  const returnToLastQuestion = () => {
    const target = Math.max(1, Math.min(lastQuestionStep, TOTAL_QUESTIONS));
    setStep(target);
  };

  const handleFetchApplicant = async () => {
    try {
      const data = await dataService.getApplicantDetails(screeningNumber);
      if (data) setApplicant(data);
      else alert('No applicant found for this screening number.');
    } catch (err) {
      console.error(err);
      alert('Error fetching applicant details.');
    }
  };

  const setDecision = (val) => {
    console.log('Final decision:', val, 'Reason:', decisionReason);
  };

  return (
    <>
      {/* Fixed Header */}
      <div className="app-header">
        <img src={logo} alt="RSSB Logo" className="app-logo" />
        <h1 className="app-title">NaamDaan Screening</h1>
      </div>

      {/* Main Content */}
      <div className="app-content" style={{ marginTop: '60px' }}>
        {/* Language Toggle */}
        <div style={{
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <button onClick={() => setLanguage('en')} disabled={language === 'en'}>English</button>
            <button onClick={() => setLanguage('hi')} disabled={language === 'hi'} style={{ marginLeft: '10px' }}>हिंदी</button>
          </div>

          {step === questions.length + 1 && (
            <button onClick={() => setStep(lastQuestionStep)}>
              {language === 'en' ? '← Back to Questions' : 'प्रश्नों पर वापस'}
            </button>

          )}
        </div>
        {/* Step 0: Applicant Details */}
        {step === 0 && (
          <ApplicantDetails
            applicant={applicant}
            setApplicant={setApplicant}
            screeningNumber={screeningNumber}
            setScreeningNumber={setScreeningNumber}
            handleFetchApplicant={handleFetchApplicant}
            nextStep={nextStep}
          />
        )}

        {/* Step 1..N: Questions */}
        {TOTAL_QUESTIONS > 0 && step >= 1 && step <= TOTAL_QUESTIONS && (
          <ScreeningQuestions
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
            decisions={decisions}            
            setDecisions={setDecisions}      
          />
        )}

        {/* Step N+1: Summary */}
        {TOTAL_QUESTIONS > 0 && step === TOTAL_QUESTIONS + 1 && (
          <ApplicantSummary
            language={language}
            screeningNumber={screeningNumber}
            applicant={applicant}
            answers={answers}
            comments={comments}
            checkOk={checkOk}
            setCheckOk={setCheckOk}
            decisionReason={decisionReason}
            setDecisionReason={setDecisionReason}
            setDecision={setDecision}
            returnToLastQuestion={returnToLastQuestion}
            decisions={decisions}
          />
        )}
      </div>
    </>
  );
}
