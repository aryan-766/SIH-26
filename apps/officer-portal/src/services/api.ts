const API_BASE_URL = 'http://localhost:8000/api/v1';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers as Record<string, string> || {})
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
    console.warn(`API fallback triggered for ${endpoint}:`, err);
    throw err;
  }
}

// Authentication
export const officerLogin = async (email: string, password = 'password123') => {
  try {
    const res = await apiRequest('/auth/officer-login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.access_token) {
      setAuthToken(res.access_token);
    }
    return res;
  } catch (err) {
    // Fallback mock token for seamless offline demo
    return {
      access_token: 'mock_jwt_token',
      user: {
        id: email.includes('district') ? 'officer_district_gkp' : (email.includes('sca') ? 'officer_sca_welfare' : 'admin_super'),
        full_name: email.includes('district') ? 'Shri Rajesh Verma (IAS)' : 'Smt. Anjali Singh (State Dir.)',
        role: email.includes('district') ? 'district_officer' : (email.includes('sca') ? 'sca_pwd_officer' : 'super_admin'),
        district_id: 'dist_gorakhpur'
      }
    };
  }
};

// KPIs
export const getKpis = async (districtId = 'dist_gorakhpur') => {
  try {
    return await apiRequest(`/officer/kpis?district_id=${districtId}`);
  } catch (err) {
    return {
      district_id: districtId,
      district_name: districtId === 'dist_gorakhpur' ? 'Gorakhpur' : (districtId === 'dist_varanasi' ? 'Varanasi' : 'Pune Rural'),
      state: districtId === 'dist_pune' ? 'Maharashtra' : 'Uttar Pradesh',
      officer_role: 'district_officer',
      kpis: {
        total_entrepreneurs: 12482,
        business_assessments: 8921,
        businesses_selected: 6432,
        loan_applications: 4812,
        businesses_launched: 3487,
        active_businesses: 3487,
        repayment_health_percent: 91.4,
        at_risk_businesses: 182,
        pending_district_approval: 46
      }
    };
  }
};

// Geo-Intelligence
export const getGeoIntelligence = async (districtId = 'dist_gorakhpur') => {
  try {
    return await apiRequest(`/officer/geo-intelligence?district_id=${districtId}`);
  } catch (err) {
    return {
      district_center: { lat: 26.7606, lng: 83.3732, zoom: 11 },
      villages: [
        { id: 'vil_bhiti', name: 'Bhiti Rawat', block: 'Sahjanwa', lat: 26.7450, lng: 83.2500, population: 4200, milk_yield: 2400.0, power_hours: 19 },
        { id: 'vil_pipraich', name: 'Pipraich Khurd', block: 'Pipraich', lat: 26.8300, lng: 83.5200, population: 3800, milk_yield: 1950.0, power_hours: 18 },
        { id: 'vil_khorabar', name: 'Khorabar Bujurg', block: 'Khorabar', lat: 26.7100, lng: 83.4100, population: 5100, milk_yield: 1600.0, power_hours: 20 },
        { id: 'vil_campierganj', name: 'Campierganj Dehat', block: 'Campierganj', lat: 27.0200, lng: 83.2800, population: 6200, milk_yield: 3100.0, power_hours: 17 }
      ],
      applications: [
        { id: 'app_101', applicant: 'Ramesh Kumar Yadav', business: 'Adarsh Dairy Farm', category: 'Dairy', lat: 26.746, lng: 83.252, total_cost: 250000, loan_amount: 175000, subsidy_amount: 87500, status: 'launched', repayment_health: 'healthy' },
        { id: 'app_102', applicant: 'Sunita Devi', business: 'Maa Vaishno Spices', category: 'Food Processing', lat: 26.831, lng: 83.521, total_cost: 180000, loan_amount: 120000, subsidy_amount: 63000, status: 'approved', repayment_health: 'healthy' },
        { id: 'app_103', applicant: 'Virendra Maurya', business: 'Kisan Solar & Agro Serv', category: 'Solar Services', lat: 26.712, lng: 83.412, total_cost: 320000, loan_amount: 220000, subsidy_amount: 80000, status: 'submitted', repayment_health: 'healthy' },
        { id: 'app_104', applicant: 'Manoj Paswan', business: 'Ganga Poultry Hatchery', category: 'Poultry', lat: 27.022, lng: 83.282, total_cost: 150000, loan_amount: 100000, subsidy_amount: 52500, status: 'launched', repayment_health: 'at_risk' },
        { id: 'app_105', applicant: 'Pooja Vishwakarma', business: 'Kripa Readymade Garments', category: 'Handloom & Textile', lat: 26.755, lng: 83.365, total_cost: 120000, loan_amount: 80000, subsidy_amount: 42000, status: 'submitted', repayment_health: 'healthy' }
      ],
      facilities: [
        { id: 'fac_1', name: 'Sahjanwa Bulk Milk Chilling Center', facility_type: 'chilling_center', lat: 26.7480, lng: 83.2580, description: 'Capacity 5,000 L/day' },
        { id: 'fac_2', name: 'Gorakhpur Central Agro Mandi', facility_type: 'mandi', lat: 26.7650, lng: 83.3850, description: 'Major grain & produce hub' },
        { id: 'fac_3', name: 'Baroda UP Rural Bank - Sahjanwa', facility_type: 'bank', lat: 26.7420, lng: 83.2450, description: 'Lead District Bank branch' }
      ]
    };
  }
};

