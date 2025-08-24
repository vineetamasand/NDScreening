import mockData from './mockData.js';

// flip to false when you wire real APIs
const USE_MOCK = true;

const mockApi = {
  async getApplicantDetails(token) {
    await new Promise(res => setTimeout(res, 200)); // simulate latency
    return mockData.stage0[token] || null;
  },
  async getApplicantQuestions(token) {
    await new Promise(res => setTimeout(res, 200));
    return mockData.stage1[token] || [];
  },
  async getApplicantSummary(token) {
    await new Promise(res => setTimeout(res, 200));
    return mockData.final[token] || null;
  }
};

const realApi = {
  async getApplicantDetails(token) {
    const res = await fetch(`/api/applicants/${token}`);
    if (!res.ok) throw new Error('Error fetching applicant details');
    return res.json();
  },
  async getApplicantQuestions(token) {
    const res = await fetch(`/api/applicants/${token}/questions`);
    if (!res.ok) throw new Error('Error fetching questions');
    return res.json();
  },
  async getApplicantSummary(token) {
    const res = await fetch(`/api/applicants/${token}/summary`);
    if (!res.ok) throw new Error('Error fetching summary');
    return res.json();
  }
};

const dataService = USE_MOCK ? mockApi : realApi;
export default dataService;
