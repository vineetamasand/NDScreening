import React, { useEffect, useState } from 'react';

export default function WelcomeScreeningLogin({
  onBack = () => {},
  onLoginSuccess = (user) => console.log('Logged in:', user),
}) {
  const isMobile = useBreakpoint(640); // labels stack on small screens

  const [code, setCode] = useState('');        // e.g., SS001
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Screener Level 1'); // must be this to proceed
  const [showPw, setShowPw] = useState(false);

  const canSubmit = code.trim() && password.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Minimal guard per your spec:
    if (role !== 'Screener Level 1') {
      alert('Please select role: Screener Level 1');
      return;
    }

    // TODO: plug real auth here if needed
    onLoginSuccess({ code: code.trim(), role });
  };

  return (
    <div className="app-content" style={{ maxWidth: 820 }}>
      {/* top row: back/home + title */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: -40,
        }}
      >
        {/* <button type="button" onClick={onBack} style={{ minWidth: 44 }}>
          ⟵ Home
        </button> */}

        <div
          style={{
            display: 'inline-block',
            background: '#12bcd6',
            color: '#fff',
            fontWeight: 800,
            padding: '10px 18px',
            borderRadius: 6,
            letterSpacing: 0.5,
            textAlign: 'center',
            minWidth: isMobile ? '100%' : 0,
          }}
        >
          Welcome to Screening Application
        </div>
      </div>

      {/* login panel */}
      <form
        onSubmit={handleSubmit}
        style={{
          border: '1px solid #8bd2ea',
          borderRadius: 6,
          padding: 18,
          background: '#fff',
        }}
      >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',   // rows stacked always
              gap: 14,                   // consistent spacing between rows
            }}
          >

          {/* Screener Code */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 4 : 12, marginBottom: 6,  }}>
          <label style={{ fontWeight: 600, minWidth: isMobile ? "auto" : 180 }}>Screener Code</label>
          <input
            placeholder="Enter screener code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="username"
            style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: 6,width: isMobile ? "100%" : "250px", }}
          />
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 4 : 12, marginBottom: 6, }}>
          <label style={{ fontWeight: 600, minWidth: isMobile ? "auto" : 180  }}>Password</label>
          <div style={{ display: 'flex', gap: 8, width: isMobile ? "100%" : "250px" }}>
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                // width: '100%',
              }}
            />
            <button type="button" onClick={() => setShowPw((s) => !s)} style={{ minWidth: 80 }}>
              {showPw ? 'Hide' : 'Show'}
            </button>
           </div>
           </div>

          {/* Role */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 4 : 12, marginBottom: 12, }}>
          <label style={{ fontWeight: 600, minWidth: isMobile ? "auto" : 180 }}>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: 6,width: isMobile ? "100%" : "250px", }}
          >
            <option>Screener Level 1</option>
            <option>Senior Screener</option>
            <option>HOD</option>
            <option>H/I</option>
            <option>Read Only</option>
          </select>
        </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
          <button type="submit" disabled={!canSubmit} style={{ minWidth: 140 }}>
            Go
          </button>
        </div>
      </form>
    </div>
  );
}

/** tiny breakpoint hook */
function useBreakpoint(px) {
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