// Applications Pipeline
export const getPipeline = async (statusFilter?: string, healthFilter?: string) => {
  try {
    let url = '/officer/pipeline';
    const params = new URLSearchParams();
    if (statusFilter && statusFilter !== 'all') params.append('status_filter', statusFilter);
    if (healthFilter && healthFilter !== 'all') params.append('health_filter', healthFilter);
    if (params.toString()) url += `?${params.toString()}`;
    return await apiRequest(url);
  } catch (err) {
    return [
      {
        id: 'app_101',
        applicant_name: 'Ramesh Kumar Yadav',
        business_name: 'Adarsh Dairy Farm',
        category: 'Dairy',
        village_name: 'Bhiti Rawat',
        total_project_cost: 250000,
        loan_amount: 175000,
        subsidy_amount: 87500,
        monthly_emi: 4250,
        moratorium_months: 3,
        status: 'launched',
        repayment_health: 'healthy',
        credit_score_estimate: 760,
        notes: 'DPR verified by Field Officer. Milk collection tied up with Amul DCS.'
      },
      {
        id: 'app_102',
        applicant_name: 'Sunita Devi',
        business_name: 'Maa Vaishno Spices & Flour Mill',
        category: 'Food Processing',
        village_name: 'Pipraich Khurd',
        total_project_cost: 180000,
        loan_amount: 120000,
        subsidy_amount: 63000,
        monthly_emi: 2950,
        moratorium_months: 3,
        status: 'approved',
        repayment_health: 'healthy',
        credit_score_estimate: 745,
        notes: 'PMEGP 35% Special Category subsidy sanctioned. Machine quotation validated.'
      },
      {
        id: 'app_103',
        applicant_name: 'Virendra Maurya',
        business_name: 'Kisan Solar Pump & Battery Center',
        category: 'Solar Services',
        village_name: 'Khorabar Bujurg',
        total_project_cost: 320000,
        loan_amount: 220000,
        subsidy_amount: 80000,
        monthly_emi: 5320,
        moratorium_months: 2,
        status: 'submitted',
        repayment_health: 'healthy',
        credit_score_estimate: 730,
        notes: 'Pending District Level Task Force approval. Training certificate attached.'
      },
      {
        id: 'app_104',
        applicant_name: 'Manoj Paswan',
        business_name: 'Ganga Poultry Hatchery',
        category: 'Poultry',
        village_name: 'Campierganj Dehat',
        total_project_cost: 150000,
        loan_amount: 100000,
        subsidy_amount: 52500,
        monthly_emi: 2450,
        moratorium_months: 3,
        status: 'launched',
        repayment_health: 'at_risk',
        credit_score_estimate: 680,
        notes: 'Feed cost spiked 22%. Repayment delayed by 18 days. Field visit recommended.'
      },
      {
        id: 'app_105',
        applicant_name: 'Pooja Vishwakarma',
        business_name: 'Kripa Readymade Garments & Tailoring',
        category: 'Handloom & Textile',
        village_name: 'Gorakhpur Town Block',
        total_project_cost: 120000,
        loan_amount: 80000,
        subsidy_amount: 42000,
        monthly_emi: 1980,
        moratorium_months: 2,
        status: 'submitted',
        repayment_health: 'healthy',
        credit_score_estimate: 710,
        notes: 'SHG group recommendation letter received. Low machinery capex.'
      }
    ];
  }
};

