// src/components/WelcomeScreeningModule.jsx
import React, { useEffect, useState } from 'react';
import dataService from '../data/dataService';

export default function WelcomeScreeningModule({
  onOpenSL1,
  onOpenDataEntry,
}) {
  const isNarrow = useBreakpoint(768);
  const [sessionCd, setSessionCd] = useState('');

  // ✅ fetch session_cd once at mount
  useEffect(() => {
    (async () => {
      try {
        const s = await dataService.getSessionCd(); // call backend
        setSessionCd(s);
      } catch (err) {
        console.error('Failed to fetch session_cd', err);
      }
    })();
  }, []);

  return (
    <div className="app-content" style={{ maxWidth: 980 }}>
      {/* Title banner */}
      <div
        style={{
          margin: '0 auto 20px',
          textAlign: 'center',
          background: '#12bcd6',
          color: '#fff',
          fontWeight: 800,
          padding: '10px 18px',
          borderRadius: 6,
          letterSpacing: 0.5,
        }}
      >
        WELCOME TO SCREENING MODULE
      </div>

      {/* Session row (read-only) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 18,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontWeight: 600 }}>Naamdaan Session #</span>
        <input
          value={sessionCd}
          readOnly
          style={{
            padding: '8px 10px',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            minWidth: 180,
            background: '#f3f4f6',
            color: '#000',
            flex: isNarrow ? '1 1 220px' : '0 0 auto',
          }}
        />
      </div>

      {/* Button grid box */}
      <div
        style={{
          border: '1px solid #8bd2ea',
          borderRadius: 6,
          padding: 18,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isNarrow ? '1fr' : 'repeat(3, minmax(180px, 1fr))',
            gap: 18,
            justifyItems: 'center',
          }}
        >
          <ModuleButton label="Data Entry" onClick={onOpenDataEntry} fullWidth={isNarrow} />
          <ModuleButton label="Screening Level1" onClick={onOpenSL1} fullWidth={isNarrow} />
          <ModuleButton label="Senior Screener" fullWidth={isNarrow} />
          {/* <ModuleButton label="Dera HOD" fullWidth={isNarrow} /> */}
          {/* <ModuleButton label="Final Screening" fullWidth={isNarrow} /> */}
          <ModuleButton label="HOD Screen" fullWidth={isNarrow} />
          <ModuleButton label="H/I" fullWidth={isNarrow} />
          <ModuleButton label="READ-ONLY" fullWidth={isNarrow} />
          <ModuleButton label="Reports" fullWidth={isNarrow} />
          <ModuleButton label="Dashboard" fullWidth={isNarrow} />
        </div>
      </div>
    </div>
  );
}

function ModuleButton({ label, onClick, fullWidth }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '10px 18px',
        minWidth: 160,
        width: fullWidth ? '100%' : 'auto',
        background: '#2196f3',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
      }}
    >
      {label}
    </button>
  );
}

/** Simple breakpoint hook (client-only) */
function useBreakpoint(px = 768) {
  const [narrow, setNarrow] = useState(
    typeof window !== 'undefined' ? window.innerWidth < px : false
  );
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < px);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [px]);
  return narrow;
}
