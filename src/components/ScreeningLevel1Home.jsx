import React, { useEffect, useMemo, useState } from 'react';

export default function ScreeningLevel1Home({
  onGoToken = (token) => console.log('GO token:', token),
  onStartScreening = (token) => console.log('Start screening for token:', token),
  onRowGo = (row) => console.log('Row GO:', row),
}) {
  const isMobile = useBreakpoint(640);   // <640px → card list view
  const isTablet = useBreakpoint(900);   // <900px → tighter layouts

  // Top token entry
  const [tokenInput, setTokenInput] = useState('');

  // Search form state
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    tokenNo: '',
    name: '',
    wname: '',
  });

  // Mock rows (replace with API data later)
  const [rows] = useState([
    { token: '18',  name: 'Aarav Mehta',               age: 43, category: 'Male',   location: 'Mumbai',                   status: 'Approve' },
    { token: '59',  name: 'Baburao Waghmare',          age: 58, category: 'Male',   location: 'Pune',                     status: 'Wait'    },
    { token: '110', name: 'Gautam Joshi',              age: 26, category: 'Male',   location: 'Maharashtra (Raigad)',     status: 'Wait'    },
    { token: '185', name: 'Ramesh Chawla',             age: 58, category: 'Male',   location: 'Maharashtra (Jalgoan)',    status: 'Approve' },
    { token: '215', name: 'Sunil Prakash Makhija',     age: 47, category: 'Male',   location: 'Maharashtra (Jangoan)',    status: 'SS'      },
    { token: '015', name: 'Ravindra Sharma / Sushila', age: 26, category: 'Couple', location: 'Maharashtra (Jangoan)',    status: 'Wait'    },
  ]);

  // Apply filters locally
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const f = filters;
      const byCategory = f.category ? r.category === f.category : true;
      const byStatus = f.status ? r.status === f.status : true;
      const byToken = f.token && f.tokenNo
        ? r.token.toLowerCase().includes(f.tokenNo.toLowerCase())
        : f.tokenNo
          ? r.token.toLowerCase().includes(f.tokenNo.toLowerCase())
          : true;
      const byName = f.name ? r.name.toLowerCase().includes(f.name.toLowerCase()) : true;
      const byWName = f.wname ? r.name.toLowerCase().includes(f.wname.toLowerCase()) : true; // placeholder
      return byCategory && byStatus && byToken && byName && byWName;
    });
  }, [rows, filters]);

  // Summary counts
  const summary = useMemo(() => {
    return filtered.reduce(
      (acc, r) => {
        if (r.status === 'Approve') acc.approve += 1;
        else if (r.status === 'Wait') acc.wait += 1;
        else if (r.status === 'SS') acc.ss += 1;
        return acc;
      },
      { approve: 0, wait: 0, ss: 0 }
    );
  }, [filtered]);

  const setFilter = (key) => (e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="app-content" style={{ maxWidth: 1100 }}>
      {/* Header row (title + user) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'space-between',
          marginBottom: 16,
          gap: 12,
          flexWrap: 'wrap',
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            background: '#0ea5e9',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 6,
            width: isMobile ? '100%' : 'auto',
          }}
        >
          SCREENING LEVEL1 HOME
        </div>
        {!isMobile && <div style={{ fontWeight: 600 }}>SL1 Raghav Rajpal</div>}
      </div>

      {/* Top token + Start + Summary */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 12,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        {/* Token entry */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: '1 1 320px',
            minWidth: 260,
          }}
        >
          <label style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
            SCREENING TOKEN NO
          </label>
          <input
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            style={{
              padding: '8px 10px',
              minWidth: 120,
              flex: '1 1 140px',
            }}
            placeholder="Enter token"
          />
          <button
            type="button"
            onClick={() => onGoToken(tokenInput)}
            disabled={!tokenInput.trim()}
            style={{ minWidth: 70 }}
          >
            GO
          </button>
        </div>

        {/* Start button */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => onStartScreening(tokenInput)}
            disabled={!tokenInput.trim()}
            style={{
              minWidth: 160,
              width: isMobile ? '100%' : 'auto',
            }}
          >
            START SCREENING
          </button>
        </div>

        {/* Summary */}
        <div style={{ marginLeft: 'auto', flex: isMobile ? '1 1 100%' : '0 0 auto' }}>
          {!isMobile ? (
            <>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                SCREENING SUMMARY:
              </div>
              <table style={{ borderCollapse: 'collapse', minWidth: 220, width: '100%' }}>
                <thead>
                  <tr>
                    <th style={thCell}>Approve</th>
                    <th style={thCell}>Wait</th>
                    <th style={thCell}>SS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdCellCenter}>{summary.approve}</td>
                    <td style={tdCellCenter}>{summary.wait}</td>
                    <td style={tdCellCenter}>{summary.ss}</td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            // Mobile: compact chips
            <div
              style={{
                display: 'flex',
                gap: 8,
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <Chip label="Approve" value={summary.approve} color="#16a34a" />
              <Chip label="Wait" value={summary.wait} color="#f59e0b" />
              <Chip label="SS" value={summary.ss} color="#0ea5e9" />
            </div>
          )}
        </div>
      </div>

      {/* Search Criteria box */}
      <div
        style={{
          border: '1px solid #8bd2ea',
          padding: 12,
          borderRadius: 6,
          marginBottom: 16,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Search Criteria</div>

        {/* Responsive grid: auto-fit fields */}
        <div
          className="form-section"
          style={{
            display: 'grid',
            gridTemplateColumns: isTablet
              ? 'repeat(2, minmax(0, 1fr))'
              : 'repeat(4, minmax(0, 1fr))',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <Field label="Category">
            <select value={filters.category} onChange={setFilter('category')}>
              <option value="">--</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Couple">Couple</option>
            </select>
          </Field>

          <Field label="Screening Status">
            <select value={filters.status} onChange={setFilter('status')}>
              <option value="">--</option>
              <option value="Approve">Approve</option>
              <option value="Wait">Wait</option>
              <option value="SS">SS</option>
            </select>
          </Field>

          <Field label="Token No.">
            <input value={filters.tokenNo} onChange={setFilter('tokenNo')} />
          </Field>

          {/* spacer to balance 4-col layout; hidden on tablet/mobile */}
          {!isTablet && <div />}

          <Field label="Name" fullRow>
            <input value={filters.name} onChange={setFilter('name')} />
          </Field>

          <Field label="W.Name" fullRow>
            <input value={filters.wname} onChange={setFilter('wname')} />
          </Field>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          <button type="button" onClick={() => { /* filtering is live */ }} style={{ minWidth: 140 }}>
            SEARCH
          </button>
        </div>
      </div>

      {/* Results */}
      {!isMobile ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="summary-table" style={{ minWidth: 760 }}>
            <thead>
              <tr style={{ background: '#06b6d4', color: '#fff' }}>
                <th>Scr Token#</th>
                <th>Applicant Name</th>
                <th>Age</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th style={{ width: 70 }}>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.token}>
                  <td>{r.token}</td>
                  <td>{r.name}</td>
                  <td>{r.age}</td>
                  <td>{r.category}</td>
                  <td>{r.location}</td>
                  <td>{r.status}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button type="button" onClick={() => onRowGo(r)} style={{ padding: '6px 10px' }}>
                      GO
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 16, color: '#666' }}>
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // Mobile card list
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map((r) => (
            <div
              key={r.token}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 12,
                background: '#fff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                <strong>Token #{r.token}</strong>
                <span style={{ fontWeight: 600 }}>{r.status}</span>
              </div>
              <div style={{ fontSize: '0.95rem', marginBottom: 8 }}>
                <div><strong>Name:</strong> {r.name}</div>
                <div><strong>Age:</strong> {r.age} &nbsp;•&nbsp; <strong>Category:</strong> {r.category}</div>
                <div><strong>Location:</strong> {r.location}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => onRowGo(r)} style={{ minWidth: 90 }}>
                  GO
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 16, color: '#666' }}>
              No results found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* Reusable field block */
function Field({ label, children, fullRow }) {
  return (
    <div
      className="field-group"
      style={{
        gridColumn: fullRow ? '1 / -1' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <label style={{ fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}

function Chip({ label, value, color }) {
  return (
    <div
      style={{
        flex: 1,
        border: `1px solid ${color}`,
        color,
        padding: '6px 10px',
        borderRadius: 999,
        textAlign: 'center',
        fontWeight: 700,
      }}
    >
      {label}: {value}
    </div>
  );
}

/** Simple breakpoint hook (client-only) */
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

/* small table cell helpers */
const thCell = {
  border: '1px solid #ccc',
  padding: '6px 10px',
  background: '#e5e7eb',
  fontWeight: 700,
  textAlign: 'center',
};
const tdCellCenter = {
  border: '1px solid #ccc',
  padding: '6px 10px',
  textAlign: 'center',
};
