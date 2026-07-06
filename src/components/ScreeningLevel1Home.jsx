// src/components/ScreeningLevel1Home.jsx
import React, { useEffect, useMemo, useState } from 'react';
import dataService from '../data/dataService';

export default function ScreeningLevel1Home({
  onGoToken = (token) => console.log('GO token:', token),
  onStartScreening = (token) => console.log('Start screening for token:', token),
  onRowGo = (row) => console.log('Row GO:', row),
}) {
  const isMobile = useBreakpoint(640);   // <640px → card view
  const isTablet = useBreakpoint(900);   // <900px → tighter layouts

  const [tokenInput, setTokenInput] = useState('');
  const [filters, setFilters] = useState({ category: '', status: '', tokenNo: '', name: '', wname: '' });
  const [rows, setRows] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await dataService.getApplicants();
        setRows(data);
      } catch (err) {
        console.error("Failed to fetch applicants", err);
      }
    })();
  }, []);

  // Sort latest first
  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => (b.token > a.token ? 1 : -1));
  }, [rows]);

  // Apply filters
  const filtered = useMemo(() => {
    return sortedRows.filter((r) => {
      const f = filters;
      const byCategory = f.category ? r.category === f.category : true;
      const byStatus = f.status ? r.status === f.status : true;
      const byToken = f.tokenNo ? r.token.toLowerCase().includes(f.tokenNo.toLowerCase()) : true;
      const byName = f.name ? r.name.toLowerCase().includes(f.name.toLowerCase()) : true;
      const byWName = f.wname ? r.name.toLowerCase().includes(f.wname.toLowerCase()) : true;
      return byCategory && byStatus && byToken && byName && byWName;
    });
  }, [sortedRows, filters]);

  // Summary counts
  const summary = useMemo(() => {
    return filtered.reduce(
      (acc, r) => {
        const status = (r.status || "").toUpperCase();
        if (status === "APPROVE") acc.approve += 1;
        else if (status === "WAIT") acc.wait += 1;
        else if (status === "ROUTE") acc.route += 1;
        else if (status === "IN_PROGRESS") acc.inProgress += 1;
        return acc;
      },
      { approve: 0, wait: 0, route: 0, inProgress: 0 }
    );
  }, [filtered]);

  const setFilter = (key) => (e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="app-content" style={{ maxWidth: 1100 }}>
      {/* Header */}
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

      {/* Token input + Start + Summary */}
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
              <table style={{ borderCollapse: 'collapse', minWidth: 320, width: '100%' }}>
                <thead>
                  <tr>
                    <th style={thCell}>Approve</th>
                    <th style={thCell}>Wait</th>
                    <th style={thCell}>Route</th>
                    <th style={thCell}>In Progress</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdCellCenter}>{summary.approve}</td>
                    <td style={tdCellCenter}>{summary.wait}</td>
                    <td style={tdCellCenter}>{summary.route}</td>
                    <td style={tdCellCenter}>{summary.inProgress}</td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'space-between',
                marginTop: 8,
                flexWrap: 'wrap',
              }}
            >
              <Chip label="Approve" value={summary.approve} color="#16a34a" />
              <Chip label="Wait" value={summary.wait} color="#f59e0b" />
              <Chip label="Route" value={summary.route} color="#3b82f6" />
              <Chip label="InProg" value={summary.inProgress} color="#6b7280" />
            </div>
          )}
        </div>
      </div>

      {/* Search toggle */}
      <div style={{ marginBottom: 12 }}>
        <button
          type="button"
          onClick={() => setShowSearch((s) => !s)}
          style={{ minWidth: 160 }}
        >
          {showSearch ? "Hide Search" : "Show Search"}
        </button>
      </div>

      {/* Search criteria */}
      {showSearch && (
        <div
          style={{
            border: '1px solid #8bd2ea',
            padding: 12,
            borderRadius: 6,
            marginBottom: 16,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Search Criteria</div>
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
                <option value="APPROVE">Approve</option>
                <option value="WAIT">Wait</option>
                <option value="ROUTE">Route</option>
                <option value="IN_PROGRESS">In Progress</option>
              </select>
            </Field>

            <Field label="Token No.">
              <input value={filters.tokenNo} onChange={setFilter('tokenNo')} />
            </Field>

            {!isTablet && <div />}

            <Field label="Name" fullRow>
              <input value={filters.name} onChange={setFilter('name')} />
            </Field>

            <Field label="W.Name" fullRow>
              <input value={filters.wname} onChange={setFilter('wname')} />
            </Field>
          </div>
        </div>
      )}

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
                    <button
                      type="button"
                      onClick={() => onRowGo(r)}
                      style={{ padding: '6px 10px' }}
                    >
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
              {/* Row 1: Token + Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <strong>Token #{r.token}</strong>
                <span style={{ fontWeight: 600 }}>{r.status}</span>
              </div>

              {/* Row 2: Category | Name | Age */}
              <div style={{ fontSize: '0.95rem', marginBottom: 6 }}>
                {r.category} | <strong>{r.name}</strong> | Age: {r.age}
              </div>

              {/* Row 3: Location + GO */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.95rem',
                }}
              >
                <div><strong>Location:</strong> {r.location}</div>
                <button
                  type="button"
                  onClick={() => onRowGo(r)}
                  style={{
                    padding: '4px 12px',
                    fontSize: '0.85rem',
                    background: '#0ea5e9',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
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

/* --- Reusable helpers --- */
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
        width: 70,
        height: 70,
        border: `2px solid ${color}`,
        color,
        borderRadius: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "0.8rem",
        textAlign: "center",
      }}
    >
      <div>{label}</div>
      <div>{value}</div>
    </div>
  );
}

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
