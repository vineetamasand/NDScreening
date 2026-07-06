// src/data/dataService.js
// const API_BASE = 'http://localhost:8000/api';
// const API_BASE = "http://192.168.1.50:8000/api";
const API_BASE = "/api";

async function jsonGet(url) {
  console.log("Frontend GET ->", url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json();
}

async function jsonPost(url, body) {
  console.log("Frontend POST ->", url, body);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`POST ${url} failed: ${res.status} ${txt}`);
  }
  return res.json();
}

const HARDCODED_SESSION_CD = "2025_MUM"; // fallback if session API not available
let cachedSessionCd = null;

async function getSessionCd() {
  if (cachedSessionCd) return cachedSessionCd;
  try {
    const sess = await jsonGet(`${API_BASE}/sessions/1`);
    cachedSessionCd = sess.session_cd;
    return cachedSessionCd;
  } catch (err) {
    console.warn("getSessionCd failed, falling back to hardcoded:", err);
    cachedSessionCd = HARDCODED_SESSION_CD;
    return cachedSessionCd;
  }
}

async function saveResponses(applicantId, responsesPayload) {
  // responsesPayload should be { responses: [ { question_id, response, decision, comment }, ... ] }
  const url = `${API_BASE}/applicants/${encodeURIComponent(applicantId)}/responses`;
  return jsonPost(url, responsesPayload);
}

async function saveDecision(applicantId, sessionCd, decisionPayload) {
  // decisionPayload should be { level, final_decision, reason, additional_comments, decided_by? }
  const url = `${API_BASE}/applicants/${encodeURIComponent(applicantId)}/decisions/${encodeURIComponent(sessionCd)}`;
  return jsonPost(url, decisionPayload);
}

const dataService = {
  async getQuestions() {
    const url = `${API_BASE}/questions/`;
    return jsonGet(url);
  },

  async getApplicants() {
    const url = `${API_BASE}/applicants/listapplicant`;
    return jsonGet(url);
  },

  async generateToken(sessionCd) {
    return jsonPost(`${API_BASE}/tokens/${encodeURIComponent(sessionCd)}/generate`, {});
  },

  async getApplicantDetails(token) {
    const sessionCd = await getSessionCd();
    return jsonGet(`${API_BASE}/tokens/${encodeURIComponent(sessionCd)}/${encodeURIComponent(token)}`);
  },  

  async createTokenAndApplicant(sessionCd, applicant) {
    const body = {
      applicant_nm: applicant.name,
      father_nm: applicant.fatherName || null,
      spouse_nm: applicant.spouseName || null,
      category: applicant.category || null,
      dob: applicant.age ? `${new Date().getFullYear() - Number(applicant.age)}-01-01` : null,
      marital_status: applicant.maritalStatus || null,
      occupation: applicant.occupation || null,
      country: applicant.country || null,
      state: applicant.state || null,
      village: applicant.area || null,
      phone_no: applicant.phone || null,
      uid: applicant.uid || null,
    };
    return jsonPost(`${API_BASE}/tokens/${encodeURIComponent(sessionCd)}/applicants`, body);
  },

  saveResponses,
  saveDecision,
  getSessionCd,
};

export default dataService;