// Take Action
export const takeApplicationAction = async (applicationId: string, action: string, notes: string) => {
  try {
    return await apiRequest(`/officer/application/${applicationId}/action`, {
      method: 'POST',
      body: JSON.stringify({ action, notes })
    });
  } catch (err) {
    return {
      success: true,
      application_id: applicationId,
      new_status: action === 'approve' ? 'approved' : (action === 'flag_inspection' ? 'inspection_pending' : 'rejected'),
      notes: notes || 'Updated via portal'
    };
  }
};

// Scheme Monitoring
export const getSchemeStats = async (districtId = 'dist_gorakhpur') => {
  try {
    return await apiRequest(`/officer/scheme-stats?district_id=${districtId}`);
  } catch (err) {
    return {
      district_id: districtId,
      summary: {
        total_allocated_cr: 115.0,
        total_disbursed_cr: 95.7,
        utilization_rate_pct: 83.2,
        total_beneficiaries: 3487,
        total_pending_approval: 182
      },
      schemes: [
        {
          id: 'pmegp',
          name: 'PMEGP (Prime Minister Employment Generation)',
          ministry: 'MSME',
          allocated_cr: 45.0,
          disbursed_cr: 38.2,
          subsidy_released_cr: 12.4,
          beneficiaries_count: 1420,
          pending_approval: 84,
          repayment_health_pct: 92.4,
          at_risk_count: 42,
          avg_subsidy_pct: 32.5
        },
        {
          id: 'mudra_kishore',
          name: 'PM MUDRA (Kishore ₹50k-5L)',
          ministry: 'Ministry of Finance',
          allocated_cr: 30.0,
          disbursed_cr: 26.8,
          subsidy_released_cr: 0.0,
          beneficiaries_count: 1180,
          pending_approval: 45,
          repayment_health_pct: 90.8,
          at_risk_count: 68,
          avg_subsidy_pct: 0.0
        },
        {
          id: 'pmfme',
          name: 'PMFME (Micro Food Processing)',
          ministry: 'MoFPI',
          allocated_cr: 22.0,
          disbursed_cr: 16.5,
          subsidy_released_cr: 5.8,
          beneficiaries_count: 520,
          pending_approval: 31,
          repayment_health_pct: 95.1,
          at_risk_count: 18,
          avg_subsidy_pct: 35.0
        },
        {
          id: 'standup_india',
          name: 'Stand-Up India (SC/ST/Women)',
          ministry: 'Ministry of Finance',
          allocated_cr: 18.0,
          disbursed_cr: 14.2,
          subsidy_released_cr: 3.2,
          beneficiaries_count: 367,
          pending_approval: 22,
          repayment_health_pct: 94.0,
          at_risk_count: 12,
          avg_subsidy_pct: 25.0
        }
      ]
    };
  }
};

// Officer AI Natural Language Query
export const askOfficerAi = async (query: string, districtId = 'dist_gorakhpur') => {
  try {
    return await apiRequest('/officer/ai-assistant', {
      method: 'POST',
      body: JSON.stringify({ query, district_id: districtId })
    });
  } catch (err) {
    return {
      query,
      district_id: districtId,
      answer: `Found 182 at-risk rural enterprises in ${districtId === 'dist_gorakhpur' ? 'Gorakhpur' : districtId}. The top risk factors are feed raw material inflation (58 cases) and delayed B2B invoice clearances (42 cases). Recommended action: initiate Field Officer cluster verification and deploy Working Capital Top-up under PM MUDRA.`,
      sql_context: {
        total_at_risk: 182,
        dairy_risk: 84,
        poultry_risk: 54,
        processing_risk: 44,
        repayment_health_district: '91.4%'
      }
    };
  }
};
