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
          gap: 12,
          marginBottom: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <button type="button" onClick={onBack} style={{ minWidth: 44 }}>
          ⟵ Home
        </button>

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
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '180px 1fr',
            rowGap: 14,
            columnGap: 14,
            alignItems: 'center',
          }}
        >
          {/* Screener Code */}
          <label style={{ fontWeight: 600 }}>Screener Code</label>
          <input
            placeholder="SS001"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="username"
            style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
          />

          {/* Password */}
          <label style={{ fontWeight: 600 }}>Password</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                padding: '10px',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                width: '100%',
              }}
            />
            <button type="button" onClick={() => setShowPw((s) => !s)} style={{ minWidth: 80 }}>
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Role */}
          <label style={{ fontWeight: 600 }}>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ padding: '10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
          >
            <option>Screener Level 1</option>
            <option>Senior Screener</option>
            <option>HOD</option>
            <option>H/I</option>
            <option>Read Only</option>
          </select>
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
