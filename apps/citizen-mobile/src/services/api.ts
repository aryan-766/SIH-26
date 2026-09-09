const API_BASE_URL = 'http://localhost:8000/api/v1';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Fallback for ${endpoint}:`, err);
    throw err;
  }
}

// Auth Endpoints
export const sendPhoneOtp = (phone: string) =>
  apiRequest('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone })
  });

export const verifyPhoneOtp = (phone: string, otp: string, full_name = 'Rural Entrepreneur') =>
  apiRequest('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, otp, full_name })
  });

// Module 1: Discovery
export const getOpportunities = (capital = 80000, skills = ['Dairy Farming', 'Agriculture'], space_sqft = 500, village_id = 'vil_bhiti') =>
  apiRequest('/discovery/opportunities', {
    method: 'POST',
    body: JSON.stringify({ capital, skills, space_sqft, village_id })
  });

export const getGisRadar = (radius_km = 5.0, village_id = 'vil_bhiti') =>
  apiRequest(`/discovery/gis-radar?village_id=${village_id}&radius_km=${radius_km}`);

export const compareBusinesses = (ids = 'dairy_farming,food_processing,mobile_solar_repair') =>
  apiRequest(`/discovery/compare?category_ids=${ids}`);

// Module 2: Planning & Schemes
export const getFeasibility = (categoryId: string) =>
  apiRequest(`/planning/feasibility/${categoryId}`);

export const simulateFinances = (data: any) =>
  apiRequest('/planning/financial-plan', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const getSchemes = (loanAmount = 200000, socialCategory = 'OBC', sector = 'Dairy') =>
  apiRequest(`/planning/schemes?loan_amount=${loanAmount}&social_category=${socialCategory}&sector=${sector}&is_rural=true`);

export const generateDpr = (data: any) =>
  apiRequest('/planning/dpr', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const getLaunchChecklist = (categoryId = 'dairy_farming') =>
  apiRequest(`/planning/launch-checklist?category_id=${categoryId}`);

export const submitApplication = (data: any) =>
  apiRequest('/planning/submit-application', {
    method: 'POST',
    body: JSON.stringify(data)
  });

// Module 3: Copilot
export const getCopilotOverview = (appId = 'app_101') =>
  apiRequest(`/copilot/dashboard/${appId}`);

export const addDailyTransaction = (tx: any) =>
  apiRequest('/copilot/transactions', {
    method: 'POST',
    body: JSON.stringify(tx)
  });

export const askCopilotAdvisor = (prompt: string, appId = 'app_101') =>
  apiRequest('/copilot/ask-advisor', {
    method: 'POST',
    body: JSON.stringify({ application_id: appId, prompt })
  });

// Voice & Offline
export const parseVoiceQuery = (transcript: string, language = 'hi-IN') =>
  apiRequest('/voice/parse-intent', {
    method: 'POST',
    body: JSON.stringify({ transcript, language })
  });

export const syncOfflineSurveys = (officerId: string, surveyData: any[]) =>
  apiRequest('/voice/offline-batch-sync', {
    method: 'POST',
    body: JSON.stringify({ officer_id: officerId, recordings_count: surveyData.length, survey_data: surveyData })
  });
